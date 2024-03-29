import { vol } from 'memfs';
import { join } from 'path';
import { migrateRuleset } from './index';

vol.fromJSON({
  'ruleset.yml': `
rules:
  custom-function:
    message: '{{error}}'
    given: '$'
    then:
      function: template`,
});

describe('patched migrate', () => {
  it('compliancepal function', async () => {
    const filepath = join('ruleset.yml');

    const ruleset = await migrateRuleset(filepath, {
      format: 'esm',
      fs: vol as any,
    });

    expect(
      ruleset.startsWith(
        'import {template} from "@compliancepal/builtin-functions";',
      ),
    ).toBeTruthy();

    expect(ruleset.includes('void 0')).toBeFalsy;
  });
});
