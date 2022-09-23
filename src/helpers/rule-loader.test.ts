import loadCustomRuleset from './rule-loader';
import { RulesetDefinition } from '@stoplight/spectral-core';

describe('Custom rules', () => {
  describe('Rule loader', () => {
    it('loads custom rules', async () => {
      process.cwd();
      const custom_rules: RulesetDefinition | undefined =
        await loadCustomRuleset(process.cwd() + '/src/rules/rules.yaml');

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

    it('returns undefined on bad path', async () => {
      process.cwd();
      const custom_rules: RulesetDefinition | undefined =
        await loadCustomRuleset('bad path');

      expect(custom_rules).toBeUndefined();
    });
  });
});
