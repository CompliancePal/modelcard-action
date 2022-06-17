import markdownValidator from '../functions/markdownValidator';
import { RulesetDefinition } from '@stoplight/spectral-core';
import { schema } from '@stoplight/spectral-functions';

const rules: RulesetDefinition = {
  // TODO: The rules should be fixed. (This a dummy set)
  rules: {
    'valid-markdown': {
      given: '$..description',
      recommended: false,
      message: '{{error}}',
      then: {
        function: markdownValidator,
      },
    },
    schema: {
      given: '$',
      then: {
        function: schema,
        functionOptions: {
          schema: require('../../resources/schemas/modelcard-v0.0.2.json'),
          dialect: 'draft7',
        },
      },
    },
  },
};

export default rules;
