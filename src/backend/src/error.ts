import { error } from "./logging";
import type { ExtendedRequest } from "./middlewares";
import { DrizzleQueryError } from "drizzle-orm";
import type { NextFunction, Response } from "express";
import * as z4 from "zod/v4";
import { ZodError } from "zod/v4";

// TODO: Extend HttpError
export class ClientError extends Error {
  code: number;

  constructor(message: string, code = 400) {
    super(message);
    Object.setPrototypeOf(this, ClientError.prototype);
    this.name = "ClientError";
    this.code = code;
  }
}

export class HttpError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    Object.setPrototypeOf(this, HttpError.prototype);
    this.name = "HttpError";
    this.code = code;
  }
}

export function mdwError(
  err: Error,
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): void {
  const id = req._requestId;
  if (err) {
    if (err instanceof ClientError || err instanceof HttpError) {
      error(err.message, { label: "mdwErr.HTTP", reqId: id });
      res.status(err.code).send(err.message);
    } else if (err instanceof ZodError) {
      const errMessage = z4.prettifyError(err);
      error(errMessage, { label: "mdwErr.Zod", reqId: id });
      res.status(400).send("Parâmetros inválidos!");
    } else if (err instanceof DrizzleQueryError && err.cause instanceof Error) {
      error(err.cause?.message, { label: "mdwErr.Query", reqId: id });
      res.sendStatus(500);
    } else {
      if (err instanceof Error) {
        error(err.message, { label: "mdwErr.Unk", reqId: id });
      }
      res.sendStatus(500);
    }
  } else {
    next();
  }
}
