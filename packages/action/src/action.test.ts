import { unlinkSync, writeFileSync } from 'fs';
import { action, ProcessEnvType } from './action';

const GITHUB_STEP_SUMMARY = 'summary';

describe('action', () => {
  const env: Record<keyof ProcessEnvType, string | undefined> = {
    INPUT_MODELCARD: 'src/helpers/__fixtures__/basic.yaml',
    INPUT_DISABLE_DEFAULT_RULES: undefined,
    GITHUB_WORKSPACE: undefined,
    INPUT_RULES: `${
      process.env.CI ? 'packages/action/' : ''
    }src/steps/__fixtures__`,
    //@ts-ignore
    GITHUB_STEP_SUMMARY,
  };

  beforeAll(() => {
    for (const key in env) {
      if (env[key as keyof ProcessEnvType]) {
        process.env[key] = env[key as keyof ProcessEnvType];
      }
    }

    writeFileSync(GITHUB_STEP_SUMMARY, '');
  });

  afterAll(() => {
    for (let key in env) {
      if (env[key as keyof ProcessEnvType]) {
        delete process.env[key as keyof ProcessEnvType];
      }
    }

    unlinkSync(GITHUB_STEP_SUMMARY);
  });

  it('works', async () => {
    expect(await action()).toMatchSnapshot();
  });
});
