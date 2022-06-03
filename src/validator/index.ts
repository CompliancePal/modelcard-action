import { Spectral, Document } from '@stoplight/spectral-core';
import * as Parsers from '@stoplight/spectral-parsers';
import rules from './rules';

export const validator = async (content: string) => {
  const spectral = new Spectral();

  spectral.setRuleset(rules);

  const modelCard = new Document(content, Parsers.Yaml);

  return spectral.run(modelCard);
};
