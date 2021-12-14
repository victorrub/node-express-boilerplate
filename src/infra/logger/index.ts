import Log from "jet-logger";

export default class Logger {
  public static Info(methodName: string, message: string) {
    Log.Info(this.logStructure(methodName, message));
  }

  public static Error(methodName: string, message: string) {
    Log.Err(this.logStructure(methodName, message));
  }

  public static Warn(methodName: string, message: string) {
    Log.Warn(this.logStructure(methodName, message));
  }

  public static Important(methodName: string, message: string) {
    Log.Imp(this.logStructure(methodName, message));
  }

  private static logStructure(methodName: string, message: string): string {
    return `[${methodName}] ${message}`;
  }
}
