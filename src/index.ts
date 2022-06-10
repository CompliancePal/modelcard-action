import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as core from '@actions/core';
import { RulesetDefinition } from '@stoplight/spectral-core'
import { validator } from './validator';
import path from 'path';

const MLPROJECT_PATH: string = './MLproject';
const ROOT_PATH: string = process.env.GITHUB_WORKSPACE || process.cwd()

const load_custom_ruleset = (rulePathRelative: string | null): RulesetDefinition | undefined => {
  if (rulePathRelative) {
    try {
      const rulePathAbs = path.join(ROOT_PATH, rulePathRelative)
      const custom_rules: RulesetDefinition = require(path.join(rulePathAbs, 'rules'))(rulePathAbs);
      return custom_rules;
    } catch (err) {
      console.log(err);
    }
  }
  return undefined;
}

const main = async () => {
  try {
    if (fs.existsSync(MLPROJECT_PATH)) {
      console.log('MLproject file found');
    } else {
      throw new Error('MLproject file missing!');
    }

    const mlproject: any = yaml.load(fs.readFileSync(MLPROJECT_PATH, 'utf8'));
    console.log('MLproject file opened');

    //Check that modelcard is defined in the MLproject file
    const modelcard_path: string = mlproject.modelcard;
    if (!modelcard_path) {
      throw new Error("'modelcard' property not found in MLproject file!");
    }

    try {
      const raw = fs.readFileSync(modelcard_path, 'utf8');
      console.log('Model card file opened');

      //Use custom ruleset if one is defined
      const custom_ruleset_path: string = mlproject.modelcard_rules;
      const custom_rules: RulesetDefinition | undefined = load_custom_ruleset(custom_ruleset_path);

      // Find problems
      const diagnostics = await validator(raw, custom_rules);

      // TODO: iterate over diagnostics

      diagnostics.forEach((problem) => {
        console.log(problem);
      });
    } catch (e) {
      console.log(e);
      throw new Error('Could not open model card file!');
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};

main();
