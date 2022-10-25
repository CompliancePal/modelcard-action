import { readFileSync } from 'fs';
import { Rule } from '@stoplight/spectral-core';
import { join } from 'path';
import { getValidator } from './validator';

describe('validator', () => {
  describe('rulesets', () => {
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

  describe('validate', () => {
    describe('with default rules', () => {
      test('valid model card schema', async () => {
        const validator = await getValidator();

        const content = readFileSync(
          join(__dirname, '__fixtures__/modelcards/basic.yaml'),
          'utf-8',
        );

        const res = await validator.validate(content);

        expect(res).toHaveLength(0);
      });

      test('invalid mode card schema', async () => {
        const validator = await getValidator();

        const content = readFileSync(
          join(__dirname, '__fixtures__/modelcards/invalid_schema.yaml'),
          'utf-8',
        );

        const res = await validator.validate(content);

        expect(res).toHaveLength(1);

        expect(res[0].message).toBe(
          '"performance_metrics" property type must be array',
        );
      });
    });

    describe('with custom rules', () => {
      test('valid model card schema with custom rules', async () => {
        const validator = await getValidator(
          join(__dirname, '__fixtures__/modelcards/ruleset.yaml'),
        );

        const content = readFileSync(
          join(__dirname, '__fixtures__/modelcards/basic.yaml'),
          'utf-8',
        );

        const res = await validator.validate(content);

        expect(res).toHaveLength(0);
      });
    });
  });
});
