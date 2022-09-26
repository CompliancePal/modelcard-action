---
sidebar_label: markdownTemplate
---

# Markdown template

This function validates that a markdown formatted string property conforms with the provided template.

| Name     | Description                             | Type     | Required |
| -------- | --------------------------------------- | -------- | -------- |
| template | The desired markdown formatted template | `string` | yes      |

```yaml title="example"
valid-markdown-description:
  given: '$.model_details.description',
  then:
    function: markdownTemplate,
    functionOptions:
      template: |
        ## First section

        ## Second section
```
