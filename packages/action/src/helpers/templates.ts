import { IAnnotation } from '@compliancepal/spectral-rulesets';
import nunjucks from 'nunjucks';
import { join } from 'path';
import { BaseModelCard } from '../types/BaseModelCard';

nunjucks
  .configure(join(__dirname, '../../resources/templates'), {
    autoescape: true,
  })
  .addFilter(
    'date',
    (date: Date) =>
      `${date.getUTCDate()}-${date.getUTCMonth() + 1}-${date.getUTCFullYear()}`,
  );

export const renderRulesetValidationSummary = (input: {
  annotations: IAnnotation[];
}) => {
  try {
    return nunjucks.render('ruleset-validation-summary.njk', input).trim();
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const renderModelCardDefault = (modelcard: BaseModelCard) => {
  return nunjucks.render('modelcards/default.njk', modelcard).trim();
};

export default nunjucks;
