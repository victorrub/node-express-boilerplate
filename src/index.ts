import Express from "@server/ExpressServer";
import Logger from "@infra/logger";

async function main(): Promise<void> {
  try {
    const server = new Express();

    await server.SetupControllers();
    await server.Start();

    Logger.Info("Main", "Ready to Go!");
  } catch (ex) {
    Logger.Error("Main", `Unable to start server. ${ex}`);
  }
}

main();
