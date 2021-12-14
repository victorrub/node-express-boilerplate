import { HeadersInit, RequestRedirect } from "node-fetch";

export declare type RequestOptions = {
  BaseURL: string;
  Path?: string;
  QueryParams?: Object;
  PathVariables?: Object;
  EndTrailingSlash?: boolean;
  Method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
  Headers?: HeadersInit;
  ContentType?: string;
  Encoding?: string;
  Authorization?: string;
  Body?: string | null;
  FormData?: Object;
  Redirect?: RequestRedirect;
  RetryTimes?: number;
};

export declare type ErrResponse = {
  error: string;
};
