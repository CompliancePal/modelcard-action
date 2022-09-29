import { parseWithPointers as parseJsonWithPointers } from '@stoplight/json';
import { parseWithPointers as parseYamlWithPointers } from '@stoplight/yaml';
import { fetch as defaultFetch } from '@stoplight/spectral-runtime';
import { dirname, extname, isURL } from '@stoplight/path';
import {
  Fetch,
  Hook,
  MigrationOptions,
  TransformerCtx,
} from '@stoplight/spectral-ruleset-migrator/dist/types';
import { Scope, Tree } from '@stoplight/spectral-ruleset-migrator/dist/tree';
import { process } from '@stoplight/spectral-ruleset-migrator/dist';
import { assertRuleset } from '@stoplight/spectral-ruleset-migrator/dist/validation';
import { Ruleset } from '@stoplight/spectral-ruleset-migrator/dist/validation/types';
import transformers from '@stoplight/spectral-ruleset-migrator/dist/transformers';
import rules from './transformers/rules';

async function read(
  filepath: string,
  fs: MigrationOptions['fs'],
  fetch: Fetch,
): Promise<Ruleset> {
  const input = isURL(filepath)
    ? await (await fetch(filepath)).text()
    : await fs.promises.readFile(filepath, 'utf8');

  const { data: ruleset } =
    extname(filepath) === '.json'
      ? parseJsonWithPointers<unknown>(input)
      : parseYamlWithPointers<unknown>(input, {
          mergeKeys: true,
        });

  assertRuleset(ruleset);
  return ruleset;
}

export async function migrateRuleset(
  filepath: string,
  opts: MigrationOptions,
): Promise<string> {
  const { fs, fetch = defaultFetch, format, npmRegistry } = opts;
  const cwd = dirname(filepath);
  const tree = new Tree({
    format,
    npmRegistry,
    scope: new Scope(),
  });

  const ruleset = await read(filepath, fs, fetch);
  const hooks = new Set<Hook>();
  const ctx: TransformerCtx = {
    cwd,
    filepath,
    tree,
    opts: {
      fetch,
      ...opts,
    },
    npmRegistry: npmRegistry ?? null,
    hooks,
    read,
  };

  for (const transformer of [...transformers, rules]) {
    transformer(ctx.hooks);
  }

  tree.ruleset = await process(ruleset, ctx);

  return tree.toString();
}
