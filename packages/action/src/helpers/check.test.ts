import { readFileSync } from 'fs';
import { join } from 'path';
import { makeOutput, renderModelCard } from './check';

describe('Checks', () => {
  describe('makeOutput', () => {
    describe('Valid model card', () => {
      it('renders model card output', () => {
        const res = makeOutput(
          [],
          readFileSync(join(__dirname, './__fixtures__/basic.yaml'), 'utf8'),
        );

        expect(res.title).toEqual('Model cards');
      });
    });

    describe('renderModelCard', () => {
      it('renders model card', () => {
        const res = renderModelCard(
          readFileSync(join(__dirname, './__fixtures__/basic.yaml'), 'utf8'),
        );

        expect(res).toBe(`## Model card

Name: Facial Detection 
Version: v0.0.0
Date: 1-6-2022

### Description

<!-- markdown description of model -->
#### Face Detection

The model analyzed in this card detects one or more faces within an image or a video frame, and returns a box around each face along with the location of the faces' major landmarks. The model's goal is exclusively to identify the existence and location of faces in an image. It does not attempt to discover identities or demographics.


### Datasets

* training

* testing`);
      });
    });

    // describe('Invalid model card', () => {
    //   it.skip('renders validation problems, when MC has invalid schema', async () => {
    //     const validator = await configureValidator();
    //     const content = readFileSync(
    //       join(__dirname, './__fixtures__/invalid_schema.yaml'),
    //       'utf-8',
    //     );

    //     const errors = await validator.validate(content);
    //     const res = makeOutput(errors, '');

    //     expect(res.summary).toBe(
    //       '- :warning: `quantitative_analysis.performance_metrics`: "performance_metrics" property type must be array',
    //     );
    //   });
    // });
  });
});
