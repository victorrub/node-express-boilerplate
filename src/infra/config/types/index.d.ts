export declare type ConfigType = {
  Server: ServerConfig;
  Database: DatabaseConfig;
  Cache: CacheConfig;
};

declare type ServerConfig = {
  Port: number;
  Environment: string;
  LogLevel: LogLevelType;
  Debug: boolean;
};

declare type DatabaseConfig = {
  Host: string;
  Port: number;
  DatabaseName: string;
  Dialect: string;
  User: string;
  Password: string;
};

declare type CacheConfig = {
  ConnectionString?: string;
  Host?: string;
  Port?: number;
  Database?: number;
  User?: string;
  Password?: string;
  KeyPrefix?: string;
  ExpirationTime: number;
};

export type LogLevelType =
  | "All"
  | "OnlyInfo"
  | "OnlyError"
  | "IgnoreWarn"
  | "None";
