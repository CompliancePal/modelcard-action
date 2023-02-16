import { readFileSync } from 'fs';
import { join } from 'path';
import { main, MainProps } from './core';

describe('core', () => {
  it('validates model card with custom rules', async () => {
    const modelCard = readFileSync(
      join(__dirname, '__fixtures__/modelcard.yaml'),
      'utf-8',
    );

    const cfg: MainProps = {
      modelCard,
      disableDefaultRules: false,
      absCustomRulesFilepath: join(__dirname, 'steps/__fixtures__/rules.yaml'),
      plugins: [],
      logger: console,
    };

    expect(await main(cfg)).toMatchSnapshot();
  });
});
