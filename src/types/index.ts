import type { z } from 'zod'
import { ConfigSchema, DurationEnum } from '../schemas/index.ts'

export type Duration = z.infer<typeof DurationEnum>

export type Config = z.infer<typeof ConfigSchema>

export type ContributorPullRequest = {
  date: string
  title: string
}

export type ContributorStatsMap = {
  prsCount: number
  reviewsCount: number
  commentsCount: number
  changesCount: number
  pullRequests: ContributorPullRequest[]
}

export type ContriBeeOptions = {
  config: Config
  onProgress?: (snapshot: AnalysisSnapshot) => void
  onComplete?: (snapshot: AnalysisSnapshot) => void
}

export type AnalysisSnapshot = {
  config: Config
  totalPullRequests: number
  currentPullRequest: number
  results: Record<string, ContributorStatsMap>
  elapsedTime: number
}
