import path from 'path';
import * as core from '@actions/core';
// import * as github from '@actions/github';
import {
  loader,
  RulesetValidationError,
} from '@compliancepal/spectral-rulesets';
import { RulesetDefinition } from '@stoplight/spectral-core';
// import { renderRulesetValidationSummary } from '../helpers/templates';
// import getOctokit from '../helpers/octokit';
// import { CHECK_NAME } from '../helpers/check';

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

      // try {
      //   const octokit = getOctokit();

      //   if (!octokit) {
      //     core.setFailed('GitHub TOKEN required');

      //     return;
      //   }

      //   const annotations = error.annotations.map(
      //     ({ start_column, end_column, title, ...rest }) => ({
      //       ...rest,
      //       path: filepath,
      //     }),
      //   );

      //   const response = await octokit.request(
      //     'POST /repos/{owner}/{repo}/check-runs',
      //     {
      //       owner: github.context.repo.owner,
      //       repo: github.context.repo.repo,
      //       head_sha: github.context.sha,
      //       name: CHECK_NAME,
      //       conclusion: 'failure',
      //       output: {
      //         title: 'Validation problems',
      //         summary: renderRulesetValidationSummary({ annotations }),
      //         annotations,
      //       },
      //       external_id: `action-${process.env.GITHUB_RUN_ID}`,
      //     },
      //   );

      //   core.info(
      //     `Created a check run https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/runs/${response.data.id}`,
      //   );
      // } catch (e) {
      //   console.log(e);
      // }
    }

    if (error instanceof Error) {
      core.setFailed(error);
    }

    throw error;
  }
};
