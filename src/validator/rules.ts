import { truthy } from '@stoplight/spectral-functions';
import markdownValidator from '../functions/markdownValidator';

const rules = {
  // TODO: The rules should be fixed. (This a dummy set)
  rules: {
    'no-empty-description': {
      given: '$..description',
      message: 'Description must not be empty',
      then: {
        function: truthy,
      },
    },
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
