import { builders as b, namedTypes } from 'ast-types';
import * as functions from '@stoplight/spectral-functions';

import { Transformer } from '@stoplight/spectral-ruleset-migrator/dist/types';
import { assertString } from '@stoplight/spectral-ruleset-migrator/dist/validation';

export { transformer as default };

const KNOWN_FUNCTIONS = Object.keys(functions);

const PATCHED_FUNCTIONS = ['template'];

const re = /^\/rules\/[^/]+\/then\/(?:[0-9]+\/)?function$/;

const transformer: Transformer = function (hooks) {
  for (const item of hooks) {
    // remove the spectral transformer that handles the function names
    if (item[0].toString() === re.toString()) {
      hooks.delete(item);
    }
  }

  hooks.add([
    re,
    (value, ctx): namedTypes.Identifier | namedTypes.UnaryExpression => {
      assertString(value);

      if (KNOWN_FUNCTIONS.includes(value)) {
        return ctx.tree.addImport(value, '@stoplight/spectral-functions');
      }

      if (PATCHED_FUNCTIONS.includes(value)) {
        return ctx.tree.addImport(value, '@compliancepal/spectral-functions');
      }

      const alias = ctx.tree.scope.load(`function-${value}`);
      return alias !== void 0
        ? b.identifier(alias)
        : b.unaryExpression('void', b.literal(0));
    },
  ]);
};
