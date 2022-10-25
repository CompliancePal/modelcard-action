import { loadCustomRuleset } from './loadCustomRuleset';

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
    const rules = await loadCustomRuleset();

    expect(rules).toMatchObject({
      rules: {
        'valid-markdown-description': {
          message: '{{error}}',
          given: '$.model_details.description',
          then: {
            function: expect.any(Function),
            functionOptions: expect.any(Object),
          },
        },
      },
    });
  });
});
