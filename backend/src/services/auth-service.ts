import bcrypt from 'bcryptjs'
import type { Request } from 'express'
import { uploadCertificate } from '../config/cloudinary.js'
import {
  ACCOUNT_STATUS,
  ROLES,
  VERIFICATION_STATUS,
  type Role,
} from '../constants/enums.js'
import { TRANSPORT_MODE } from '../constants/transport-mode.js'
import { Donor, Ngo, User } from '../models/user.js'
import { RefreshToken } from '../models/refresh-token.js'
import {
  conflict,
  forbidden,
  unauthorized,
  badRequest,
  ValidationAppError,
} from '../utils/app-error.js'
import { resolveStoredDocumentFilename } from '../constants/verification-documents.js'
import { refreshTokenMaxAgeMs } from '../utils/duration.js'
import {
  generateFamilyId,
  generateOpaqueToken,
  hashOpaqueToken,
  signAccessToken,
} from '../utils/tokens.js'
import { buildVerificationDocumentEntry } from '../utils/verification-document.js'
import { normalizePhone } from '../utils/phone.js'
import { findUserByIdentifier } from '../utils/auth-identifier.js'
import type { LoginInput, RegisterInput } from '../validators/auth.js'

/** Bcrypt hash for a dummy password — used when email is unknown to reduce timing leaks */
const DUMMY_PASSWORD_HASH =
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'

function isDuplicateKeyError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: number }).code === 11000
  )
}

function getRequestMeta(req: Request) {
  return {
    ip: req.ip,
    userAgent: req.get('user-agent') ?? undefined,
  }
}

async function createRefreshSession(
  userId: string,
  familyId: string,
  req: Request,
) {
  const refreshToken = generateOpaqueToken()
  const tokenHash = hashOpaqueToken(refreshToken)
  const { ip, userAgent } = getRequestMeta(req)

  await RefreshToken.create({
    user: userId,
    tokenHash,
    familyId,
    expiresAt: new Date(Date.now() + refreshTokenMaxAgeMs),
    createdByIp: ip,
    userAgent,
  })

  return refreshToken
}

export async function issueAuthTokens(
  userId: string,
  role: Role,
  req: Request,
) {
  const accessToken = signAccessToken(userId, role)
  const familyId = generateFamilyId()
  const refreshToken = await createRefreshSession(userId, familyId, req)

  return { accessToken, refreshToken }
}

export async function registerUser(
  input: RegisterInput,
  file: Express.Multer.File,
  req: Request,
) {
  const email = input.email.toLowerCase().trim()
  const normalizedPhone = normalizePhone(input.phone)
  if (!normalizedPhone) {
    throw new ValidationAppError(
      { phone: 'Enter a valid Rwanda mobile number' },
      'Validation failed',
    )
  }

  const existing = await User.findOne({ email }).select('_id')
  if (existing) {
    throw conflict(
      'An account with this email already exists. Please sign in.',
      'EMAIL_EXISTS',
    )
  }

  const upload = await uploadCertificate(file.buffer, file.originalname).catch(
    () => {
      throw badRequest(
        'Failed to upload verification document',
        'DOCUMENT_UPLOAD_FAILED',
      )
    },
  )
  const now = new Date()
  const storedFilename = resolveStoredDocumentFilename(
    file.originalname,
    file.mimetype,
    input.role,
  )
  const documentEntry = buildVerificationDocumentEntry(
    upload,
    storedFilename,
    now,
  )

  const verification = {
    status: VERIFICATION_STATUS.PENDING,
    submittedAt: now,
    documents: [documentEntry],
  }

  try {
    if (input.role === ROLES.DONOR) {
      const user = await Donor.create({
        email,
        passwordHash: input.password,
        role: ROLES.DONOR,
        organisationName: input.organisationName.trim(),
        contactName: input.contactName.trim(),
        phone: normalizedPhone,
        businessCertificateUrl: upload.url,
        verification,
      })

      const tokens = await issueAuthTokens(user._id.toString(), ROLES.DONOR, req)
      return { user, tokens, verificationStatus: VERIFICATION_STATUS.PENDING }
    }

    const user = await Ngo.create({
      email,
      passwordHash: input.password,
      role: ROLES.NGO,
      organisationName: input.organisationName.trim(),
      contactName: input.contactName.trim(),
      phone: normalizedPhone,
      registrationNumber: input.registrationNumber.trim(),
      dailyCapacity: input.dailyCapacity,
      transportAvailable: input.transportAvailable,
      transport: {
        hasOwnTransport: input.transportAvailable,
        ...(input.transportAvailable
          ? { mode: TRANSPORT_MODE.VAN }
          : {}),
      },
      verification,
    })

    const tokens = await issueAuthTokens(user._id.toString(), ROLES.NGO, req)
    return { user, tokens, verificationStatus: VERIFICATION_STATUS.PENDING }
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw conflict(
        'An account with this email already exists. Please sign in.',
        'EMAIL_EXISTS',
      )
    }
    throw error
  }
}

