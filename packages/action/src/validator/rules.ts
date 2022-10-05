import { RulesetDefinition } from '@stoplight/spectral-core';
import { schema } from '@stoplight/spectral-functions';

const rules: RulesetDefinition = {
  rules: {
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
