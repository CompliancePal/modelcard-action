---
sidebar_position: 3
---

# Custom rules

The action performs the model card validation wing a set of rules that follows the Spectral's [rulesets](https://meta.stoplight.io/docs/spectral/e5b9616d6d50c-custom-rulesets) conventions. Besides the Spectral [core functions](https://meta.stoplight.io/docs/spectral/e5b9616d6d50c-custom-rulesets#core-functions), **modelcard-action** provides a set of functions simplify most common model card validation tasks.

## YAML

Most model card validations can be achieved using the YAML configuration.

Below is an example of a validation rule that checks that the model version follows the [semver](https://semver.org) convention:

```yaml title="rules.yaml"
rules:
  legal-version-name:
    message: '{{error}}'
    given: '$.model_details.version.name'
    then:
      function: semver
```

## JavaScript

Coming soon...
