---
sidebar_position: 1
---

# Usage

The **modelcard-action** is a GitHub Action. You can use use in your workflows together with any other actions. The following is a simple example:

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
        uses: CompliancePal/modelcard-action@<branch/tag>
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
