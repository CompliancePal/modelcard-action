import { getValidator } from '@compliancepal/spectral-rulesets';

export const configureValidator = async (opts: {
  /**
   * Absolute path to the custom rules file
   */
  absCustomRulesFilepath?: string;
  disableDefaultRules: boolean;
}) => {
  if (opts.absCustomRulesFilepath) {
    return getValidator(opts.absCustomRulesFilepath, {
      defaultRules: !opts.disableDefaultRules,
    });
  } else {
    return getValidator();
  }
};
