import { truthy } from '@stoplight/spectral-functions';

const rules = {
  // TODO: The rules should be fixed. (This a dummy set)
  rules: {
    'no-empty-description': {
      given: '$.description',
      message: 'Description must not be empty',
      then: {
        function: truthy,
      },
    },
  },
};

export default rules;
