import { addModelCardArtifact, getRunDetails } from 'mlflow-integration';
import { PerformanceMetric, ExtendedModelCard } from 'types';

export const augmentModelCard = async (
  modelcard: ExtendedModelCard,
  options?: {
    trackingUrl: string;
  },
) => {
  if (!options?.trackingUrl || !modelcard.model_details?.run?.id) {
    return modelcard;
  }

  const details = await getRunDetails(modelcard, options.trackingUrl);

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

  await addModelCardArtifact(details, modelcard, options.trackingUrl);

  return modelcard;
};
