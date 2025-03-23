import type { Duration } from '../types/index.ts'

const oneHourInMillis = 60 * 60 * 1000
const oneDayInMillis = 24 * oneHourInMillis

export const DurationInMillis: Record<Duration, number> = {
  '1d': 1 * oneDayInMillis,
  '2d': 2 * oneDayInMillis,
  '3d': 3 * oneDayInMillis,
  '4d': 4 * oneDayInMillis,
  '5d': 5 * oneDayInMillis,
  '6d': 6 * oneDayInMillis,
  '1w': 7 * oneDayInMillis,
  '2w': 14 * oneDayInMillis,
  '3w': 21 * oneDayInMillis,
  '4w': 28 * oneDayInMillis,
  '1m': 30 * oneDayInMillis,
  '2m': 60 * oneDayInMillis,
  '3m': 90 * oneDayInMillis,
}
