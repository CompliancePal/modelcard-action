import { Document, Ruleset, Spectral } from '@stoplight/spectral-core';
import {
  parseWithPointers as parseYamlWithPointers,
  getLocationForJsonPath,
} from '@stoplight/yaml';
import * as Parsers from '@stoplight/spectral-parsers';
import loadCustomRuleset from '../loader/rule-loader';
import { defaultRules } from '../rules';
import { IAnnotation, ModelCardValidationError } from '../errors';

interface ValidatorOptions {
  defaultRules: boolean;
}

export interface ModelCardValidator {
  validate: <T>(content: string) => Promise<T>;
  ruleset: Ruleset;
}

export const getValidator: {
  /**
   * Returns a validator with the default ruleset
   */
  (): Promise<ModelCardValidator>;
  /**
   * Returns a validator with the custom ruleset extending the default ruleset
   */
  (customRulesFilepath: string): Promise<ModelCardValidator>;
  /**
   * Returns a validator with the custom ruleset that can extend or not the default ruleset, base don the options provided
   */
  (
    customRulesFilepath: string,
    opts: ValidatorOptions,
  ): Promise<ModelCardValidator>;
} = async (
  customRulesFilepath?: string,
  opts: ValidatorOptions = {
    defaultRules: true,
  },
): Promise<ModelCardValidator> => {
  const customRules = customRulesFilepath
    ? await loadCustomRuleset(customRulesFilepath)
    : undefined;
  const spectral = new Spectral();

  if (customRules) {
    if (opts.defaultRules) {
      spectral.setRuleset({
        ...customRules,
        extends: defaultRules,
      });
    } else {
      spectral.setRuleset(customRules);
    }
  } else {
    spectral.setRuleset(defaultRules);
  }

  return {
    validate: async <T>(content: string) => {
      const diagnostics = await spectral.run(
        new Document(content, Parsers.Yaml),
      );

      const input = parseYamlWithPointers<T>(content);

      if (diagnostics.length === 0) {
        return input.data!;
      }

      if (
        diagnostics.some(
          (problem) => problem.code === 'parser' && problem.severity === 0,
        )
      ) {
        throw new ModelCardValidationError(
          'The model card is ot a valid YAML document',
          'invalid-yaml',
        );
      }

      const annotations = diagnostics
        .filter((problem) => problem.code !== 'parser')
        .map((problem) => {
          const { range } = getLocationForJsonPath(input, problem.path)!;
          // console.log(problem, range);

          return {
            jsonPath: problem.path,
            start_line: range.end.line,
            end_line: range.end.line,
            severity: problem.severity,
            message: problem.message,
          } as IAnnotation;
        });

      throw new ModelCardValidationError(
        'The model card failed validation',
        'validation-error',
        annotations,
      );
    },
    get ruleset() {
      return spectral.ruleset!;
    },
  };
};
