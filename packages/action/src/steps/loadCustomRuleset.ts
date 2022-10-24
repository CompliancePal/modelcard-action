import path from 'path';
import * as core from '@actions/core';
import * as github from '@actions/github';
import {
  loader,
  RulesetValidationError,
} from '@compliancepal/spectral-rulesets';
import { RulesetDefinition } from '@stoplight/spectral-core';
import { renderRulesetValidationSummary } from '../helpers/templates';
import getOctokit from '../helpers/octokit';

export const loadCustomRuleset = async (): Promise<
  RulesetDefinition | undefined
> => {
  const ROOT_PATH: string = process.env.GITHUB_WORKSPACE || process.cwd();

  if (!process.env.INPUT_RULES) return;

  const filepath = path.join(process.env.INPUT_RULES, 'rules.yaml');

  try {
    return await loader(path.join(ROOT_PATH, filepath));
  } catch (error) {
    if (error instanceof RulesetValidationError) {
      core.info(`problems in file ${filepath}`);

      error.annotations.forEach((annotation) => {
        core.info(`${annotation.jsonPath.join('.')} - ${annotation.message}`);
      });

      try {
        const octokit = getOctokit();

        if (!octokit) {
          core.setFailed('GitHub TOKEN required');

          return;
        }

        const annotations = error.annotations.map(
          ({ start_column, end_column, title, ...rest }) => ({
            ...rest,
            path: filepath,
          }),
        );

        const response = await octokit.request(
          'POST /repos/{owner}/{repo}/check-runs',
          {
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            head_sha: github.context.sha,
            name: 'modelcard/ruleset',
            conclusion: 'failure',
            output: {
              title: 'Validation problems',
              summary: renderRulesetValidationSummary({ annotations }),
              annotations,
            },
            external_id: `action-${process.env.GITHUB_RUN_ID}`,
          },
        );

        core.info(
          `Created a check run https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/runs/${response.data.id}`,
        );
      } catch (e) {
        console.log(e);
      }

      core.setFailed(error.message);
    }
  } finally {
    return;
  }
};