export async function loginUser(input: LoginInput, req: Request) {
  const identifier = input.identifier.trim()
  const user = (await findUserByIdentifier(identifier, '+passwordHash')) as
    | (typeof User)['prototype']
    | null

  const passwordHash = user?.passwordHash ?? DUMMY_PASSWORD_HASH
  const passwordValid = await bcrypt.compare(input.password, passwordHash)

  if (!user || !passwordValid) {
    throw unauthorized('Invalid credentials', 'INVALID_CREDENTIALS')
  }

  if (
    user.accountStatus === ACCOUNT_STATUS.SUSPENDED ||
    user.accountStatus === ACCOUNT_STATUS.REVOKED
  ) {
    throw forbidden(
      'This account has been suspended or revoked',
      'ACCOUNT_BLOCKED',
    )
  }

  const tokens = await issueAuthTokens(
    user._id.toString(),
    user.role as Role,
    req,
  )

  const verificationStatus =
    (user as { verification?: { status?: string } }).verification?.status ??
    VERIFICATION_STATUS.PENDING

  return { user, tokens, verificationStatus }
}

export async function refreshSession(
  refreshToken: string | undefined,
  req: Request,
) {
  if (!refreshToken) {
    throw unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN')
  }

  const tokenHash = hashOpaqueToken(refreshToken)
  const stored = await RefreshToken.findOne({ tokenHash })

  if (!stored) {
    throw unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN')
  }

  if (stored.revoked) {
    await RefreshToken.updateMany(
      { familyId: stored.familyId },
      { revoked: true },
    )
    throw unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN')
  }

  if (stored.expiresAt.getTime() <= Date.now()) {
    await RefreshToken.updateMany(
      { familyId: stored.familyId },
      { revoked: true },
    )
    throw unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN')
  }

  const user = await User.findById(stored.user)
  if (!user) {
    throw unauthorized('Invalid refresh token', 'INVALID_REFRESH_TOKEN')
  }

  if (
    user.accountStatus === ACCOUNT_STATUS.SUSPENDED ||
    user.accountStatus === ACCOUNT_STATUS.REVOKED
  ) {
    throw forbidden(
      'This account has been suspended or revoked',
      'ACCOUNT_BLOCKED',
    )
  }

  stored.revoked = true
  await stored.save()

  const newRefreshToken = await createRefreshSession(
    user._id.toString(),
    stored.familyId,
    req,
  )
  const accessToken = signAccessToken(user._id.toString(), user.role as Role)

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user,
  }
}

export async function logoutSession(refreshToken: string | undefined) {
  if (!refreshToken) return

  const tokenHash = hashOpaqueToken(refreshToken)
  const stored = await RefreshToken.findOne({ tokenHash })

  if (!stored) return

  await RefreshToken.updateMany(
    { familyId: stored.familyId },
    { revoked: true },
  )
}

export async function getCurrentUser(userId: string) {
  const user = await User.findById(userId)

  if (!user) {
    throw unauthorized('Authentication required', 'UNAUTHORIZED')
  }

  const verificationStatus =
    (user as { verification?: { status?: string } }).verification?.status ??
    VERIFICATION_STATUS.PENDING

  return {
    user,
    verificationStatus,
    accountStatus: user.accountStatus,
  }
}
