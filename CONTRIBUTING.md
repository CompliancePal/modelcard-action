# How to contribute to modelcard-action

## Repo overview

This is a monorepo. It contains `apps` and `packages` organized as [workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces).

### Apps

| Name    | Description                 |
| ------- | --------------------------- |
| website | User documentation website. |

### Packages

| Name         | Description                                                                              |
| ------------ | ---------------------------------------------------------------------------------------- |
| action       | The GitHub action                                                                        |
| functions    | A set of functions that facilitate advanced rules for validation of model card documents |
| jest-presets | Shared Jest presets                                                                      |
| rulesets     | Loads the custom rulesets                                                                |
| tsconfig     | Shared Typescript configurations                                                         |

## Development

### Setup

Install [node](http://nodejs.org/), the minimum version is 18. If you have [nvm](https://github.com/nvm-sh/nvm) installed, execute nvm use and it'll pick the right version for you.

IDE / Editor of your choice - we use VSCode.

The build system relies on [Turborepo](https://turborepo.org).

### Tests

Tests are run via the Jest test runner.

```bash
npm run test -- --filter action
```

### Build the apps during development

Building the action:

```bash
npx turbo run dev --filter action
```

## Bugs & Feature Requests

We want to keep issues in this repo focused on bug reports and feature requests.

Before you open an issue, please search to see if anyone else has already opened an issue that might be similar to yours.

## Support

For help, discussions, or "how-to" type questions, please use [GitHub Discussions](https://github.com/CompliancePal/modelcard-action/discussions). If you are unsure if you are experiencing a bug then this is also a great place to start, as a discussion can be turned into an issue easily.

If you have found a security issue, please email hello@compliancepal.eu directly.
