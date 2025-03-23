import commandLineArgs from 'command-line-args'
import type { Config } from '../types/index.ts'
import { DurationInMillis } from '../constants/index.ts'
import fs from 'fs'
import { ConfigSchema } from '../schemas/index.ts'

const usageMessage = `
🐝 ContriBee 🐝   
A simple GitHub repository contributions analyser for the command line

Usage:
 -r   repository      (required)    eg. -r repoOwner/repoName
 -d   duration        (required)    eg. -d 1w
 -t   github token    (optional)    eg: -r <auth-token>
 -c   contributors    (optional)    eg. -c user1,user2,user3
 -l   list prs        (optional)    
 -h   help                
`

export const getConfigFromCommandLineArgs = (): Partial<Config> | null => {
  const optionDefinitions = [
    { name: 'repo', alias: 'r', type: String },
    { name: 'duration', alias: 'd', type: String },
    { name: 'token', alias: 't', type: String },
    { name: 'contributors', alias: 'c', type: String },
    { name: 'list prs', alias: 'l' },
    { name: 'help', alias: 'h' },
  ]
  const config: Partial<Config> = {}
  const cliArgs = commandLineArgs(optionDefinitions)

  if ('help' in cliArgs) {
    console.log(usageMessage)
    process.exit(0)
  }

  if (cliArgs.repo) {
    const [repoOwner, repoName] = cliArgs.repo.split('/')
    if (!repoOwner || !repoName) {
      throw new Error('Invalid repository format (Expected repoOwner/repoName)')
    }
    config.repoOwner = repoOwner
    config.repoName = repoName
  }

  if (cliArgs.duration) {
    const isValidDuration = Object.keys(DurationInMillis).includes(
      cliArgs.duration
    )
    if (!isValidDuration) {
      throw new Error(
        'Invalid duration value (Expected: 1d | 2d | 3d | 4d | 5d | 6d | 1w | 2w | 3w | 4w | 1m | 2m | 3m)'
      )
    }
    config.duration = cliArgs.duration
  }

  if (cliArgs.token) {
    const isValidToken = Boolean(cliArgs.token.length)
    if (!isValidToken) {
      throw new Error('Invalid github token length')
    }
    config.accessToken = cliArgs.token
  }

  if (cliArgs.contributors) {
    const contributors: string[] = cliArgs.contributors.split(',')
    config.trackedContributors = contributors
  }

  return Object.keys(config).length
    ? ConfigSchema.partial().parse(config)
    : null
}

const getConfigFromFile = (): Config | null => {
  const configFilePath = './config.json'
  const configFileExists = fs.existsSync(configFilePath)
  if (configFileExists) {
    const configFileData: string = fs.readFileSync(configFilePath, 'utf-8')
    const configData: Config = JSON.parse(configFileData)
    return ConfigSchema.parse(configData)
  } else {
    return null
  }
}

export const getConfig = (): Config => {
  let configFromFile = getConfigFromFile()
  const configFromCommandLineParams = getConfigFromCommandLineArgs()

  if (configFromFile && configFromCommandLineParams) {
    return { ...configFromFile, ...configFromCommandLineParams }
  } else if (configFromFile) {
    return configFromFile
  } else if (configFromCommandLineParams) {
    if (typeof configFromCommandLineParams.trackedContributors === undefined) {
      configFromCommandLineParams.trackedContributors = []
    }
    if (typeof configFromCommandLineParams.accessToken === undefined) {
      configFromCommandLineParams.accessToken = ''
    }
    if (typeof configFromCommandLineParams.listPullRequests === undefined) {
      configFromCommandLineParams.listPullRequests = false
    }
    return ConfigSchema.parse(configFromCommandLineParams)
  } else {
    console.log(usageMessage)
    process.exit(-1)
  }
}
