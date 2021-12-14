/**
 * Exception whose message can be returned to the client
 */
export class ValidationError extends Error {
  private _message: string;
  private _originalError: string;

  constructor(message: string, originalError?: string) {
    super(message);

    this._message = message;
    this._originalError = originalError || "";

    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  public get Message() {
    return this._message;
  }

  public get OriginalError() {
    return this._originalError || "";
  }
}
