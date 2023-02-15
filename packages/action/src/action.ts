import * as fs from 'fs';
import { join } from 'path';
import * as core from '@actions/core';
import 'dotenv/config';
import * as Sentry from '@sentry/node';
import { configureValidator } from './steps/configureValidator';
import { BaseModelCard, ExtendedModelCard } from 'types';
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
import { z } from 'zod';

Sentry.init();

const envSchema = z.object({
  /**
   * Model card filepath
   */
  INPUT_MODELCARD: z.string().transform((val) => {
    return fs.readFileSync(val, 'utf8');
  }),
  /**
   * Custom rules directory
   */
  INPUT_RULES: z.string().optional(),
  /**
   * Disable default rules
   * @default false
   */
  INPUT_DISABLE_DEFAULT_RULES: z.coerce.boolean().default(false),

  GITHUB_WORKSPACE: z
    .string()
    .optional()
    .transform((val) => val || process.cwd()),
});

export type ProcessEnvType = z.infer<typeof envSchema>;

const main = async (opts: {
  absCustomRulesFilepath?: string;
  disableDefaultRules: boolean;
  modelCard: string;
}) => {
  const validator = await configureValidator(opts);
  core.info('Validator created');
  core.debug(JSON.stringify(validator.ruleset, null, 2));

  const modelCard = await validator.validate<BaseModelCard>(opts.modelCard);
  core.info('Model card validated');

  const augmentedModelCard = await augmentModelCard(
    modelCard as ExtendedModelCard,
  );

  // await core.summary.addRaw(renderModelCardDefault(augmentedModelCard)).write();
  // core.info('Model card rendered');

  return augmentedModelCard;
};

export const action = async () => {
  const env = envSchema.safeParse(process.env);

  if (!env.success) {
    console.log(env.error);
    return core.setFailed('Invalid configuration');
  }

  // const projectRoot = env.data.GITHUB_WORKSPACE || process.cwd();
  const projectRoot = env.data.GITHUB_WORKSPACE;

  const absCustomRulesFilepath =
    env.data.INPUT_RULES &&
    join(projectRoot, env.data.INPUT_RULES, 'rules.yaml');

  return main({
    absCustomRulesFilepath,
    disableDefaultRules: env.data.INPUT_DISABLE_DEFAULT_RULES,
    modelCard: env.data.INPUT_MODELCARD,
  })
    .then(async (modelCard) => {
      await core.summary.addRaw(renderModelCardDefault(modelCard)).write();
      core.info('Model card rendered');

      return modelCard;
    })
    .catch(async (error) => {
      console.log(error);

      if (error instanceof RulesetValidationError) {
        const customRulesFilepath = join(
          process.env.INPUT_RULES!,
          'rules.yaml',
        );
        core.info(`problems in file ${customRulesFilepath}`);

        error.annotations.forEach((annotation) => {
          core.error(
            `${annotation.jsonPath.join('.')} - ${annotation.message}`,
            {
              ...annotation,
              file: customRulesFilepath,
            },
          );
        });

        await core.summary
          .addRaw(renderRulesetValidationSummary(error))
          .write();
      } else if (error instanceof ModelCardValidationError) {
        error.annotations
          .map((annotation) => ({
            ...annotation,
            file: process.env.INPUT_MODELCARD,
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

        await core.summary
          .addRaw(renderModelCardValidationSummary(error))
          .write();
      } else {
        Sentry.captureException(error);

        await Sentry.flush();
      }

      if (error instanceof Error) {
        core.setFailed(error);
      }
    });
};