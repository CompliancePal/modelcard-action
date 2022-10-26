import { RulesetDefinition } from '@stoplight/spectral-core';
import { schema } from '@stoplight/spectral-functions';
import { readFileSync } from 'fs';
import { join } from 'path';

const loadSchema = () =>
  JSON.parse(
    readFileSync(
      join(__dirname, '../resources/schemas/modelcard-v0.0.2.json'),
      'utf8',
    ),
  );

export const defaultRules: RulesetDefinition = {
  rules: {
    schema: {
      given: '$',
      then: {
        function: schema,
        functionOptions: {
          schema: loadSchema(),
          dialect: 'draft7',
        },
      },
    },
  },
};
