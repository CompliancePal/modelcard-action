declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * The path to the modelcard file
     */
    INPUT_MODELCARD: string;
    /**
     * The directory of the custom rules
     */
    INPUT_RULES?: string;
    /**
     * Flagg for disabling the default rules
     */
    INPUT_DISABLE_DEFAULT_RULES?: string;

    GITHUB_WORKSPACE?: string;

    /**
     * The MLflow tracking server address
     */
    MLFLOW_TRACKING_URI?: string;
  }
}
