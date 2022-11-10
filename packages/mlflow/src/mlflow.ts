import { URL } from 'url';
import fetch from 'cross-fetch';
import { BaseModelCard } from 'types';

const USER_AGENT =
  'modelcard-action/1.0 (https://github.com/CompliancePal/modelcard-action)';

interface RunIdInfo {
  model_details: {
    run: {
      type: 'mflow';
      id: string;
    };
  };
}

export type ExtendedModelCard = BaseModelCard & RunIdInfo;

interface Metric {
  key: string;
  value: number;
  timestamp: number;
  step: number;
}

interface Param {
  key: string;
  value: string;
}

interface Tag {
  key: string;
  value: string;
}

export interface Run {
  run: {
    info: {
      run_id: string;
      experiment_id: string;
      artifact_uri: string;
      [k: string]: any;
    };
    data: {
      metrics: Metric[];
      params: Param[];
      tags: Tag[];
    };
  };
}

const getUrl = (path: string) => new URL(path, process.env.MLFLOW_TRACKING_URI);

const resolveArtifact = (details: Run, path: string) =>
  `${details.run.info.artifact_uri.replace(
    'mlflow-artifacts:',
    '/api/2.0/mlflow-artifacts/artifacts',
  )}/${path}`;

export const getRunDetails = (modelcard: ExtendedModelCard): Promise<Run> => {
  const url = getUrl('/api/2.0/mlflow/runs/get');

  url.searchParams.append('run_id', modelcard.model_details.run.id);

  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'user-agent': USER_AGENT,
    },
  }).then((res) => res.json());
};

export const addModelCardArtifact = (
  details: Run,
  modelcard: ExtendedModelCard,
) => {
  const url = getUrl(resolveArtifact(details, 'modelcard.json'));

  return fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      'user-agent': USER_AGENT,
    },
    body: JSON.stringify(modelcard, null, 2),
  });
};
