import { ContriBee } from './engine/index.ts'
import { formatElapsedTime } from './utils/formatters.ts'
import { getConfig } from './utils/config.ts'

new ContriBee({
  config: getConfig(),
  onProgress: ({
    config,
    currentPullRequest,
    totalPullRequests,
    elapsedTime,
    results,
  }) => {
    const formatted: Record<string, any> = {}
    for (const contributorName in results) {
      const contributor = results[contributorName]!
      formatted[contributorName] = {
        prs: contributor.prsCount,
        review: contributor.reviewsCount,
        comments: contributor.commentsCount,
        codeChanges: contributor.changesCount,
      }
    }
    console.clear()
    console.log(``)
    console.log(`🐝 ContriBee 🐝`)
    console.log(
      `A simple GitHub repository contributions analyser for the command line`
    )
    console.log(``)
    console.log(`- Repository: ${config.repoOwner}/${config.repoName}`)
    console.log(`- Duration: ${config.duration}`)
    console.log(`- PRs found: ${totalPullRequests}`)
    console.log(`- PRs analyzed: ${currentPullRequest}/${totalPullRequests}`)
    console.log(`- Elapsed time: ${formatElapsedTime(elapsedTime)}`)
    console.table(formatted)
  },
  onComplete: ({ results, config }) => {
    if (config.listPullRequests) {
      for (const contributorName in results) {
        const contributor = results[contributorName]!
        console.log(`Contributor: ${contributorName}`)
        for (const pullRequest of contributor.pullRequests) {
          console.log(` ${pullRequest.date} - ${pullRequest.title}`)
        }
      }
    }
  },
}).start()
