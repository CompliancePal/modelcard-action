import * as fs from 'fs';
import * as core from '@actions/core';
import { RulesetDefinition } from '@stoplight/spectral-core';
import { validator } from './validator/index';
import 'dotenv/config';
import { makeCheckRun, makeOutput } from './helpers/check';
import loadCustomRuleset from './helpers/rule-loader';
import path from 'path';

const main = async () => {
  const started_at = new Date().toISOString();

  if (!process.env.INPUT_MODELCARD) {
    throw new Error('Environment variable INPUT_MODELCARD not found!');
  }

  const raw = fs.readFileSync(process.env.INPUT_MODELCARD, 'utf8');
  core.info('Model card file opened');

  const ROOT_PATH: string = process.env.GITHUB_WORKSPACE || process.cwd();

  //Use custom ruleset if one is defined
  const custom_rules: RulesetDefinition | undefined = process.env.INPUT_RULES
    ? await loadCustomRuleset(
        path.join(ROOT_PATH, process.env.INPUT_RULES, 'rules.yaml'),
      )
    : undefined;

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
