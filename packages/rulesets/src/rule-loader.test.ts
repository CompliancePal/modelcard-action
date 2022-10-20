import loadCustomRuleset from './rule-loader';
import { RulesetDefinition } from '@stoplight/spectral-core';
import { join } from 'path';

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

    it('returns undefined on bad path', async () => {
      const custom_rules: RulesetDefinition | undefined =
        await loadCustomRuleset('bad path');

      expect(custom_rules).toBeUndefined();
    });
  });
});