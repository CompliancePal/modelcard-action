import { IAnnotation } from '@compliancepal/spectral-rulesets';
import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';
import { BaseModelCard } from '../types/BaseModelCard';
import {
  renderModelCardDefault,
  renderModelCardValidationSummary,
  renderRulesetValidationSummary,
} from './templates';

describe('render templates', () => {
  it('renders rules validation summary', () => {
    const summary = renderRulesetValidationSummary({
      annotations: [
        {
          message: 'this is a test',
          jsonPath: ['first', 'second'],
        } as IAnnotation,
      ],
    });

    expect(summary).not.toBeUndefined();
  });

  it('renders modelcard validation summary', () => {
    const summary = renderModelCardValidationSummary({
      annotations: [
        {
          message: 'this is a test',
          jsonPath: ['first', 'second'],
        } as IAnnotation,
      ],
    });

    expect(summary).toBe(`The model card has the following problems:

  *  \`first.second\`: this is a test

Fix them before you can render the model card.`);
  });

  it('renders default model card', () => {
    const modelCard = load(
      readFileSync(join(__dirname, './__fixtures__/basic.yaml'), 'utf-8'),
    ) as BaseModelCard;

    const render = renderModelCardDefault(modelCard as BaseModelCard);

    expect(render).toEqual(`## Model card

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
