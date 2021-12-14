import { Application } from "express";
import ExpressServer from "@server/ExpressServer";
import Config from "@infra/config";

export async function ExpressServerSetup(): Promise<Application> {
  const config = Config.SetConfig();
  config.Server.Debug = true;

  const server = new ExpressServer(config);
  await server.SetupControllers();

  return server.app;
}
