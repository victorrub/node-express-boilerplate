import ControllerBase from "./core/ControllerBase";
import { Request, Response, StatusCodes } from "./core";
import { Controller, Get } from "@overnightjs/core";

@Controller("/")
export class HealthController extends ControllerBase {
  @Get()
  public Check(_: Request, response: Response): Response {
    return response.status(StatusCodes.OK).send("Healthy");
  }
}
