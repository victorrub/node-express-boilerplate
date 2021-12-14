/**
 * Exception whose message should only be logged internally.
 * Return a default error message to the client.
 */
export class ApplicationError extends Error {
  private _message: string;

  constructor(message: string) {
    super(message);
    this._message = message;

    Object.setPrototypeOf(this, ApplicationError.prototype);
  }

  public get Message() {
    return this._message;
  }
}
