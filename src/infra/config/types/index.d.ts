export declare type ConfigType = {
  Server: ServerConfig;
};

declare type ServerConfig = {
  Port: number;
  Environment: string;
  LogLevel: LogLevelType;
  Debug: boolean;
};

export type LogLevelType =
  | "All"
  | "OnlyInfo"
  | "OnlyError"
  | "IgnoreWarn"
  | "None";
