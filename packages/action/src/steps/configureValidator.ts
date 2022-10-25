import path from 'path';
import * as core from '@actions/core';
import {
  getValidator,
  RulesetValidationError,
} from '@compliancepal/spectral-rulesets';
import { renderRulesetValidationSummary } from '../helpers/templates';

export const configureValidator = async () => {
  const ROOT_PATH: string = process.env.GITHUB_WORKSPACE || process.cwd();
  let customRulesFilepath: string | null = null;

  try {
    if (process.env.INPUT_RULES) {
      customRulesFilepath = path.join(process.env.INPUT_RULES, 'rules.yaml');

      return getValidator(path.join(ROOT_PATH, customRulesFilepath), {
        defaultRules: !(
          process.env.INPUT_DISABLE_DEFAULT_RULES?.toLowerCase() === 'true'
        ),
      });
    } else {
      return getValidator();
    }
  } catch (error) {
    if (error instanceof RulesetValidationError) {
      core.info(`problems in file ${customRulesFilepath}`);

      error.annotations.forEach((annotation) => {
        core.error(`${annotation.jsonPath.join('.')} - ${annotation.message}`, {
          file: customRulesFilepath!,
          title: annotation.title,
          startLine: annotation.start_line,
          endLine: annotation.end_line,
        });
      });

      await core.summary.addRaw(renderRulesetValidationSummary(error)).write();
    }

    if (error instanceof Error) {
      core.setFailed(error);
    }

    throw error;
  }
};
