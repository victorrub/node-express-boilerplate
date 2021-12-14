import { Server } from "@overnightjs/core";
import cors from "cors";
import express from "express";
import http from "http";
import Controllers from "@infra/loaders/Controllers";
import type { ConfigType } from "@infra/config/types";
import Logger from "@infra/logger";
import ExpressLogger from "@infra/logger/ExpressLogger";

export default class ExpressServer extends Server {
  private controllersList: Array<any>;
  private server: http.Server;

  constructor(config: ConfigType) {
    super(config.Server.Debug);
    this.subscribeMiddlewares();
  }

  public async SetupControllers(): Promise<void> {
    const controllersLoader = new Controllers();

    this.controllersList = await controllersLoader.Load();
    super.addControllers(this.controllersList);
  }

  public async Start(port: number = 3333): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.controllersList) {
        reject(new Error("Controllers must be initialized."));
      }

      this.server = this.app.listen(port, () => {
        Logger.Info("ExpressServer.Start", `Listening on ${port}`);
        resolve();
      });
    });
  }

  public async Dispose(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.server) {
        reject(new Error("Server must be initialized."));
      }

      Logger.Info("ExpressServer.Dispose", `Closing Http server...`);

      this.server.close(() => {
        Logger.Info("ExpressServer.Dispose", `Http server closed.`);
        resolve();
      });
    });
  }

  private subscribeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(ExpressLogger());
  }
}
