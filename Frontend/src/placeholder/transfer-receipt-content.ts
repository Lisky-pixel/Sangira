import type { HandoverCondition } from '../constants/handover-condition'
import type { QuantityUnit } from '../constants/listing-form'
import { HANDOVER_CONDITION } from '../constants/handover-condition'
import { TRANSFER_RECEIPT_FROM } from '../constants/transfer-receipt'
import { NGO_REQUESTS_TAB } from '../constants/ngo-requests'
import { resolvePortalRoute } from '../constants/portal-routes'
import { ADMIN_ROLE } from '../constants/portal-roles'
import { formatPickupByTime } from '../lib/format-listing-time'
import { postListingContent } from './post-listing-content'
import {
  ngoRequestsPath,
  ROUTES,
} from '../routes/paths'

export const transferReceiptContent = {
  pageTitle: 'Transfer receipt',
  loading: 'Loading transfer receipt…',
  loadError: 'Could not load this transfer receipt.',
  notAvailable: 'No receipt is available for this transfer.',
  backLink: '← Back',
  completedStatus: 'Completed',
  completedAtRelative: (relative: string) => `${relative}`,
  completedAtAbsolute: (iso: string) => formatPickupByTime(iso),
  fromLabel: 'From',
  toLabel: 'To',
  foodHeading: 'Food donated',
  impactHeading: 'Impact recorded',
  impactMeals: (count: number) =>
    `${count.toLocaleString()} meal${count === 1 ? '' : 's'} redistributed`,
  impactKg: (kg: number) =>
    `${kg.toLocaleString()} kg waste prevented`,
  impactItems: (count: number) =>
    `${count.toLocaleString()} item${count === 1 ? '' : 's'} redistributed`,
  conditionHeading: 'Condition report',
  conditionSubheading:
    'Verified outcome of the handover — recorded by the receiving organisation.',
  conditionLabels: {
    [HANDOVER_CONDITION.AS_DESCRIBED]: 'As described',
    [HANDOVER_CONDITION.PARTIAL]: 'Partial',
    [HANDOVER_CONDITION.ISSUE]: 'Issue reported',
  } satisfies Record<HandoverCondition, string>,
  conditionDefaultNote: {
    [HANDOVER_CONDITION.AS_DESCRIBED]: 'Received as described.',
    [HANDOVER_CONDITION.PARTIAL]: '',
    [HANDOVER_CONDITION.ISSUE]: '',
  } satisfies Record<HandoverCondition, string>,
  pickupHeading: 'Pickup location',
  referenceLabel: 'Reference',
  referenceValue: (id: string) => id,
  quantityLine: (input: {
    title: string
    quantity: number
    quantityUnit: QuantityUnit
    foodTypeLabel: string
  }) => {
    const unitLabel = postListingContent.quantityUnitLabels[input.quantityUnit]
    return {
      title: input.title,
      detail: `${input.foodTypeLabel} · ${input.quantity} ${unitLabel}`,
    }
  },
  backTargets: {
    [TRANSFER_RECEIPT_FROM.NGO_REQUESTS]: ngoRequestsPath(
      NGO_REQUESTS_TAB.COMPLETED,
    ),
    [TRANSFER_RECEIPT_FROM.DONOR_LISTINGS]: ROUTES.DONOR_LISTINGS,
    [TRANSFER_RECEIPT_FROM.DONOR_ACTIVITY]: ROUTES.DONOR_ACTIVITY,
    [TRANSFER_RECEIPT_FROM.ADMIN]: ROUTES.ADMIN_LISTINGS,
  },
  defaultBackForRole: (role: string) =>
    role === ADMIN_ROLE ? ROUTES.ADMIN_OVERVIEW : resolvePortalRoute(role),
}
