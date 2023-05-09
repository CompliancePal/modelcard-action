import { Command } from 'commander';
import { z } from 'zod';
import { main, MLflowPluginOptions } from '@compliancepal/modelcard-core';
import { readFileSync } from 'fs';
import { parse, safeStringify } from '@stoplight/yaml';
import { ExperimentTrackingType, ExtendedModelCard } from 'types';

const optsSchema = z.object({
  runId: z.string(),
  trackingUri: z.string().url(),
  modelcard: z.string().transform((val) => readFileSync(val, 'utf8')),
});

const program = new Command();

program.name('modelcard').version(process.env.npm_package_version!);

program
  .command('kubeflow')
  .requiredOption('--run-id <run-id>', 'MLflow run ID')
  .requiredOption('--tracking-uri <tracking-uri>', 'MLflow tracking URI')
  .requiredOption('--modelcard <modelcard>', 'Model card path')
  .action(async (inputs) => {
    const options = optsSchema.parse(inputs);

    const plugins: MLflowPluginOptions[] = [];

    plugins.push({
      type: 'mlflow',
      options: {
        trackingUrl: options.trackingUri,
      },
    });

    const mc = parse<ExtendedModelCard>(options.modelcard);

    mc.model_details.run = {
      type: ExperimentTrackingType.MLFLOW,
      id: options.runId,
    };

    const modelcard = await main({
      modelCard: safeStringify(mc),
      disableDefaultRules: true,
      plugins,
    });

    console.log(JSON.stringify(modelcard, null, 2));
  });

export default program;
