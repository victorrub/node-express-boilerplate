import RequestURL from "./RequestURL";
import type { RequestOptions } from "../../infra/request/types";

describe("[Utils] Format URLs", () => {
  it(
    "should return the correctly formatted URL",
    Format_OnlyBaseURL_ReturnsFormattedURL
  );

  it("should return the correctly formatted URL with path - case 0", () =>
    Format_BaseURLAndPath_ReturnsFormattedURL(
      "https://www.google.com.br/",
      "/api/v1/maps",
      "https://www.google.com.br/api/v1/maps"
    ));

  it("should return the correctly formatted URL with path - case 1", () =>
    Format_BaseURLAndPath_ReturnsFormattedURL(
      "https://www.google.com.br",
      "/api/v1/maps",
      "https://www.google.com.br/api/v1/maps"
    ));

  it("should return the correctly formatted URL with path - case 2", () =>
    Format_BaseURLAndPath_ReturnsFormattedURL(
      "https://www.google.com.br/",
      "api/v1/maps",
      "https://www.google.com.br/api/v1/maps"
    ));

  it("should return the correctly formatted URL with path - case 3", () =>
    Format_BaseURLAndPath_ReturnsFormattedURL(
      "https://www.google.com.br",
      "api/v1/maps",
      "https://www.google.com.br/api/v1/maps"
    ));

  it(
    "should return the correctly formatted URL replacing the path variables",
    Format_WithPathVariables_ReturnsFormattedURL
  );

  it(
    "should return the correctly formatted URL adding the query parameters",
    Format_WithQueryParams_ReturnsFormattedURL
  );

  // Fact
  function Format_OnlyBaseURL_ReturnsFormattedURL() {
    // Arrange
    const requestOptions: RequestOptions = {
      BaseURL: "https://www.google.com.br/",
      EndTrailingSlash: true,
      Method: "GET",
    };

    const expected = "https://www.google.com.br/";

    // Act
    const actual = RequestURL.Format(requestOptions);

    // Assert
    expect(actual).toBe(expected);
  }

  // Theory
  function Format_BaseURLAndPath_ReturnsFormattedURL(
    baseURL: string,
    path: string,
    expected: string
  ) {
    // Arrange
    const requestOptions: RequestOptions = {
      BaseURL: baseURL,
      Path: path,
      Method: "GET",
    };

    // Act
    const actual = RequestURL.Format(requestOptions);

    // Assert
    expect(actual).toBe(expected);
  }

  // Fact
  function Format_WithPathVariables_ReturnsFormattedURL() {
    // Arrange
    const requestOptions: RequestOptions = {
      BaseURL: "https://www.google.com.br/",
      Path: "/api/:version/maps",
      PathVariables: {
        version: "v1",
      },
      Method: "GET",
    };

    const expected = "https://www.google.com.br/api/v1/maps";

    // Act
    const actual = RequestURL.Format(requestOptions);

    // Assert
    expect(actual).toBe(expected);
  }

  // Fact
  function Format_WithQueryParams_ReturnsFormattedURL() {
    // Arrange
    const requestOptions: RequestOptions = {
      BaseURL: "https://www.google.com.br/",
      Path: "/api/v1/maps",
      QueryParams: {
        search: "Potato",
        user: "Me",
      },
      Method: "GET",
    };

    const expected =
      "https://www.google.com.br/api/v1/maps?search=Potato&user=Me";

    // Act
    const actual = RequestURL.Format(requestOptions);

    // Assert
    expect(actual).toBe(expected);
  }
});
