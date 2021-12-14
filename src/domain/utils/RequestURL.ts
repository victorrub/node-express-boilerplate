import type { RequestOptions } from "@infra/request/types";
import { OperationError } from "@domain/exceptions";

export default class RequestURL {
  public static Format(options: RequestOptions): string {
    let baseURL = options.BaseURL;
    let path = options.Path || "";

    if (baseURL[baseURL.length - 1] === "/") {
      baseURL = baseURL.substring(0, baseURL.length - 1);
    }

    if (path[0] === "/") {
      path = path.substring(1);
    }

    if (options.EndTrailingSlash) {
      path = this.setEndTrailingSlash(path);
    }

    if (options.PathVariables) {
      path = this.setPathVariables(path, options);
    }

    if (options.QueryParams) {
      path = this.setQueryParams(path, options);
    }

    if (path === "" || path === "/" || path[0] === "?") {
      return baseURL + path;
    }

    return baseURL + "/" + path;
  }

  private static setPathVariables(path: string, options: RequestOptions) {
    let splittedPath = path.split("/");
    const pathVariablesDict = options.PathVariables || {};

    const result = splittedPath.map((value) => {
      if (value[0] !== ":") return value;

      const pathKey = value.substring(1);
      const mappedValue = pathVariablesDict[pathKey];

      if (!mappedValue)
        throw new OperationError(
          "Invalid path",
          `Path variables dictionary has no value for ${pathKey} key`
        );

      return mappedValue;
    });

    return result.join("/");
  }

  private static setQueryParams(path: string, options: RequestOptions) {
    if (options.EndTrailingSlash) {
      path += "/";
    }

    path += "?";

    for (let paramKey in options.QueryParams) {
      const paramValue = options.QueryParams[paramKey];
      path += `${paramKey}=${paramValue}&`;
    }

    return path.substring(0, path.length - 1);
  }

  private static setEndTrailingSlash(path: string): string {
    if (path[path.length - 1] === "/") {
      return path;
    }

    return path + "/";
  }
}
