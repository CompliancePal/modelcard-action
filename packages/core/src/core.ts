import { configureValidator } from './steps/configureValidator';
import { BaseModelCard, ExtendedModelCard } from 'types';
import { augmentModelCard } from './steps/mlflowIntegration';

export interface MLflowPluginOptions {
  type: 'mlflow';
  options: {
    trackingUrl: string;
  };
}

export type MainProps = {
  absCustomRulesFilepath?: string;
  disableDefaultRules: boolean;
  modelCard: string;
  plugins: MLflowPluginOptions[];
  logger: Pick<Console, 'info' | 'debug'>;
};

export const main = async (opts: MainProps) => {
  const { logger } = opts;

  const validator = await configureValidator(opts);
  logger.info('Validator created');
  logger.debug(JSON.stringify(validator.ruleset, null, 2));

  const modelCard = await validator.validate<BaseModelCard>(opts.modelCard);
  logger.info('Model card validated');

  const augmentedModelCard = await augmentModelCard(
    modelCard as ExtendedModelCard,
    opts.plugins.find((plugin) => plugin.type === 'mlflow')?.options,
  );

  return augmentedModelCard;
};
