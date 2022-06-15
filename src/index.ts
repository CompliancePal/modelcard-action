import * as fs from 'fs';
import * as core from '@actions/core';
import * as github from '@actions/github';
import { RulesetDefinition } from '@stoplight/spectral-core';
import { validator } from './validator';
import path from 'path';
import 'dotenv/config';
import { makeSummary } from './helpers/check';

const ROOT_PATH: string = process.env.GITHUB_WORKSPACE || process.cwd();

const load_custom_ruleset = (): RulesetDefinition | undefined => {
  const rulePathRelative = process.env.INPUT_RULES;
  if (rulePathRelative) {
    try {
      const rulePathAbs = path.join(ROOT_PATH, rulePathRelative);
      const custom_rules: RulesetDefinition = require(path.join(
        rulePathAbs,
        'rules',
      ))(rulePathAbs);
      return custom_rules;
    } catch (err) {
      console.log(err);
    }
  }
  return undefined;
};

const main = async () => {
  const started_at = new Date().toISOString();

  if (!process.env.INPUT_MODELCARD) {
    throw new Error('Environment variable INPUT_MODELCARD not found!');
  }

  const raw = fs.readFileSync(process.env.INPUT_MODELCARD, 'utf8');
  core.info('Model card file opened');

  //Use custom ruleset if one is defined
  const custom_rules: RulesetDefinition | undefined = load_custom_ruleset();

  // Find problems
  const diagnostics = await validator(raw, custom_rules);

  const token = process.env.TOKEN;

  if (!token) {
    return core.setFailed('No TOKEN provided');
  }

  const octokit = github.getOctokit(token);

  try {
    await octokit.request('POST /repos/{owner}/{repo}/check-runs', {
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      head_sha: github.context.payload.pull_request!.head.sha,
      name: 'modelcard validation',
      conclusion: diagnostics.length > 0 ? 'failure' : 'success',
      output: {
        title: 'Validation problems',
        summary: makeSummary(diagnostics),
      },
      started_at,
      completed_at: new Date().toISOString(),
    });
  } catch (e) {
    return core.setFailed('Could not create Check result');
  }
};

main();
