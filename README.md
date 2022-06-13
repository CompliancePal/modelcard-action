# Modelcard Validator

## Setting up the action

Since this action is hosted in a public repository, it's enough to add a reference to the repo and the branch/tag that you want to run. An example file located in a .github/workflows/<workflow_name>.yaml file

```
name: modelcard-test

on:
  pull_request:
    branches: [ main ]
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

## Inputs

The action accepts several different input parameters. 

### Required

* **modelcard**
  * Description:  Relative path from the project root to the target model card .yaml file.
  * default: `modelcard.yaml`

### Optional

* **rules** 
  * Description: Relative path to the folder containing custom rules.

## Adding custom rules
If you want to have custom rules in addition to the default ones, this is possible by using JavaScript. The application uses [Spectral](https://meta.stoplight.io/docs/spectral) to validate YAML files and has been configured to enable [custom rulesets](https://meta.stoplight.io/docs/spectral/e5b9616d6d50c-custom-rulesets). Here's how to add your own rules:
1. Create a folder in your project that will contain your rules and functions. Within that folder create a file called `rules.js`.
2. Within the file you can write your rule. Note that the file should export a function that takes one input parameter, which is the absolute path to the `rules` directory, and outputs a ruleset definition object. Here's a small example to get you started:
````
const path = require('path')

module.exports = (rulepath) => {
  const custom_function = require(path.join(rulepath, 'functions', 'custom-function'))
  return {
    rules: {
      'custom-function-works': {
        given: '$..description',
        message: '{{error}}',
        then: {
          function: custom_function,
        },
      }
    },
  };
}
````
3. It is possible to use any of Spectral's built in [core functions](https://meta.stoplight.io/docs/spectral/ZG9jOjExNg-core-functions), but if you want to create your own custom functions, this is possible. As you can see from the example above, any and all custom functions can be imported using `require` and the path given as input. A custom validation function gets an input string and returns an array of objects if it finds something wrong, or nothing in case all is good. More info about the return messages and custom functions in general can be found in the [Spectral documentation](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTkw-custom-functions)
````
module.exports = input => {
  if (input !== "hello") {
    return [
      {
        message: 'Value must equal "hello".',
      },
    ];
  }
};
````
4. Then the github action still needs to know where to look for the `rules.js` file. This is achieved by giving a _rules_ parameter as input to the action. Just add `rules: {path}` to your workflow file, where `path` is the relative path from the project root to the rules directory, for example in the format `.modelcard/rules` (in which case the complete path to `rules.js` would be `{repo_root}/.modelcard/rules/rules.js`). 