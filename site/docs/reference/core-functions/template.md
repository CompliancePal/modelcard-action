---
sidebar_label: template
---

# Markdown template

This function validates that a markdown formatted string property conforms with the provided template.

| Name     | Description                             | Type     | Required |
| -------- | --------------------------------------- | -------- | -------- |
| template | The desired markdown formatted template | `string` | yes      |

```yaml title="ruleset.yaml"
rules:
  valid-markdown-description:
    given: '$.model_details.description'
    then:
      function: template
      functionOptions:
        template: |
          ## First section

          ## Second section
```
