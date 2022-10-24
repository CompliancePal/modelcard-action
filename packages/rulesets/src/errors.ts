export type AnnotationLevel = 'failure';

export interface IAnnotation {
  /**
   * JSON path for the property
   */
  path: (string | number)[];
  start_line: number;
  start_column?: number;
  end_line: number;
  end_column?: number;
  annotation_level: AnnotationLevel;
  message: string;
  title?: string;
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
