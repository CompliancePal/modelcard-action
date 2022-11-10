import { addModelCardArtifact, getRunDetails } from 'mlflow-integration';
import { PerformanceMetric, ExtendedModelCard } from 'types';

export const augmentModelCard = async (modelcard: ExtendedModelCard) => {
  if (!process.env.MLFLOW_TRACKING_URI) {
    return modelcard;
  }

  const details = await getRunDetails(modelcard);

  if (details.run.data.metrics.length > 0) {
    if (modelcard.quantitative_analysis === undefined) {
      modelcard.quantitative_analysis = {
        performance_metrics: details.run.data.metrics.map(
          (m): PerformanceMetric => ({
            type: m.key,
            value: m.value,
          }),
        ),
        graphics: {},
      };
    }
  }

  await addModelCardArtifact(details, modelcard);

  return modelcard;
};
