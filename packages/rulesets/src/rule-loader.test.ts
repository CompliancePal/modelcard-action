import loadCustomRuleset from './rule-loader';
import { RulesetDefinition } from '@stoplight/spectral-core';
import { join } from 'path';
import { RulesetValidationError } from './errors';

describe('Custom rules', () => {
  describe('Rule loader', () => {
    it('loads custom rules', async () => {
      const custom_rules: RulesetDefinition | undefined =
        await loadCustomRuleset(join(__dirname, '__fixtures__/rules.yaml'));

      expect(custom_rules).not.toBeUndefined();

      expect(custom_rules).toMatchObject({
        rules: {
          'legal-version-name': {
            message: '{{error}}',
            given: '$.model_details.version.name',
            then: {
              function: expect.any(Function),
            },
          },
        },
      });
    });

    it('throws invalid-ruleset', async () => {
      try {
        await loadCustomRuleset(
          join(__dirname, '__fixtures__/rules-with-validation-errors.yaml'),
        );

        throw new Error('This should not happen');
      } catch (error) {
        expect(error).toBeInstanceOf(RulesetValidationError);
        expect((error as RulesetValidationError).code).toBe('invalid-ruleset');
        expect((error as RulesetValidationError).annotations).toHaveLength(3);
      }
    });

    it('throws unsupported-ruleset-format', async () => {
      try {
        await loadCustomRuleset(
          join(__dirname, '__fixtures__/wrong.extension'),
        );

        throw new Error('This should not happen');
      } catch (error) {
        expect(error).toBeInstanceOf(RulesetValidationError);
        expect((error as RulesetValidationError).code).toBe(
          'unsupported-ruleset-format',
        );
        expect((error as RulesetValidationError).annotations).toHaveLength(0);
      }
    });

    it('throws file-does-not-exist', async () => {
      try {
        await loadCustomRuleset('missing.yaml');

        throw new Error('This should not happen');
      } catch (error) {
        expect(error).toBeInstanceOf(RulesetValidationError);
        expect((error as RulesetValidationError).code).toBe(
          'file-does-not-exist',
        );
        expect((error as RulesetValidationError).annotations).toHaveLength(0);
      }
    });
  });
});
