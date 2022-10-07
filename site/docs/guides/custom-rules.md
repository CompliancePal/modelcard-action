---
sidebar_position: 3
---

# Custom rules

The action performs the model card validation with a set of rules that follows the Spectral's [rulesets](https://meta.stoplight.io/docs/spectral/e5b9616d6d50c-custom-rulesets) conventions. Besides the Spectral [core functions](https://meta.stoplight.io/docs/spectral/e5b9616d6d50c-custom-rulesets#core-functions), **modelcard-action** provides a set of [functions](/category/core-functions) that simplify most common model card validation tasks.

## YAML

Model card validations can be achieved using the YAML ruleset configuration.

```yaml title="rules.yaml"
rules:
  legal-version-name:
    message: '{{error}}'
    given: '$.model_details.version.name'
    then:
      function: truthy
```
