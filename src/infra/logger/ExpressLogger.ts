import { Handler } from "express";
import winston from "winston";
import expressWinston from "express-winston";

export default function ExpressLogger(): Handler {
  return expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.align(),
      winston.format.colorize(),
      winston.format.printf(
        (info) => `[${[info.timestamp]}] ${info.level}: ${info.message}`
      )
    ),
    meta: false,
    msg: "HTTP  ",
    expressFormat: true,
    colorize: false,
    ignoreRoute: function (req, res) {
      return false;
    },
  });
}
