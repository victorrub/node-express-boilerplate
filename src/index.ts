import Express from "@server/ExpressServer";
import DatabaseContext from "@data/DatabaseContext";
import Config from "@infra/config";
import Logger from "@infra/logger";

async function main(): Promise<void> {
  try {
    const config = Config.SetConfig();
    const server = new Express(config);

    await DatabaseContext.Connect(config);

    await server.SetupControllers();
    await server.Start(config.Server.Port);

    Logger.Info("Main", "Ready to Go!");
  } catch (ex) {
    Logger.Error("Main", `Unable to start server. ${ex}`);
  }
}

main();
