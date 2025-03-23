import { Octokit } from 'octokit'
import { DurationInMillis } from '../constants/index.ts'
import type { Config, Duration } from '../types/index.ts'

export class GithubApi {
  constructor(config: Config) {
    this.config = config
    this.octokit = new Octokit({ auth: config.accessToken })
  }

  private config: Config
  private octokit: Octokit

  async getPullRequestsUntil(
    duration: Duration,
    onProgress: (amount: number) => void = () => undefined
  ) {
    let results: any[] = []
    const targetTimestamp = Date.now() - DurationInMillis[duration]
    await this.octokit.paginate(
      'GET /repos/{owner}/{repo}/pulls',
      {
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        per_page: 100,
        state: 'all',
      },
      (response: any, done: () => void) => {
        for (const pr of response.data) {
          const prCreationTime = new Date(pr.created_at).getTime()
          const isPrInTimeRange = prCreationTime > targetTimestamp
          if (isPrInTimeRange) {
            results.push(pr)
            onProgress(results.length)
          } else {
            done()
            break
          }
        }
        return response.data
      }
    )
    return results
  }

  async getPullRequestReviewers(pullNumber: number) {
    const { data: reviews } = await this.octokit.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}/reviews',
      {
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        pull_number: pullNumber,
      }
    )
    const reviewersIds = [
      ...new Set(
        reviews
          .filter((review) => review.user)
          .map((review) => review.user!.login)
      ),
    ]
    return reviewersIds
  }

  async getPullRequestChangesCount(pullNumber: number) {
    const { data: pr } = await this.octokit.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}',
      {
        owner: this.config.repoOwner,
        repo: this.config.repoName,
        pull_number: pullNumber,
      }
    )
    return pr.additions + pr.deletions
  }

  async getPullRequestComments(pullNumber: number) {
    const [reviewComments, issueComments]: any[] = await Promise.all([
      this.octokit.paginate(
        'GET /repos/{owner}/{repo}/pulls/{pull_number}/comments',
        {
          owner: this.config.repoOwner,
          repo: this.config.repoName,
          pull_number: pullNumber,
        }
      ),
      this.octokit.paginate(
        'GET /repos/{owner}/{repo}/issues/{pull_number}/comments',
        {
          owner: this.config.repoOwner,
          repo: this.config.repoName,
          pull_number: pullNumber,
        }
      ),
    ])

    const allComments: { user: { login: string } }[] = [
      ...reviewComments,
      ...issueComments,
    ]

    const commentsByAuthor = allComments.reduce((acc, comment) => {
      acc[comment.user.login] = (acc[comment.user.login] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return commentsByAuthor
  }
}
