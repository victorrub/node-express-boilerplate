import { Application } from "express";
import ExpressServer from "@server/ExpressServer";

export async function ExpressServerSetup(): Promise<Application> {
  const server = new ExpressServer();
  await server.SetupControllers();

  return server.app;
}
