import { IAnnotation } from '@compliancepal/spectral-rulesets';
import nunjucks from 'nunjucks';
import { join } from 'path';

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

    return;
  }
};

export default nunjucks;
