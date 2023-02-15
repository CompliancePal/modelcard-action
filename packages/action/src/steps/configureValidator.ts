import { getValidator } from '@compliancepal/spectral-rulesets';

export const configureValidator = async (opts: {
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
