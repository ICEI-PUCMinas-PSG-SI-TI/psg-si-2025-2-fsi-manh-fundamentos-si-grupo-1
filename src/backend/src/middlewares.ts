import type { NextFunction, Request, Response } from "express";
import type { SessionRequest } from "./cookies";
import { ClientError } from "./error";
import { error } from "./logging";

export interface BodyRequest extends SessionRequest {
  body: unknown;
}

export interface RequestId extends Request {
  _id: string;
}

export function addRequestId(req: Request, _res: Response, next: NextFunction) {
  // Source - https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
  // Posted by kennytm
  // Retrieved 11/5/2025, License - CC-BY-SA 4.0

  const firstPart = (Math.random() * 46656) | 0;
  const secondPart = (Math.random() * 46656) | 0;
  (req as RequestId)._id =
    ("000" + firstPart.toString(36)).slice(-3) +
    ("000" + secondPart.toString(36)).slice(-3);
  next();
}

export function requireBody(
  req: SessionRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    if (!req.body) {
      error("No body", { reqId: "r34234" });
      throw new ClientError("Bad Request");
    }
    next();
  } catch (err) {
    next(err);
  }
}
