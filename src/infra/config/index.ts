import type { ConfigType, LogLevelType } from "./types";
import Logger from "@infra/logger";
import dotenv from "dotenv";

class Config {
  private _config: ConfigType;

  public SetConfig(): ConfigType {
    dotenv.config();

    this._config = {
      Server: {
        Port: Number(process.env.PORT) || 3333,
        Environment: process.env.NODE_ENV || "development",
        LogLevel: (process.env.LOG_LEVEL as LogLevelType) || "All",
        Debug: process.env.DEBUG === "true" || false,
      },
      Database: {
        Host: process.env.DB_HOST || "",
        Port: Number(process.env.DB_PORT) || 0,
        DatabaseName: process.env.DB_NAME || "",
        User: process.env.DB_USER || "",
        Password: process.env.DB_PASS || "",
        Dialect: process.env.DB_DIALECT || "sqlite",
      },
      Cache: {
        Host: process.env.REDIS_HOST || "",
        Port: Number(process.env.REDIS_PORT) || 0,
        User: process.env.REDIS_USER,
        Password: process.env.REDIS_PASS,
        Database: Number(process.env.REDIS_DB) || 0,
        KeyPrefix: process.env.REDIS_PREFIX,
        ExpirationTime: Number(process.env.REDIS_EXPIRE_TIME) || 900,
      },
    };

    Logger.Info(
      "Config",
      `Defining settings for the ${this._config.Server.Environment} environment`
    );

    return this._config;
  }

  public GetConfig(): ConfigType {
    return this._config;
  }
}

class Singleton {
  private static _instance: Config;

  public static get Instance(): Config {
    return this._instance || (this._instance = new Config());
  }
}

export default Singleton.Instance;
