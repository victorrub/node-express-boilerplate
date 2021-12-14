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
