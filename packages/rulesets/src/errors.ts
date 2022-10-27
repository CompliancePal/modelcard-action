/**
 * Represents the severity of diagnostics.
 */
export enum DiagnosticSeverity {
  /**
   * Something not allowed by the rules of a language or other means.
   */
  Error = 0,
  /**
   * Something suspicious but allowed.
   */
  Warning = 1,
  /**
   * Something to inform about but not a problem.
   */
  Information = 2,
  /**
   * Something to hint to a better way of doing it, like proposing
   * a refactoring.
   */
  Hint = 3,
}

export interface IAnnotation {
  /**
   * JSON path for the property
   */
  jsonPath: (string | number)[];
  startLine: number;
  endLine: number;
  message: string;
  severity: DiagnosticSeverity;
  title: string;
}

export type RulesetValidationErrorCode =
  | 'file-does-not-exist'
  | 'unsupported-ruleset-format'
  | 'invalid-ruleset';

export class RulesetValidationError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: RulesetValidationErrorCode,
    public readonly annotations: IAnnotation[] = [],
  ) {
    super(message);
  }
}

export type ModelCardValidationErrorCode = 'invalid-yaml' | 'validation-error';

export class ModelCardValidationError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: ModelCardValidationErrorCode,
    public readonly annotations: IAnnotation[] = [],
  ) {
    super(message);
  }
}
