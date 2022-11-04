declare namespace NodeJS {
  export interface ProcessEnv {
    INPUT_MODELCARD: string;
    INPUT_RULES?: string;
    INPUT_DISABLE_DEFAULT_RULES?: string;

    GITHUB_WORKSPACE?: string;

    MLFLOW_TRACKING_URI?: string;
  }
}
