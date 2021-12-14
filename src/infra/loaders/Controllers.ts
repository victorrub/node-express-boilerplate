import path from "path";
import { readdir } from "fs/promises";
import { BaseDirectory } from "@utils/Path";

export default class Controllers {
  public async Load(): Promise<Array<any>> {
    try {
      const normalizedPath = path.join(BaseDirectory(), "controllers");

      const files = await readdir(normalizedPath);
      const controllersList = await this.GetAllControllers(files);

      return controllersList;
    } catch (ex) {
      throw new Error(
        `An error occurred while the controllers were being instantiated. Error: ${ex}`
      );
    }
  }

  private async GetAllControllers(files: Array<string>): Promise<any> {
    if (!files) {
      throw new Error("Unable to get files in selected folder");
    }

    const promiseGetControllers = files.map(this.GetController);
    const controllerList = await Promise.all(promiseGetControllers);

    return controllerList;
  }

  private async GetController(filename: string): Promise<any> {
    if (!filename) {
      throw new Error("Unable to get selected file");
    }

    if (filename === "core" || !filename.includes("Controller")) {
      return;
    }

    const moduleName = filename.split(".").slice(0, -1).join(".");
    const module = await import(`../../controllers/${filename}`);

    const controller = module[moduleName];
    const instance = new controller();

    return instance;
  }
}
