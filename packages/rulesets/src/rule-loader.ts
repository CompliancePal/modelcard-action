import * as fs from 'fs';
import * as spectralRuntime from '@stoplight/spectral-runtime';
import {
  RulesetDefinition,
  RulesetValidationError as SpectralRulesetValidationError,
  Ruleset,
} from '@stoplight/spectral-core';
import { Plugin, rollup } from 'rollup';
import { url } from '@stoplight/spectral-ruleset-bundler/plugins/url';
import { stdin } from '@stoplight/spectral-ruleset-bundler/plugins/stdin';
import { IO } from '@stoplight/spectral-ruleset-bundler';
import { dirname, join } from 'path';
import * as path from '@stoplight/path';
import {
  parseWithPointers as parseYamlWithPointers,
  getLocationForJsonPath,
} from '@stoplight/yaml';
import { migrateRuleset } from './migrator/index';
import { builtins } from './bundler/plugins/builtins';
import { AnnotationLevel, RulesetValidationError } from './errors';

const { fetch } = spectralRuntime;

const runtime = (io: IO) => [builtins(), url(io)];

const makeAnnotation = (
  range: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  },
  e: SpectralRulesetValidationError,
) => ({
  start_line: range.start.line,
  start_column: range.start.character,
  end_line: range.end.line,
  end_column: range.end.character,
  annotation_level: 'failure' as AnnotationLevel,
  message: e.message,
  title: e.code,
  path: e.path,
});

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
): Promise<RulesetDefinition> => {
  if (!fs.existsSync(filepath)) {
    throw new RulesetValidationError(filepath, 'file-does-not-exist');
  }

  if (!/\.(json|ya?ml)$/.test(path.extname(filepath))) {
    console.log('Only JSON and YAML rulesets are supported');

    throw new RulesetValidationError(
      'Only JSON and YAML rulesets are supported',
      'unsupported-ruleset-format',
    );
  }

  const plugins: Plugin[] = [...runtime(io)];

  const migratedRuleset = await migrateRuleset(filepath, {
    ...io,
    format: 'esm',
  });

  const rulesetFile = join(dirname(filepath), '.spectral.js');

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

  try {
    return new Ruleset(Function(`return ${outputChunk.code}`)(), {
      severity: 'recommended',
      source: rulesetFile,
    }).definition;
  } catch (error) {
    if (error instanceof AggregateError) {
      const content = fs.readFileSync(filepath, 'utf-8');
      const input = parseYamlWithPointers(content);

      const annotations = error.errors.map(
        (e: SpectralRulesetValidationError) => {
          switch (e.code) {
            case 'invalid-function-options':
              e.path.length = 3;

              if (
                getLocationForJsonPath(input, [...e.path, 'functionOptions'])
              ) {
                e.path.push('functionOptions');
              }
              break;

            default:
              break;
          }

          const { range } = getLocationForJsonPath(input, e.path)!;

          // The output for GitHub is determined by https://docs.github.com/en/rest/checks/runs#create-a-check-run
          return makeAnnotation(range, e);
        },
      );

      throw new RulesetValidationError(
        'Custom ruleset validation failed',
        'invalid-ruleset',
        annotations,
      );
    }

    throw new Error('Unknown error');
  }
};

export default loadCustomRuleset;
