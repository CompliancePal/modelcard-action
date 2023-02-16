import { Ruleset } from '@stoplight/spectral-core';
import { configureValidator } from './configureValidator';

describe('custom rules', () => {
  it('loads successfuly', async () => {
    const absCustomRulesFilepath = `${
      process.env.CI ? 'packages/action/' : ''
    }src/steps/__fixtures__/rules.yaml`;
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
