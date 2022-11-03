import {
  addModelCardArtifact,
  ExtendedModelCard,
  getRunDetails,
} from '../mlflow';
import { PerformanceMetric } from '../types/BaseModelCard';

export const augmentModelCard = async (modelcard: ExtendedModelCard) => {
  if (!process.env.MLFLOW_TRACKING_URI) {
    return modelcard;
  }

  const details = await getRunDetails(modelcard);

  if (details.run.data.metrics.length > 0) {
    if (modelcard.quantitative_analysis === undefined) {
      modelcard.quantitative_analysis = {
        performance_metrics: [],
        graphics: {},
      };
    }

    details.run.data.metrics.forEach((m) => {
      modelcard.quantitative_analysis!.performance_metrics!.push({
        type: m.key,
        value: m.value.toString(),
      } as PerformanceMetric);
    });
  }

  await addModelCardArtifact(details, modelcard);

  return modelcard;
};
