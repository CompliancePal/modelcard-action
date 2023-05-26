import { Command, Option } from 'commander';
import { z } from 'zod';
import { main, MLflowPluginOptions } from '@compliancepal/modelcard-core';
import { readFileSync } from 'fs';
import { parse, safeStringify } from '@stoplight/yaml';
import { ExperimentTrackingType, ExtendedModelCard } from 'types';

const optsSchema = z.object({
  trackingUri: z.string().url(),
  modelcard: z.string().transform((val) => readFileSync(val, 'utf8')),
  runId: z.string().optional(),
  experimentMetadataDir: z.string().optional(),
});

const program = new Command();

program.name('modelcard').version(process.env.npm_package_version!);

program
  .command('kubeflow')
  .requiredOption('--tracking-uri <tracking-uri>', 'MLflow tracking URI')
  .requiredOption('--modelcard <modelcard>', 'Model card path')
  .addOption(
    new Option('--run-id <run-id>', 'MLflow run ID').conflicts(
      'experimentMetadataDir',
    ),
  )
  .addOption(
    new Option(
      '--experiment-metadata-dir <experiment-metadata-dir>',
      'MLflow experiment metadata directory',
    ).conflicts('runId'),
  )
  .action(async (inputs) => {
    const options = optsSchema.parse(inputs);

    const runId =
      options.runId ||
      (JSON.parse(
        readFileSync(`${options.experimentMetadataDir}/run_id.json`, 'utf8'),
      ).run_id as string);

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
      id: runId,
    };

    const modelcard = await main({
      modelCard: safeStringify(mc),
      disableDefaultRules: true,
      plugins,
    });

    console.log(JSON.stringify(modelcard, null, 2));
  });

export default program;
