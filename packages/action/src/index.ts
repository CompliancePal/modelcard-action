import * as fs from 'fs';
import * as core from '@actions/core';
import 'dotenv/config';
import { makeCheckRun, makeOutput } from './helpers/check';
import { configureValidator } from './steps/configureValidator';

const main = async () => {
  const started_at = new Date().toISOString();

  if (!process.env.INPUT_MODELCARD) {
    throw new Error('Environment variable INPUT_MODELCARD not found!');
  }

  const validator = await configureValidator();

  const raw = fs.readFileSync(process.env.INPUT_MODELCARD, 'utf8');
  core.info('Model card file opened');

  // Find problems
  const diagnostics = await validator.validate(raw);

  core.info(JSON.stringify(diagnostics));
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
