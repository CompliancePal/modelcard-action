import * as core from '@actions/core';
import { configureValidator } from './steps/configureValidator';
import { BaseModelCard, ExtendedModelCard } from 'types';
import { augmentModelCard } from './steps/mlflowIntegration';

export type MainProps = {
  absCustomRulesFilepath?: string;
  disableDefaultRules: boolean;
  modelCard: string;
};

export const main = async (opts: MainProps) => {
  const validator = await configureValidator(opts);
  core.info('Validator created');
  core.debug(JSON.stringify(validator.ruleset, null, 2));

  const modelCard = await validator.validate<BaseModelCard>(opts.modelCard);
  core.info('Model card validated');

  const augmentedModelCard = await augmentModelCard(
    modelCard as ExtendedModelCard,
  );

  return augmentedModelCard;
};
