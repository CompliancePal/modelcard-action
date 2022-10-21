export type AnnotationLevel = 'failure';

interface IAnnotation {
  start_line: number;
  start_column: number;
  end_line: number;
  end_column: number;
  annotation_level: AnnotationLevel;
  message: string;
  title: string;
}

export type CustomRulesetValidationErrorCode =
  | 'file-does-not-exist'
  | 'unsupported-ruleset-format'
  | 'invalid-ruleset';

export class RulesetValidationError extends Error {
  constructor(
    public readonly message: string,
    public readonly code: CustomRulesetValidationErrorCode,
    public readonly annotations: IAnnotation[] = [],
  ) {
    super(message);
  }
}
