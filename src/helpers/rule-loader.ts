import * as fs from 'fs';
import { bundleAndLoadRuleset } from '@stoplight/spectral-ruleset-bundler/with-loader';
import * as spectralRuntime from '@stoplight/spectral-runtime';
import { RulesetDefinition, Ruleset } from '@stoplight/spectral-core';

const { fetch } = spectralRuntime;

const loadCustomRuleset = async (
  path: string | undefined,
): Promise<RulesetDefinition | undefined> => {
  if (path) {
    try {
      const custom_rules: Ruleset = await bundleAndLoadRuleset(path, {
        fs,
        fetch,
      });
      return custom_rules.definition;
    } catch (err) {
      console.log(err);
    }
  }
  return undefined;
};

export default loadCustomRuleset;
