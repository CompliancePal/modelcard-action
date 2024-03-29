import { URL } from 'url';
import fetch from 'cross-fetch';
import { ExtendedModelCard } from 'types';

const USER_AGENT =
  'modelcard-action/1.0 (https://github.com/CompliancePal/modelcard-action)';

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

const getUrl = (path: string, baseUrl: string) => new URL(path, baseUrl);

const resolveArtifact = (details: Run, path: string) =>
  `${details.run.info.artifact_uri.replace(
    'mlflow-artifacts:',
    '/api/2.0/mlflow-artifacts/artifacts',
  )}/${path}`;

export const getRunDetails = (
  modelcard: ExtendedModelCard,
  baseUrl: string,
): Promise<Run> => {
  const url = getUrl('/api/2.0/mlflow/runs/get', baseUrl);

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
  baseUrl: string,
) => {
  const url = getUrl(resolveArtifact(details, 'modelcard.json'), baseUrl);

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
