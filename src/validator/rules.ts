import markdownValidator from '../functions/markdownValidator';
import { RulesetDefinition } from '@stoplight/spectral-core';

const rules: RulesetDefinition = {
  // TODO: The rules should be fixed. (This a dummy set)
  rules: {
    'valid-markdown': {
      given: '$..description',
      message: '{{error}}',
      then: {
        function: markdownValidator,
      },
    }
  },
};

export default rules;
