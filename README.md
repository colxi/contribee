# 🐝 ContriBee 🐝

A simple GitHub repository contributions analyser for the command line

- Number of PRs created
- Number of PRs reviewed
- Number of comments ldt during PR reviews
- Total number of changes performed (additions + deletions)

# Installation

Clone the repository locally and run:

```bash
$ pnpm install
```

> You can use `npm` or `yarn` as well, but the project is optimized for pnpm

# Usage

> **IMPORTANT**: Node version `>=23.10.0` is required, as the program needs Typescript support

```bash
$ pnpm start -r <repo-owner>/<repo-name> -d <duration> -t <auth-token> -c <username1, username2>
```

If you plan run it regularly using the same parameters, you can create a config file in the root of the project (use config.example.json as reference) and simply run:

```bash
$ pnpm start
```

...or in case you want to override some of the configuration file parameters...

```bash
$ pnpm start -d 1w
```

For more options type:

```bash
$ pnpm start -h
```
