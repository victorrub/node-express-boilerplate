import type { Level } from "./types";

/**
 * Exception whose message can be returned to the client depending on the defined level
 */
export class AuthenticationError extends Error {
  private _message: string;
  private _originalError: string;
  private _level: Level;

  constructor(message: string, originalError?: string, level?: Level) {
    super(message);

    this._message = message;
    this._originalError = originalError || "";
    this._level = level || "application";

    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }

  public get Message() {
    if (!this._level || this._level == "application") {
      return "Unable to perform the operation. Try again later";
    }

    return this._message;
  }

  public get OriginalError() {
    return this._originalError || "AUTH_ERR";
  }
}
