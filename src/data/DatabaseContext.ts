import { Sequelize, Dialect, QueryTypes } from "sequelize";
import type { ConfigType } from "@infra/config/types";
import Logger from "@infra/logger";

class DatabaseContext {
  private dbConnection: Sequelize;

  public async Connect(config: ConfigType): Promise<void> {
    this.dbConnection = new Sequelize({
      host: config.Database.Host,
      port: config.Database.Port,
      username: config.Database.User,
      password: config.Database.Password,
      database: config.Database.DatabaseName,
      dialect: (config.Database.Dialect as Dialect) || "sqlite",
      logging: config.Server.Debug ? console.log : false,
    });

    const result = await this.ConnectionTest();
    if (result) Logger.Info("Sequelize.Connect", "Database Connected");
  }

  public async Query(query: string, params?: Object): Promise<any> {
    this.checkClientInstance();

    const result = await this.executeQuery(query, QueryTypes.SELECT, params);
    return result;
  }

  public async QueryOne(query: string, params?: Object): Promise<Object> {
    this.checkClientInstance();

    const result = await this.executeQuery(query, QueryTypes.SELECT, params);
    return result[0] || {};
  }

  public async Execute(
    query: string,
    params?: Object,
    queryType?: QueryTypes
  ): Promise<any> {
    this.checkClientInstance();

    const transactionResult = await this.dbConnection.transaction(async (t) => {
      const queryResult = await this.executeQuery(
        query,
        queryType || QueryTypes.RAW,
        params
      );

      return queryResult;
    });

    return transactionResult;
  }

  public async ConnectionTest(): Promise<boolean> {
    this.checkClientInstance();

    try {
      await this.dbConnection.authenticate();
      return true;
    } catch (ex) {
      throw new Error(`Unable to connect to the database: ${ex}`);
    }
  }

  public async Dispose(): Promise<void> {
    if (!this.dbConnection) return;

    Logger.Info("DatabaseContext.Dispose", `Closing Database connection...`);
    await this.dbConnection.close();

    Logger.Info("DatabaseContext.Dispose", `Database connection closed.`);
  }

  private async executeQuery(
    query: string,
    type: QueryTypes,
    params?: any
  ): Promise<any> {
    if (!query) {
      throw new Error("The SQL query cannot be null or empty!");
    }

    return await this.dbConnection.query(query, {
      replacements: params || undefined,
      type,
    });
  }

  private checkClientInstance(): void {
    if (!this.dbConnection) {
      throw new Error("Database Connection must be initialized.");
    }
  }
}

class Singleton {
  private static _instance: DatabaseContext;

  public static get Instance(): DatabaseContext {
    return this._instance || (this._instance = new DatabaseContext());
  }
}

export default Singleton.Instance;
