import { BaseModelCard } from './BaseModelCard';

export enum ExperimentTrackingType {
  MLFLOW = 'mlflow',
}

interface RunIdInfo {
  model_details: {
    run: {
      type: ExperimentTrackingType;
      id: string;
    };
  };
}

export type ExtendedModelCard = BaseModelCard & RunIdInfo;
