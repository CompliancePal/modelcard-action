import { Spectral, Document, RulesetDefinition } from '@stoplight/spectral-core';
import * as Parsers from '@stoplight/spectral-parsers';
import rules from './rules';

export const validator = async (content: string, customRules?: RulesetDefinition) => {
  const spectral = new Spectral();
  const disable_default: boolean = process.env.INPUT_DISABLE_DEFAULT_RULES?.toLowerCase() === 'true'
  if (customRules){
    if (disable_default) {
      spectral.setRuleset(customRules);
    } else {
      const extendedRules: RulesetDefinition = { ...customRules, extends: rules };
      spectral.setRuleset(extendedRules);
    }
  } else {
    spectral.setRuleset(rules);
  }
  

  const modelCard = new Document(content, Parsers.Yaml);

  return spectral.run(modelCard);
};
