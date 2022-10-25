import {
  Document,
  ISpectralDiagnostic,
  Ruleset,
  Spectral,
} from '@stoplight/spectral-core';
import * as Parsers from '@stoplight/spectral-parsers';
import loadCustomRuleset from './rule-loader';
import { defaultRules } from './rules';

interface ValidatorOptions {
  defaultRules: boolean;
}

export interface ModelCardValidator {
  validate: (content: string) => Promise<ISpectralDiagnostic[]>;
  ruleset: Ruleset;
}

export const getValidator: {
  /**
   * Returns a validator with the default ruleset
   */
  (): Promise<ModelCardValidator>;
  /**
   * Returns a validator with the custom ruleset extending the default ruleset
   */
  (customRulesFilepath: string): Promise<ModelCardValidator>;
  /**
   * Returns a validator with the custom ruleset that can extend or not the default ruleset, base don the options provided
   */
  (
    customRulesFilepath: string,
    opts: ValidatorOptions,
  ): Promise<ModelCardValidator>;
} = async (
  customRulesFilepath?: string,
  opts: ValidatorOptions = {
    defaultRules: true,
  },
): Promise<ModelCardValidator> => {
  const customRules = customRulesFilepath
    ? await loadCustomRuleset(customRulesFilepath)
    : undefined;
  const spectral = new Spectral();

  if (customRules) {
    if (opts.defaultRules) {
      spectral.setRuleset({
        ...customRules,
        extends: defaultRules,
      });
    } else {
      spectral.setRuleset(customRules);
    }
  } else {
    spectral.setRuleset(defaultRules);
  }

  return {
    validate: (content: string) => {
      return spectral.run(new Document(content, Parsers.Yaml));
    },
    get ruleset() {
      return spectral.ruleset!;
    },
  };
};