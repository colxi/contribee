import { GithubApi } from '../api/index.ts'
import { ContributionsTracker } from './contributions-tracker.ts'
import type {
  Config,
  ContriBeeOptions,
  AnalysisSnapshot,
} from '../types/index.ts'

export class ContriBee {
  constructor(options: ContriBeeOptions) {
    this.config = options.config
    this.onProgressCallback = options.onProgress || this.onProgressCallback
    this.onCompleteCallback = options.onComplete || this.onCompleteCallback
    this.githubApi = new GithubApi(options.config)
    this.contributionsTracker = new ContributionsTracker(
      this.config.trackedContributors
    )
  }

  private config: Config
  private githubApi: GithubApi
  private contributionsTracker: ContributionsTracker
  private totalPullRequests = 0
  private currentPullRequest = 0
  private startTime = 0

  private onProgressCallback = (_snapshot: AnalysisSnapshot) => {}
  private onCompleteCallback = (_snapshot: AnalysisSnapshot) => {}

  private onProgress = () => {
    this.onProgressCallback({
      config: this.config,
      totalPullRequests: this.totalPullRequests,
      currentPullRequest: this.currentPullRequest,
      results: this.contributionsTracker.getResults(),
      elapsedTime: Date.now() - this.startTime,
    })
  }

  private onComplete = () => {
    this.onCompleteCallback({
      config: this.config,
      totalPullRequests: this.totalPullRequests,
      currentPullRequest: this.currentPullRequest,
      results: this.contributionsTracker.getResults(),
      elapsedTime: Date.now() - this.startTime,
    })
  }

  public async start() {
    this.startTime = Date.now()
    // Retrieve all Prs
    const pullRequests = await this.githubApi.getPullRequestsUntil(
      this.config.duration,
      (count) => {
        console.log(count)
        this.totalPullRequests = count
        this.onProgress()
      }
    )
    this.totalPullRequests = pullRequests.length
    this.onProgress()
    // Iterate each Pr
    for (const pullRequest of pullRequests) {
      this.currentPullRequest++
      const ownerName = pullRequest.user.login
      this.contributionsTracker.countPullRequestFor(ownerName, {
        title: pullRequest.title,
        date: pullRequest.created_at,
      })
      // Retrieve Pr reviewers, changes count and comments for current Pr
      const [reviewers, changesCount, comments] = await Promise.all([
        this.githubApi.getPullRequestReviewers(pullRequest.number),
        this.githubApi.getPullRequestChangesCount(pullRequest.number),
        this.githubApi.getPullRequestComments(pullRequest.number),
      ])
      this.contributionsTracker.countChangesFor(ownerName, changesCount)
      for (const reviewer of reviewers) {
        this.contributionsTracker.countReviewFor(reviewer)
      }
      for (const commentAuthor in comments) {
        this.contributionsTracker.countCommentsFor(
          commentAuthor,
          comments[commentAuthor]!
        )
      }
      this.onProgress()
    }
    this.onComplete()

    return this.contributionsTracker.getResults()
  }
}
