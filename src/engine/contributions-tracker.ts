import type {
  ContributorPullRequest,
  ContributorStatsMap,
} from '../types/index.ts'

export class ContributionsTracker {
  constructor(trackedContributors: string[]) {
    this.trackedContributors = trackedContributors
  }

  private trackedContributors: string[]
  private contributorsStatsMap: Record<string, ContributorStatsMap> = {}

  private isValidContributor(contributor: string) {
    if (!this.trackedContributors.length) return true
    return this.trackedContributors.includes(contributor)
  }

  private getContributor(contributorId: string): ContributorStatsMap {
    if (!this.contributorsStatsMap[contributorId]) {
      this.contributorsStatsMap[contributorId] = {
        pullRequests: [],
        prsCount: 0,
        reviewsCount: 0,
        commentsCount: 0,
        changesCount: 0,
      }
    }
    return this.contributorsStatsMap[contributorId]
  }

  public getResults() {
    return this.contributorsStatsMap
  }

  public countPullRequestFor(
    contributorId: string,
    pullRequest: ContributorPullRequest
  ) {
    if (!this.isValidContributor(contributorId)) return
    const contributor = this.getContributor(contributorId)
    contributor.prsCount++
    contributor.pullRequests.push(pullRequest)
  }

  public countReviewFor(contributorId: string) {
    if (!this.isValidContributor(contributorId)) return
    const contributor = this.getContributor(contributorId)
    contributor.reviewsCount++
  }

  public countCommentsFor(contributorId: string, comments: number) {
    if (!this.isValidContributor(contributorId)) return
    const contributor = this.getContributor(contributorId)
    contributor.commentsCount += comments
  }

  public countChangesFor(contributorId: string, changes: number) {
    if (!this.isValidContributor(contributorId)) return
    const contributor = this.getContributor(contributorId)
    contributor.changesCount += changes
  }
}
