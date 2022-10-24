import path from 'path';
import * as core from '@actions/core';
import {
  loader,
  RulesetValidationError,
} from '@compliancepal/spectral-rulesets';
import { RulesetDefinition } from '@stoplight/spectral-core';
import { renderRulesetValidationSummary } from '../helpers/templates';

export const loadCustomRuleset = async (): Promise<
  RulesetDefinition | undefined
> => {
  const ROOT_PATH: string = process.env.GITHUB_WORKSPACE || process.cwd();

  if (!process.env.INPUT_RULES) return;

  const filepath = path.join(process.env.INPUT_RULES, 'rules.yaml');

  try {
    const res = await loader(path.join(ROOT_PATH, filepath));

    return res;
  } catch (error) {
    if (error instanceof RulesetValidationError) {
      core.info(`problems in file ${filepath}`);

      error.annotations.forEach((annotation) => {
        core.error(`${annotation.jsonPath.join('.')} - ${annotation.message}`, {
          file: filepath,
          title: annotation.title,
          startLine: annotation.start_line,
          endLine: annotation.end_line,
        });
      });

      core.summary.addRaw(renderRulesetValidationSummary(error));
    }

    if (error instanceof Error) {
      core.setFailed(error);
    }

    throw error;
  }
};
