import nock from 'nock';
import { ExtendedModelCard } from 'types';
import { augmentModelCard } from './mlflowIntegration';

describe('mlflow', () => {
  const id = '2a84d204c6794965bc36641b46b77255';
  const MLFLOW_TRACKING_URI =
    'https://user:itrocks@84e5-91-153-238-208.ngrok.io';
  const mc: ExtendedModelCard = {
    model_details: {
      run: {
        type: 'mflow',
        id,
      },
    },
  };

  beforeEach(() => {
    nock.disableNetConnect();
  });

  afterEach(() => {
    nock.enableNetConnect();
  });

  test('augment model card', async () => {
    const metric = {
      key: 'key',
      value: 123,
    };

    nock(MLFLOW_TRACKING_URI)
      .get(`/api/2.0/mlflow/runs/get?run_id=${id}`)
      .reply(200, {
        run: {
          data: {
            metrics: [metric],
          },
          info: {
            artifact_uri: `mlflow-artifacts:/0/${id}/artifacts`,
            run_id: id,
          },
        },
      });

    nock(MLFLOW_TRACKING_URI)
      .put(
        `/api/2.0/mlflow-artifacts/artifacts/0/${id}/artifacts/modelcard.json`,
      )
      .reply(201);

    const result = await augmentModelCard(mc, {
      trackingUrl: MLFLOW_TRACKING_URI,
    });

    expect(result).toMatchObject({
      ...mc,
      ...{
        quantitative_analysis: {
          performance_metrics: [
            {
              type: metric.key,
              value: metric.value,
            },
          ],
        },
      },
    });
  });

  test('augment model card', async () => {
    const modelWithoutRunId = {
      model_details: {},
    };

    const result = await augmentModelCard(
      modelWithoutRunId as ExtendedModelCard,
    );

    expect(result).toBe(modelWithoutRunId);
  });
});
