import { RedisClient, createClient } from "redis";
import type { ConfigType } from "@infra/config/types";
import Logger from "@infra/logger";

class Redis {
  private client: RedisClient;
  private defaultExpirationTime: number;
  private clientStatus: "running" | "connecting" | "error" = "connecting";

  public async Connect(config: ConfigType): Promise<void> {
    this.client = createClient({
      host: config.Cache.Host,
      port: config.Cache.Port,
      db: config.Cache.Database || 0,
      password: config.Cache.Password || undefined,
      prefix: config.Cache.KeyPrefix,
      max_attempts: 3,
    });

    this.setListeners();
    this.defaultExpirationTime = config.Cache.ExpirationTime;
  }

  public async Get(key: string): Promise<string> {
    return new Promise((resolve) => {
      const status = this.checkClientInstance();
      if (!status) resolve("");

      this.client.get(key, (err, data) => {
        if (err) {
          Logger.Warn("Redis.Get", `Unable to connect to Redis: ${err}`);
          resolve("");
        }

        resolve(data || "");
      });
    });
  }

  public async Set(
    key: string,
    value: string,
    expireTime?: number
  ): Promise<void> {
    return new Promise((resolve) => {
      const status = this.checkClientInstance();
      if (!status) resolve();

      this.client.set(key, value, (err, data) => {
        if (err) {
          Logger.Warn("Redis.Set", `Unable to connect to Redis: ${err}`);
          resolve();
        }
      });

      const expirationTime = expireTime || this.defaultExpirationTime;

      this.client.expire(key, expirationTime, (err, data) => {
        if (err) {
          Logger.Warn("Redis.Set", `Unable to connect to Redis: ${err}`);
        }

        resolve();
      });
    });
  }

  public async ConnectionTest(): Promise<boolean> {
    return new Promise((resolve) => {
      this.checkClientInstance();
      if (this.clientStatus === "connecting") resolve(false);

      this.client.ping((err, data) => {
        if (err) {
          Logger.Warn(
            "Redis.ConnectionTest",
            `Unable to connect to Redis: ${err}`
          );
          resolve(false);
        }

        resolve(true);
      });
    });
  }

  public async Dispose(): Promise<void> {
    return new Promise((resolve, reject) => {
      const conn = this.checkClientInstance();
      if (!conn) reject(new Error("Redis connection must be initialized."));

      Logger.Info("Redis.Dispose", `Closing Redis connection...`);

      this.client.quit((err, data) => {
        if (err) {
          reject(new Error(`Unable to disconnect from Redis: ${err}`));
        }

        Logger.Info("Redis.Dispose", `Redis connection closed.`);
        resolve();
      });
    });
  }

  private setListeners() {
    this.client.on("error", (err) => {
      Logger.Warn("Redis", `Redis Client Connection Error. ${err}`);
      this.clientStatus = "error";
    });

    this.client.on("connect", async () => {
      Logger.Info("Redis", "Redis Client Connected");
      await this.ConnectionTest();
      this.clientStatus = "running";
    });
  }

  private checkClientInstance(): boolean {
    if (!this.client) {
      throw new Error("Redis Client Connection must be initialized.");
    }

    return this.clientStatus === "running";
  }
}

class Singleton {
  private static _instance: Redis;

  public static get Instance(): Redis {
    return this._instance || (this._instance = new Redis());
  }
}

export default Singleton.Instance;
