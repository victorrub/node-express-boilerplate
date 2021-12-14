import fetch, { Response, RequestInit, HeadersInit } from "node-fetch";
import type { RequestOptions, ErrResponse } from "./types";
import RequestURL from "@utils/RequestURL";
import { SetBodyFormData } from "@utils/RequestFormData";
import { StatusCodes } from "http-status-codes";
import Wait from "@utils/Wait";
import {
  ApplicationError,
  ArgumentError,
  AuthenticationError,
} from "@domain/exceptions";

export default async function Request(
  options: RequestOptions
): Promise<Response> {
  const requestURL = RequestURL.Format(options);

  const requestHeaders: HeadersInit = options.Headers || {};

  const contentType = options.ContentType || "application/json";
  const encoding = options.Encoding || "UTF-8";

  if (!requestHeaders["Content-type"]) {
    requestHeaders["Content-type"] = `${contentType}; charset=${encoding}`;
  }

  if (options.Authorization && !requestHeaders["Authorization"]) {
    requestHeaders["Authorization"] = options.Authorization || "none";
  }

  if (options.FormData) {
    options.Body = SetBodyFormData(options.FormData);

    if (contentType === "application/json") {
      const formType = `application/x-www-form-urlencoded; charset=${encoding}`;
      requestHeaders["Content-type"] = formType;
    }
  }

  const requestArgs: RequestInit = {
    method: options.Method || "GET",
    headers: requestHeaders,
    body: options.Body || null,
    redirect: options.Redirect || "follow",
  };

  return executeRequest(requestURL, requestArgs, options.RetryTimes || 3);
}

async function executeRequest(
  url: string,
  args: RequestInit,
  retryTimes: number = 3
): Promise<Response> {
  let err: Error = new Error();

  for (let i = 0; i < retryTimes; i++) {
    const response = await fetch(url, args);

    if (isSuccess(response.status)) {
      return response;
    }

    if (response.status === StatusCodes.UNAUTHORIZED) {
      const data = (await response.json()) as ErrResponse;

      throw new AuthenticationError(
        "Unable to authenticate to the external service.",
        data.error || "AUTH_ERR",
        "client"
      );
    }

    if (response.status === StatusCodes.NOT_FOUND) {
      err = new ArgumentError(
        "The requested resource was not found.",
        "Not Found"
      );

      await Wait(2);
      continue;
    }

    err = new ApplicationError(
      `Unable to perform the operation. The request returned status ${response.status}.`
    );

    await Wait(2);
  }

  throw err;
}

function isSuccess(statusCode: number) {
  return (
    statusCode == StatusCodes.OK ||
    statusCode == StatusCodes.CREATED ||
    statusCode == StatusCodes.ACCEPTED ||
    statusCode == StatusCodes.NO_CONTENT
  );
}
