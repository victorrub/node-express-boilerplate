import { Request, Response, StatusCodes } from "./index";
import * as Exceptions from "@domain/exceptions";
import Logger from "@infra/logger";

export default class ControllerBase {
  protected GetHeader(
    request: Request,
    key: string,
    authHeader: boolean = false,
    required: boolean = true
  ): string {
    const headerValue = request.header(key) || "";

    if (
      required &&
      (!headerValue || headerValue === "" || headerValue === null)
    ) {
      if (authHeader) {
        throw new Exceptions.AuthenticationError(
          `Unable to authenticate client. Please check the credentials and try again later.`,
          "Invalid_Token",
          "client"
        );
      }

      throw new Exceptions.ValidationError(`${key} header is required`);
    }

    return String(headerValue);
  }

  protected GetQueryParam(
    request: Request,
    key: string,
    required: boolean = true
  ): string {
    const paramValue = request.query[key] || "";

    if (required && (!paramValue || paramValue === "" || paramValue === null)) {
      throw new Exceptions.ValidationError(
        `${key} field cannot be null or empty`
      );
    }

    return String(paramValue);
  }

  protected GetQueryParamAsNumber(
    request: Request,
    key: string,
    required: boolean = true,
    notZero: boolean = true
  ): number {
    const paramValue = request.query[key] || "";

    if (
      required &&
      (!paramValue ||
        paramValue === "" ||
        paramValue === "NaN" ||
        paramValue === null)
    ) {
      throw new Exceptions.ValidationError(
        `${key} field cannot be null or empty`
      );
    }

    if (notZero && (paramValue === "" || paramValue === "0")) {
      throw new Exceptions.ValidationError(`${key} field cannot be zero`);
    }

    return Number(paramValue);
  }

  protected ErrorResponse(
    methodName: string,
    err: any,
    response: Response
  ): Response {
    let status = StatusCodes.SERVICE_UNAVAILABLE;
    let message =
      "An error occurred while trying to perform the operation. Try again later";

    if (err instanceof Exceptions.AuthenticationError) {
      status = StatusCodes.BAD_REQUEST;
      message =
        "An error occurred while trying to authenticate the customer. Check credentials and try again later.";
    }

    if (err instanceof Exceptions.ValidationError) {
      status = StatusCodes.BAD_REQUEST;
      message = err.Message;
    }

    if (err instanceof Exceptions.ArgumentError) {
      status = StatusCodes.BAD_REQUEST;
      message = err.Message;
    }

    Logger.Error(
      methodName,
      `${err.Message || err.message} | ${err.OriginalError}`
    );

    return response
      .status(status)
      .send({ message, original_error: err.OriginalError });
  }
}
