import { Application } from "express";
import supertest from "supertest";

import { ExpressServerSetup } from "../../utils/ExpressServerSetup";

describe("Check the service status", () => {
  let express: Application;

  beforeAll(async () => {
    express = await ExpressServerSetup();
  });

  it("should connect at the server and return status 200 when request to default route", async () => {
    const { status } = await supertest(express).get("/");

    expect(status).toBe(200);
  });

  it("should request to default route and get the application status", async () => {
    const { text } = await supertest(express).get("/");

    expect(text).toBe("Healthy");
  });
});
