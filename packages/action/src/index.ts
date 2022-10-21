import * as fs from 'fs';
import * as core from '@actions/core';
import * as github from '@actions/github';
import {
  loader,
  RulesetValidationError,
} from '@compliancepal/spectral-rulesets';
import { RulesetDefinition } from '@stoplight/spectral-core';
import { validator } from './validator/index';
import 'dotenv/config';
import { makeCheckRun, makeOutput } from './helpers/check';
import path from 'path';

const loadCustomRuleset = async (): Promise<RulesetDefinition | undefined> => {
  const ROOT_PATH: string = process.env.GITHUB_WORKSPACE || process.cwd();

  if (!process.env.INPUT_RULES) return;

  const filepath = path.join(process.env.INPUT_RULES, 'rules.yaml');

  try {
    return await loader(path.join(ROOT_PATH, filepath));
  } catch (error) {
    if (error instanceof RulesetValidationError) {
      core.info(`problems in file ${filepath}`);

      error.annotations.forEach((a) => core.info(a.message));

      try {
        const octokit = github.getOctokit(process.env.TOKEN!);

        const annotations = error.annotations.map(
          ({ start_column, end_column, title, ...a }) => ({
            ...a,
            path: filepath,
          }),
        );

        core.info(JSON.stringify(annotations));

        const response = await octokit.request(
          'POST /repos/{owner}/{repo}/check-runs',
          {
            owner: github.context.repo.owner,
            repo: github.context.repo.repo,
            head_sha: github.context.sha,
            name: 'ruleset validation',
            conclusion: 'failure',
            output: {
              title: 'Validation problems',
              summary: 'These are the problems',
              annotations,
            },
          },
        );

        core.info(`check run result ${response.status}`);
      } catch (e) {
        console.log(e);
      }

      core.setFailed(error.message);
    }
  } finally {
    return;
  }
};

const main = async () => {
  const started_at = new Date().toISOString();

  if (!process.env.INPUT_MODELCARD) {
    throw new Error('Environment variable INPUT_MODELCARD not found!');
  }

  const raw = fs.readFileSync(process.env.INPUT_MODELCARD, 'utf8');
  core.info('Model card file opened');

  //Use custom ruleset if one is defined
  const custom_rules = await loadCustomRuleset();

  // Find problems
  const diagnostics = await validator(raw, custom_rules);
  diagnostics.length > 0 && console.log(makeOutput(diagnostics, ''));

  const token = process.env.TOKEN;

  if (process.env.LOCAL_DEV === 'true') {
    console.log(diagnostics.length);
    diagnostics.forEach((d) => console.log(d));
    return;
  }

  if (!token) {
    return core.setFailed('No TOKEN provided');
  }

  try {
    await makeCheckRun(diagnostics, {
      metadata: raw,
      token,
      started_at,
    });
  } catch (e) {
    console.log(e);
    return core.setFailed('Could not create Check result');
  }
};

main();
