import { readFileSync } from 'fs';
import { join } from 'path';
import { makeOutput, renderModelCard } from './check';

describe('Checks', () => {
  describe('makeOutput', () => {
    it.skip('renders validation problems', () => {});

    it('renders model card output', () => {
      const res = makeOutput(
        [],
        readFileSync(
          join(__dirname, '../validator/__fixtures__/basic.yaml'),
          'utf8',
        ),
      );

      expect(res.title).toEqual('Model cards');
    });
  });

  describe('renderModelCard', () => {
    it('renders model card', () => {
      const res = renderModelCard(
        readFileSync(
          join(__dirname, '../validator/__fixtures__/basic.yaml'),
          'utf8',
        ),
      );

      expect(res).toBe(`## Model card

Name: Facial Detection 
Version: v0.0.0
Date: Wed Jun 01 2022 03:00:00 GMT+0300 (Eastern European Summer Time)

### Description

<!-- markdown description of model -->
#### Face Detection

The model analyzed in this card detects one or more faces within an image or a video frame, and returns a box around each face along with the location of the faces' major landmarks. The model's goal is exclusively to identify the existence and location of faces in an image. It does not attempt to discover identities or demographics.


### Datasets

* training

* testing`);
    });
  });
});
