import Express from "@server/ExpressServer";
import DatabaseContext from "@data/DatabaseContext";
import RedisContext from "@infra/cache/Redis";
import Config from "@infra/config";
import Logger from "@infra/logger";

let server: Express;

async function Main(): Promise<void> {
  try {
    const config = Config.SetConfig();
    server = new Express(config);

    await DatabaseContext.Connect(config);
    await RedisContext.Connect(config);

    await server.SetupControllers();
    await server.Start(config.Server.Port);

    Logger.Info("Main", "Ready to Go!");
  } catch (ex) {
    Logger.Error("Main", `Unable to start server. ${ex}`);
  }
}

async function GracefulShutdown(): Promise<void> {
  Logger.Info("Main", "Ending Processes...");

  try {
    await server.Dispose();
    await DatabaseContext.Dispose();
    await RedisContext.Dispose();

    process.exit(0);
  } catch (ex) {
    Logger.Error("Main", `Unable to terminate process correctly. ${ex}`);
    process.exit(1);
  }
}

Main();

process.on("SIGINT", GracefulShutdown);
process.on("SIGTERM", GracefulShutdown);
process.on("SIGHUP", GracefulShutdown);
