import { readFileSync } from 'fs';
import { join } from 'path';
import { validator } from '.';

describe('validator', () => {
  test('modelcard schema', async () => {
    const content = readFileSync(
      join(__dirname, '__fixtures__/basic.yaml'),
      'utf-8',
    );

    const res = await validator(content);

    expect(res).toHaveLength(0);
  });
});
