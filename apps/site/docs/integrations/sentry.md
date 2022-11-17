---
title: Sentry
description: Instruction for setting up the collection of unhandled runtime errors
---

## Overview

Uploads the unhandled runtime errors to the corresponding [Sentry](https://sentry.io) project.

## Configuration

### Sentry

You can obtain the DSN using your Sentry account from your organization's Settings > Projects > Client Keys (DSN) in the Sentry web UI.

### GitHub secret

Add the Sentry project key as a GitHub secret:

```env
SENTRY_DSN={dsn_value}
```

### Update workflow

```yaml title=".github/workflows/mlflow-integration.yml"
name: modelcard-test

on:
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  mlflow-modelcard:
    runs-on: ubuntu-latest
    steps:
      ...
      - name: Check for model card file
        uses: CompliancePal/modelcard-action@main
        env:
          # highlight-next-line
          SENTRY_DSN: ${{ secrets.SENTRY_DSN }}
        with:
          modelcard: modelcard.yaml
```
