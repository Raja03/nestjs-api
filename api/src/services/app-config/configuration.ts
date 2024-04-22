export const getConfig = (): AppConfig => {
  return {
    port: parseInt(process.env.PORT as string, 10) || 3000,
    appEnv: process.env.APP_ENV as AppEnv,
    jwtSecret: process.env.JWT_SECRET as string,
    logLevel: process.env.LOG_LEVEL || 'info',
    databases: [
      {
        host: process.env.DB_HOST as string,
        port: parseInt(process.env.DB_PORT as string, 10) || 5432,
        user: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        dbName: process.env.DB0_NAME as string,
      },
      {
        host: process.env.DB_HOST as string,
        port: parseInt(process.env.DB_PORT as string, 10) || 5432,
        user: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        dbName: process.env.DB1_NAME as string,
      },
      {
        host: process.env.DB_HOST as string,
        port: parseInt(process.env.DB_PORT as string, 10) || 5432,
        user: process.env.DB_USER as string,
        password: process.env.DB_PASSWORD as string,
        dbName: process.env.DB2_NAME as string,
      },
    ],
    cache: {
      host: process.env.REDIS_HOST as string,
      port: parseInt(process.env.REDIS_PORT as string, 10) || 6379,
      password: process.env.REDIS_PASSWORD as string,
    },
  };
};

export interface AppConfig {
  port: number;
  appEnv: AppEnv;
  jwtSecret: string;
  logLevel: string;
  databases: DbConfig[];
  cache: CacheConfig;
}

export enum AppEnv {
  DEV = 'dev',
  TEST = 'test',
  PROD = 'production',
}

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  dbName: string;
}

export interface CacheConfig {
  host: string;
  port: number;
  password: string;
}
