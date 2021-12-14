import { Request, Response } from "express";
import { Controller, Get } from "@overnightjs/core";
import { StatusCodes } from "http-status-codes";

@Controller("/")
export class HealthController {
  @Get()
  public Check(_: Request, response: Response): Response {
    return response.status(StatusCodes.OK).send("Healthy");
  }
}
