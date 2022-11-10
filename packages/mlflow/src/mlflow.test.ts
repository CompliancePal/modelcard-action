import nock from 'nock';
import {
  addModelCardArtifact,
  ExtendedModelCard,
  getRunDetails,
  Run,
} from './mlflow';

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
    process.env.MLFLOW_TRACKING_URI = MLFLOW_TRACKING_URI;

    nock.disableNetConnect();
  });

  afterEach(() => {
    process.env.MLFLOW_TRACKING_URI;

    nock.enableNetConnect();
  });

  test('Get run details', async () => {
    nock(MLFLOW_TRACKING_URI)
      .get(`/api/2.0/mlflow/runs/get?run_id=${id}`)
      .reply(200, {
        run: {
          data: {},
          info: {
            run_id: id,
          },
        },
      });

    const details = await getRunDetails(mc);

    expect(details).toMatchObject({
      run: {
        info: {
          run_id: id,
        },
        data: {},
      },
    } as Run);
  });

  test('Add artifact', async () => {
    nock(MLFLOW_TRACKING_URI)
      .put(
        `/api/2.0/mlflow-artifacts/artifacts/0/${id}/artifacts/modelcard.json`,
      )
      .reply(201);

    const details: Run = {
      run: {
        info: {
          run_uuid: id,
          experiment_id: '0',
          run_name: 'luxuriant-snail-406',
          user_id: 'root',
          status: 'FINISHED',
          start_time: 1667383203898,
          end_time: 1667391887958,
          artifact_uri: `mlflow-artifacts:/0/${id}/artifacts`,
          lifecycle_stage: 'active',
          run_id: id,
        },
        data: {
          metrics: [],
          params: [],
          tags: [],
        },
      },
    };

    const res = await addModelCardArtifact(details, mc);

    expect(res).toMatchObject({
      ok: true,
    });
  });
});
