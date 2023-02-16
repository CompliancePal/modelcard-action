import * as fs from 'fs';
import { join } from 'path';
import * as core from '@actions/core';
import 'dotenv/config';
import * as Sentry from '@sentry/node';
import {
  renderModelCardDefault,
  renderModelCardValidationSummary,
  renderRulesetValidationSummary,
} from './helpers/templates';
import {
  ModelCardValidationError,
  RulesetValidationError,
} from '@compliancepal/spectral-rulesets';
import { DiagnosticSeverity } from '@compliancepal/spectral-rulesets/dist/errors';
import { z } from 'zod';
import { main, MLflowPluginOptions } from '@compliancepal/modelcard-core';

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

  MLFLOW_TRACKING_URI: z.string().url().optional(),
});

export type ProcessEnvType = z.infer<typeof envSchema>;

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

  const plugins: MLflowPluginOptions[] = [];

  if (env.data.MLFLOW_TRACKING_URI) {
    plugins.push({
      type: 'mlflow',
      options: {
        trackingUrl: env.data.MLFLOW_TRACKING_URI,
      },
    });
  }

  return main({
    absCustomRulesFilepath,
    disableDefaultRules: env.data.INPUT_DISABLE_DEFAULT_RULES,
    modelCard: env.data.INPUT_MODELCARD,
    plugins,
  })
    .then(async (modelCard) => {
      await core.summary.addRaw(renderModelCardDefault(modelCard)).write();
      core.info('Model card rendered');

      return modelCard;
    })
    .catch(async (error) => {
      if (error instanceof RulesetValidationError) {
        const customRulesFilepath = join(env.data.INPUT_RULES!, 'rules.yaml');
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
            file: env.data.INPUT_MODELCARD,
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
