import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as core from '@actions/core';
import { validator } from './validator';

const MLPROJECT_PATH: string = './MLproject';

const main = async () => {
  try {
    if (fs.existsSync(MLPROJECT_PATH)) {
      console.log('MLproject file found');
    } else {
      throw new Error('MLproject file missing!');
    }

    const mlproject: any = yaml.load(fs.readFileSync(MLPROJECT_PATH, 'utf8'));
    console.log('MLproject file opened');
    const modelcard_path: string = mlproject.modelcard;

    //Check that modelcard is defined in the MLproject file
    if (!modelcard_path) {
      throw new Error("'modelcard' property not found in MLproject file!");
    }

    try {
      const raw = fs.readFileSync(modelcard_path, 'utf8');
      console.log('Model card file opened');

      // Do stuff with the model card file

      // Find problems
      const diagnostics = await validator(raw);

      // TODO: iterate over diagnostics

      diagnostics.forEach((problem) => {
        console.log(problem);
      });
    } catch (e) {
      throw new Error('Could not open model card file!');
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
};

main();
