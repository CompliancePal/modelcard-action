import { Ruleset } from '@stoplight/spectral-core';
import { configureValidator } from './configureValidator';

describe('custom rules', () => {
  beforeEach(() => {
    process.env.INPUT_RULES = `${
      process.env.CI ? 'packages/action/' : ''
    }src/steps/__fixtures__`;
  });

  afterAll(() => {
    delete process.env.INPUT_RULES;
  });

  it('loads successfuly', async () => {
    const validator = await configureValidator();

    expect(validator).toMatchObject({
      validate: expect.any(Function),
      ruleset: expect.any(Ruleset),
    });
  });
});
