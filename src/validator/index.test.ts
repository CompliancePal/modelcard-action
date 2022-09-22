import { readFileSync } from 'fs';
import { join } from 'path';
import { validator } from '.';

describe('validator', () => {
  test('valid model card schema', async () => {
    const content = readFileSync(
      join(__dirname, '__fixtures__/basic.yaml'),
      'utf-8',
    );

    const res = await validator(content);

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
