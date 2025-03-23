import { z } from 'zod'

export const DurationEnum = z.enum([
  '1d',
  '2d',
  '3d',
  '4d',
  '5d',
  '6d',
  '1w',
  '2w',
  '3w',
  '4w',
  '1m',
  '2m',
  '3m',
])

export const ConfigSchema = z.object({
  accessToken: z.string(),
  repoOwner: z.string(),
  repoName: z.string(),
  duration: DurationEnum,
  trackedContributors: z.array(z.string()),
  listPullRequests: z.boolean(),
})
