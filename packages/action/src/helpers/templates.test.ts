import { IAnnotation } from '@compliancepal/spectral-rulesets';
import { renderRulesetValidationSummary } from './templates';

describe('render templates', () => {
  it('renders rules validation summary', () => {
    const summary = renderRulesetValidationSummary({
      annotations: [
        {
          message: 'this is a test',
          path: ['first', 'second'],
        } as IAnnotation,
      ],
    });

    console.log(summary);

    expect(summary).not.toBeUndefined();
  });
});
