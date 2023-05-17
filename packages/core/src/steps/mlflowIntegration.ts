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

  const res = await addModelCardArtifact(
    details,
    modelcard,
    options.trackingUrl,
  );

  if (res.status === 200) {
    console.log('Model card artifact added to MLflow run');
  } else {
    console.error('Failed to add model card artifact to MLflow run');
  }

  return modelcard;
};
