export declare type ConfigType = {
  Server: ServerConfig;
  Database: DatabaseConfig;
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

export type LogLevelType =
  | "All"
  | "OnlyInfo"
  | "OnlyError"
  | "IgnoreWarn"
  | "None";
