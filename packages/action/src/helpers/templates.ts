import { IAnnotation } from '@compliancepal/spectral-rulesets';
import nunjucks from 'nunjucks';
import { join } from 'path';
import { BaseModelCard } from 'types';

const severity = {
  0: {
    name: 'ERROR',
    color: 'red',
    emojiString: ':x:',
  },
  1: {
    name: 'WARNING',
    color: 'yellow',
    emojiString: ':warning:',
  },
  2: {
    name: 'INFO',
    color: 'blue',
    emojiString: ':information_source:',
  },
  3: {
    name: 'HINT',
    color: 'green',
    emojiString: ':bulb:',
  },
};

nunjucks
  .configure(join(__dirname, '../../resources/templates'), {
    autoescape: true,
  })
  .addFilter('date', (input: Date) => {
    const date = new Date(input);

    return `${date.getUTCDate()}-${
      date.getUTCMonth() + 1
    }-${date.getUTCFullYear()}`;
  });

export const renderRulesetValidationSummary = (input: {
  annotations: IAnnotation[];
}) => {
  try {
    return nunjucks.render('summaries/ruleset-validation.njk', input).trim();
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export const renderModelCardDefault = (modelcard: BaseModelCard) => {
  return nunjucks.render('modelcards/default.njk', modelcard).trim();
};

export const renderModelCardValidationSummary = (input: {
  annotations: IAnnotation[];
}) =>
  nunjucks.render('summaries/modelcard-validation.njk', {
    ...input,
    severity,
  });

export default nunjucks;
