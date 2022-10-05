import { readFileSync } from 'fs';
import { join } from 'path';
import { validator } from './index';
import loadCustomRuleset from '../helpers/rule-loader';

describe('validator', () => {
  test('valid model card schema', async () => {
    const content = readFileSync(
      join(__dirname, '__fixtures__/basic.yaml'),
      'utf-8',
    );

    const res = await validator(content);

    expect(res).toHaveLength(0);
  });

  test('valid model card schema with custom rules', async () => {
    const content = readFileSync(
      join(__dirname, '__fixtures__/basic.yaml'),
      'utf-8',
    );

    const ruleset = await loadCustomRuleset(
      join(__dirname, '__fixtures__/ruleset.yaml'),
    );

    const res = await validator(content, ruleset);

    expect(res).toHaveLength(0);
  });

  test('invalid mode card schema', async () => {
    const content = readFileSync(
      join(__dirname, '__fixtures__/invalid_schema.yaml'),
      'utf-8',
    );

    const res = await validator(content);

    expect(res).toHaveLength(1);

    expect(res[0].message).toBe(
      '"performance_metrics" property type must be array',
    );
  });
});
