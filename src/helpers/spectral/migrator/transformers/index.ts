import _extends from '@stoplight/spectral-ruleset-migrator/dist/transformers/extends';
import formats from '@stoplight/spectral-ruleset-migrator/dist/transformers/formats';
import functions from '@stoplight/spectral-ruleset-migrator/dist/transformers/functions';
import rules from './rules';
import except from '@stoplight/spectral-ruleset-migrator/dist/transformers/except';

import type { Transformer } from '@stoplight/spectral-ruleset-migrator/dist/types';

const transformers: ReadonlyArray<Transformer> = [
  except,
  rules,
  functions,
  _extends,
  formats,
];

export default transformers;
