import { Rule } from '@stoplight/spectral-core';
import { join } from 'path';
import { getValidator } from './validator';

describe('validator', () => {
  describe('with default rules', () => {
    it('with custom rules', async () => {
      const validator = await getValidator(
        join(__dirname, '__fixtures__/rules.yaml'),
      );

      expect(validator.ruleset).toMatchObject({
        extends: expect.any(Array),
      });
    });

    it('with no rules', async () => {
      const validator = await getValidator();

      expect(validator.ruleset).toMatchObject({
        extends: null,
        rules: {
          schema: expect.any(Rule),
        },
      });
    });
  });

  describe('without default rules', () => {
    it('loads custom rules', async () => {
      const validator = await getValidator(
        join(__dirname, '__fixtures__/rules.yaml'),
        {
          defaultRules: false,
        },
      );

      expect(validator.ruleset).toMatchObject({
        extends: null,
      });
    });
  });
});
