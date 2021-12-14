import { Server } from "@overnightjs/core";
import cors from "cors";
import express from "express";
import Controllers from "@infra/loaders/Controllers";
import ExpressLogger from "@infra/logger/ExpressLogger";

export default class ExpressServer extends Server {
  private controllersList: Array<any>;

  constructor() {
    super(true);
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

      this.app.listen(port);
      resolve();
    });
  }

  private subscribeMiddlewares(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(ExpressLogger());
  }
}
