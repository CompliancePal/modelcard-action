import { BaseModelCard } from './BaseModelCard';

interface RunIdInfo {
  model_details: {
    run: {
      type: 'mflow';
      id: string;
    };
  };
}

export type ExtendedModelCard = BaseModelCard & RunIdInfo;
