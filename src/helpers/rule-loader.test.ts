import loadCustomRuleset from './rule-loader';
import { RulesetDefinition } from '@stoplight/spectral-core';
// /Users/hgmarkus/uh-work/modelcard-action/
describe('Custom rules', () => {
  describe('Rule loader', () => {
    it('loads custom rules', async () => {
      process.cwd();
      const custom_rules: RulesetDefinition | undefined =
        await loadCustomRuleset(process.cwd() + '/resources/rules/rules.yaml');

      expect(custom_rules).not.toBeUndefined();
    });

    it('returns undefined on bad path', async () => {
      process.cwd();
      const custom_rules: RulesetDefinition | undefined =
        await loadCustomRuleset('bad path');

      expect(custom_rules).toBeUndefined();
    });
  });
});
