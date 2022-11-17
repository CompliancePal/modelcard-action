---
sidebar_position: 1
---

# Usage

The **modelcard-action** is a GitHub Action. You can use use in your workflows together with any other actions. The following is an example:

```yaml title=".github/workflows/validate.yml"
name: modelcard-test

on:
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  file-exists:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout branch
        uses: actions/checkout@v3

      - name: Check for model card file
        uses: CompliancePal/modelcard-action@main
        with:
          modelcard: modelcard.yaml
          rules: .modelcard/rules
```

The action accepts the following inputs:

| Name                  |  Type   | Required | Description                                                                         |
| --------------------- | :-----: | :------: | ----------------------------------------------------------------------------------- |
| modelcard             | string  |   true   | Relative path from the project root to the target model card .yaml file.            |
| rules                 | string  |  false   | Relative path to the folder containing custom rules.                                |
| disable_default_rules | boolean |  false   | If set to true and custom rules are defined, completely disables all default rules. |

Handled environment variables:

| Name       | Required | Description                                                                                                                                                                                                                            |
| ---------- | :------: | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SENTRY_DSN |  false   | Uploads the unhandled runtime errors to the corresponding [Sentry](https://sentry.io) project. You can obtain the DSN using your Sentry account from your organization's Settings > Projects > Client Keys (DSN) in the Sentry web UI. |
