import { RulesetDefinition } from '@stoplight/spectral-core';
import { readFileSync } from 'fs';
import { join } from 'path';
import { validator } from '../validator/index';
import markdownTemplate from './markdownTemplate';

describe('markdownTemplate', () => {
  it('valid', async () => {
    const rules: RulesetDefinition = {
      rules: {
        'valid-markdown-structure': {
          given: '$.model_details.description',
          then: {
            function: markdownTemplate,
            functionOptions: {
              template: `
## Header 1

## Header 2
              `,
            },
          },
        },
      },
    };

    const res = await validator(
      readFileSync(
        join(__dirname, '__fixtures__/markdownTemplate/valid.yaml'),
        'utf-8',
      ),
      rules,
    );

    expect(res).toHaveLength(0);
  });

  it('invalid', async () => {
    const rules: RulesetDefinition = {
      rules: {
        'valid-markdown-structure': {
          given: '$.model_details.description',
          severity: 'error',
          then: {
            function: markdownTemplate,
            functionOptions: {
              template: `
## Test
              `,
            },
          },
        },
      },
    };

    const res = await validator(
      readFileSync(
        join(__dirname, '__fixtures__/markdownTemplate/invalid.yaml'),
        'utf-8',
      ),
      rules,
    );

    expect(res).toHaveLength(1);
  });
});
