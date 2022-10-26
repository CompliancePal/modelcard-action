import * as fs from 'fs';
import * as core from '@actions/core';
import 'dotenv/config';
import { configureValidator } from './steps/configureValidator';
import { BaseModelCard } from './types/BaseModelCard';
import {
  renderModelCardDefault,
  renderModelCardValidationSummary,
} from './helpers/templates';
import { ModelCardValidationError } from '@compliancepal/spectral-rulesets';
import { DiagnosticSeverity } from '@compliancepal/spectral-rulesets/dist/errors';

const main = async () => {
  if (!process.env.INPUT_MODELCARD) {
    throw new Error('Environment variable INPUT_MODELCARD not found!');
  }

  const validator = await configureValidator();
  core.info('Validator created');

  const raw = fs.readFileSync(process.env.INPUT_MODELCARD, 'utf8');
  core.info('Model card file opened');

  const modelCard = await validator.validate<BaseModelCard>(raw);
  core.info('Model card validated');

  await core.summary.addRaw(renderModelCardDefault(modelCard)).write();
  core.info('Model card rendered');
};

main().catch(async (error) => {
  if (error instanceof ModelCardValidationError) {
    error.annotations
      .map((annotation) => ({
        ...annotation,
        file: process.env.INPUT_MODELCARD!,
      }))
      .forEach((annotation) => {
        switch (annotation.severity) {
          case DiagnosticSeverity.Error:
            core.error(annotation.message, annotation);
            break;
          case DiagnosticSeverity.Warning:
            core.warning(annotation.message, annotation);
            break;
          case DiagnosticSeverity.Information:
            core.notice(annotation.message, annotation);
            break;
          default:
            core.info(annotation.message);
        }
      });

    // TODO: write failed summary
    await core.summary
      .addRaw(renderModelCardValidationSummary(error.annotations))
      .write();
  }

  if (error instanceof Error) {
    core.setFailed(error);
  }
});
