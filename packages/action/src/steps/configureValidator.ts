import path from 'path';
import { getValidator } from '@compliancepal/spectral-rulesets';

export const configureValidator = async () => {
  const ROOT_PATH: string = process.env.GITHUB_WORKSPACE || process.cwd();
  let customRulesFilepath: string | null = null;

  if (process.env.INPUT_RULES) {
    customRulesFilepath = path.join(process.env.INPUT_RULES, 'rules.yaml');

    return getValidator(path.join(ROOT_PATH, customRulesFilepath), {
      defaultRules:
        process.env.INPUT_DISABLE_DEFAULT_RULES?.toLowerCase() !== 'true',
    });
  } else {
    return getValidator();
  }
};
