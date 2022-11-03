import * as fs from 'fs';
import { join } from 'path';
import * as core from '@actions/core';
import 'dotenv/config';
import { configureValidator } from './steps/configureValidator';
import { BaseModelCard } from './types/BaseModelCard';
import {
  renderModelCardDefault,
  renderModelCardValidationSummary,
  renderRulesetValidationSummary,
} from './helpers/templates';
import { ModelCardValidationError } from '@compliancepal/spectral-rulesets';
import {
  DiagnosticSeverity,
  RulesetValidationError,
} from '@compliancepal/spectral-rulesets/dist/errors';
import { augmentModelCard } from './steps/mlflowIntegration';
import { ExtendedModelCard } from './mlflow';

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

  const augmentedModelCard = await augmentModelCard(
    modelCard as ExtendedModelCard,
  );

  await core.summary.addRaw(renderModelCardDefault(augmentedModelCard)).write();
  core.info('Model card rendered');
};

main().catch(async (error) => {
  if (error instanceof RulesetValidationError) {
    const customRulesFilepath = join(process.env.INPUT_RULES!, 'rules.yaml');
    core.info(`problems in file ${customRulesFilepath}`);

    error.annotations.forEach((annotation) => {
      core.error(`${annotation.jsonPath.join('.')} - ${annotation.message}`, {
        ...annotation,
        file: customRulesFilepath,
      });
    });

    await core.summary.addRaw(renderRulesetValidationSummary(error)).write();
  }

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

    await core.summary.addRaw(renderModelCardValidationSummary(error)).write();
  }

  if (error instanceof Error) {
    core.setFailed(error);
  }
});
