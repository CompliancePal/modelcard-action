import { Ruleset } from '@stoplight/spectral-core';
import { join } from 'path';
import { configureValidator } from './configureValidator';

describe('custom rules', () => {
  it('loads successfuly', async () => {
    const absCustomRulesFilepath = join(__dirname, '__fixtures__/rules.yaml');

    const validator = await configureValidator({
      absCustomRulesFilepath,
      disableDefaultRules: false,
    });

    expect(validator).toMatchObject({
      validate: expect.any(Function),
      ruleset: expect.any(Ruleset),
    });
  });
});
