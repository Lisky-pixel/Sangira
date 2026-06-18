/**
 * PLACEHOLDER — donor track-record stats until pickup/completion data ships.
 * TODO: replace with live stats from completed transfers and meals redistributed.
 */
export type DonorTrackRecordStats = {
  transfersCompleted: number
  mealsRedistributed: number
}

const PLACEHOLDER_DONOR_TRACK_RECORD: DonorTrackRecordStats = {
  transfersCompleted: 23,
  mealsRedistributed: 1240,
}

/** PLACEHOLDER boundary — swap when pickup/completion backend ships */
export function getPlaceholderDonorTrackRecord(
  donorId: string,
): DonorTrackRecordStats {
  void donorId
  return PLACEHOLDER_DONOR_TRACK_RECORD
}
