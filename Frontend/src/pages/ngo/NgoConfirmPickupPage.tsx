import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import {
  NgoConfirmCompletionStep,
  NgoConfirmConditionStep,
  NgoConfirmPinStep,
} from '../../components/ngo/confirm-pickup'
import { HANDOVER_CONDITION, type HandoverCondition } from '../../constants/handover-condition'
import { HANDOVER_ERROR_CODES } from '../../constants/handover'
import { NGO_REQUESTS_TAB } from '../../constants/ngo-requests'
import { REQUEST_STATUS } from '../../constants/request-status'
import { useHandoverSocket } from '../../hooks/use-handover-socket'
import { ngoConfirmPickupContent } from '../../placeholder/ngo-confirm-pickup-content'
import { ngoRequestsPath } from '../../routes/paths'
import { ApiError } from '../../services/api-error'
import { handoverService } from '../../services/handover-service'
import { toast } from '../../lib/toast'
import type {
  HandoverCompletionImpact,
  HandoverUpdatedPayload,
  HandoverView,
} from '../../types/handover'

type ConfirmStep = 'pin' | 'condition' | 'completed'

function resolveInitialStep(handover: HandoverView): ConfirmStep {
  if (
    handover.status === REQUEST_STATUS.COMPLETED ||
    handover.confirmation.ngoConfirmed
  ) {
    return 'completed'
  }

  return 'pin'
}

function applyHandoverUpdate(
  current: HandoverView,
  payload: HandoverUpdatedPayload,
): HandoverView {
  return {
    ...current,
    status: payload.status,
    confirmation: {
      ...current.confirmation,
      donorConfirmed: payload.donorConfirmed,
      ngoConfirmed: payload.ngoConfirmed,
      ...(payload.completedAt
        ? { completedAt: payload.completedAt }
        : {}),
    },
  }
}

export function NgoConfirmPickupPage() {
  const { id: requestId } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [handover, setHandover] = useState<HandoverView | null>(null)
  const [step, setStep] = useState<ConfirmStep>('pin')
  const [loading, setLoading] = useState(true)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState<string | undefined>()
  const [condition, setCondition] = useState<HandoverCondition>(
    HANDOVER_CONDITION.AS_DESCRIBED,
  )
  const [note, setNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [impact, setImpact] = useState<HandoverCompletionImpact | undefined>()

  useEffect(() => {
    if (!requestId) {
      navigate(ngoRequestsPath(NGO_REQUESTS_TAB.ACCEPTED), { replace: true })
      return
    }

    let cancelled = false

    const load = async () => {
      setLoading(true)

      try {
        const { handover: view } = await handoverService.getHandover(requestId)

        if (cancelled) {
          return
        }

        if (view.status !== REQUEST_STATUS.ACCEPTED && view.status !== REQUEST_STATUS.COMPLETED) {
          toast.error(ngoConfirmPickupContent.loadError)
          navigate(ngoRequestsPath(NGO_REQUESTS_TAB.ACCEPTED), { replace: true })
          return
        }

        setHandover(view)
        setStep(resolveInitialStep(view))
      } catch (error) {
        if (cancelled) {
          return
        }

        if (error instanceof ApiError) {
          toast.error(error.message)
        } else {
          toast.error(ngoConfirmPickupContent.loadError)
        }

        navigate(ngoRequestsPath(NGO_REQUESTS_TAB.ACCEPTED), { replace: true })
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [requestId, navigate])

  const handleSocketUpdate = useCallback((payload: HandoverUpdatedPayload) => {
    setHandover((current) => {
      if (!current) {
        return current
      }

      const next = applyHandoverUpdate(current, payload)

      if (payload.status === REQUEST_STATUS.COMPLETED) {
        setStep('completed')
      }

      return next
    })
  }, [])

  const socketEnabled =
    Boolean(requestId) &&
    step === 'condition' &&
    handover?.status !== REQUEST_STATUS.COMPLETED

  useHandoverSocket(requestId ?? null, handleSocketUpdate, socketEnabled)

  const handleContinueFromPin = () => {
    setPinError(undefined)
    setStep('condition')
  }

  const handleScanQr = () => {
    toast.info(ngoConfirmPickupContent.pinStep.scanQrDeferred)
  }

  const handleConfirmReceipt = async () => {
    if (!requestId || !handover) {
      return
    }

    setIsSubmitting(true)
    const loadingId = toast.loading(
      ngoConfirmPickupContent.conditionStep.confirmToast.loading,
    )

    try {
      const result = await handoverService.confirmReceipt(requestId, {
        pin,
        condition,
        ...(note.trim() ? { note: note.trim() } : {}),
      })

      toast.success(
        ngoConfirmPickupContent.conditionStep.confirmToast.success,
        { id: loadingId },
      )

      setHandover((current) => {
        if (!current) {
          return current
        }

        return applyHandoverUpdate(current, result.handover)
      })

      if (result.impact) {
        setImpact(result.impact)
      }

      setStep('completed')
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.code === HANDOVER_ERROR_CODES.INCORRECT_PIN
      ) {
        toast.error(error.message, { id: loadingId })
        setPin('')
        setPinError(ngoConfirmPickupContent.pinStep.pinError)
        setStep('pin')
        return
      }

      if (
        error instanceof ApiError &&
        error.code === HANDOVER_ERROR_CODES.TOO_MANY_PIN_ATTEMPTS
      ) {
        toast.error(
          error.message || ngoConfirmPickupContent.pinStep.tooManyAttempts,
          { id: loadingId },
        )
        setPin('')
        setPinError(ngoConfirmPickupContent.pinStep.tooManyAttempts)
        setStep('pin')
        return
      }

      toast.error(
        error instanceof ApiError
          ? error.message
          : ngoConfirmPickupContent.conditionStep.confirmToast.error,
        { id: loadingId },
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <p className="text-body text-center text-sm">
        {ngoConfirmPickupContent.loading}
      </p>
    )
  }

  if (!handover || !requestId) {
    return null
  }

  return (
    <div>
      {step !== 'completed' ? (
        <Link
          to={ngoRequestsPath(NGO_REQUESTS_TAB.ACCEPTED)}
          className="text-primary mb-4 inline-flex text-sm font-medium hover:underline"
        >
          {ngoConfirmPickupContent.backToRequests}
        </Link>
      ) : null}

      {step === 'pin' ? (
        <NgoConfirmPinStep
          otherParty={handover.otherParty}
          listing={handover.listing}
          pin={pin}
          pinError={pinError}
          onPinChange={setPin}
          onContinue={handleContinueFromPin}
          onScanQr={handleScanQr}
        />
      ) : null}

      {step === 'condition' ? (
        <NgoConfirmConditionStep
          otherParty={handover.otherParty}
          listing={handover.listing}
          condition={condition}
          note={note}
          isSubmitting={isSubmitting}
          onConditionChange={setCondition}
          onNoteChange={setNote}
          onConfirm={() => void handleConfirmReceipt()}
        />
      ) : null}

      {step === 'completed' ? (
        <NgoConfirmCompletionStep
          otherParty={handover.otherParty}
          listing={handover.listing}
          completedAt={handover.confirmation.completedAt}
          impact={impact}
        />
      ) : null}
    </div>
  )
}
