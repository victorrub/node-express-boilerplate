import Express from "@server/ExpressServer";

async function main(): Promise<void> {
  try {
    const server = new Express();

    await server.SetupControllers();
    await server.Start();

    console.log("Ready to Go!");
  } catch (ex) {
    console.error(`Unable to start server. ${ex}`);
  }
}

main();
