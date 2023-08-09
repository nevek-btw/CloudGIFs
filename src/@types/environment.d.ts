declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      MONGO: string;
      CLOUD_NAME: string;
      CLOUD_KEY: string;
      CLOUD_SECRET: string;
      CLOUD_URL: string;
    }
  }
}

export {};
