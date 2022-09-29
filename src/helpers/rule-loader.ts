import * as fs from 'fs';
import * as spectralRuntime from '@stoplight/spectral-runtime';
import { RulesetDefinition, Ruleset } from '@stoplight/spectral-core';
import { bundleAndLoadRuleset } from '@stoplight/spectral-ruleset-bundler/with-loader';
import { Plugin, rollup } from 'rollup';
import { url } from '@stoplight/spectral-ruleset-bundler/plugins/url';
import { stdin } from '@stoplight/spectral-ruleset-bundler/plugins/stdin';
import { IO } from '@stoplight/spectral-ruleset-bundler';
import { dirname, join } from 'path';
import * as path from '@stoplight/path';
import { migrateRuleset } from './spectral/migrator/index';
import { builtins } from './spectral/bundler/plugins/builtins';

const { fetch } = spectralRuntime;

const runtime = (io: IO) => [builtins(), url(io)];

// heavily inspired from https://github.com/stoplightio/vscode-spectral/blob/master/server/src/linter.ts#L133
const loadCustomRuleset = async (
  filepath: string,
  {
    io,
  }: {
    io: IO;
  } = {
    io: {
      fs,
      fetch,
    },
  },
) => {
  if (!/\.(json|ya?ml)$/.test(path.extname(filepath))) {
    console.log('Only JSON and YAML rulesets are supported');
    return;
  }

  const plugins: Plugin[] = [...runtime(io)];

  const rulesetFile = join(dirname(filepath), '.spectral.js');

  const migratedRuleset = await migrateRuleset(filepath, {
    ...io,
    format: 'esm',
  });

  plugins.unshift(stdin(migratedRuleset, rulesetFile));

  const bundle = await rollup({
    input: rulesetFile,
    plugins,
    treeshake: false,
    watch: false,
    perf: false,
    onwarn(e, fn) {
      if (e.code === 'MISSING_NAME_OPTION_FOR_IIFE_EXPORT') {
        return;
      }

      fn(e);
    },
  });

  const outputChunk = (
    await bundle.generate({ format: 'iife', exports: 'auto' })
  ).output[0];

  return new Ruleset(Function(`return ${outputChunk.code}`)(), {
    severity: 'recommended',
    source: rulesetFile,
  }).definition;
};

export default loadCustomRuleset;
