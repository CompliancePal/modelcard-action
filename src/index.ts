import * as fs from 'fs';
import * as core from '@actions/core';
import { RulesetDefinition } from '@stoplight/spectral-core';
import { validator } from './validator';
import path from 'path';
import 'dotenv/config';
import { makeCheckRun } from './helpers/check';

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

  if (process.env.LOCAL_DEV==='true') {
    console.log(diagnostics.length)
    diagnostics.forEach(d => console.log(d))
    return;
  }

  if (!token) {
    return core.setFailed('No TOKEN provided');
  }

  try {
    await makeCheckRun(diagnostics, {
      token,
      started_at,
    });
  } catch (e) {
    return core.setFailed('Could not create Check result');
  }
};

main();
