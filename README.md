# Modelcard Validator

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
3. As you can see from the example above, any and all custom functions can be imported using `require` and the path given as input. A custom validation function gets an input string and returns an array of objects if it finds something wrong, or nothing in case all is good. More info about the return messages and custom functions in general can be found in the [Spectral documentation](https://meta.stoplight.io/docs/spectral/ZG9jOjI1MTkw-custom-functions)
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
4. Then the github action still needs to know where to look for the `rules.js` file. In the `MLproject`file add the property
`modelcard_rules: {path}`, where `path` is the relative path from the project root to the rules directory, for example in the format `.modelcard/rules` (in which case the complete path to `rules.js` would be `{repo_root}/.modelcard/rules/rules.js`). 