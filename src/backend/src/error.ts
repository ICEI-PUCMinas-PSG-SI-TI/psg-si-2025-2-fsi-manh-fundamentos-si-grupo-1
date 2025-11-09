import type { NextFunction, Response } from "express";
import type { ExtendedRequest } from "./middlewares";
import { DrizzleQueryError } from "drizzle-orm";
import z, { ZodError } from "zod";
import { error } from "./logging";

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
) {
  const id = req._requestId;
  if (err) {
    if (err instanceof ClientError || err instanceof HttpError) {
      res.status(err.code).send(err.message);
    } else if (err instanceof ZodError) {
      const errMessage = z.prettifyError(err);
      error(errMessage, { reqId: id });
      res.status(400).send("Parâmetros inválidos!");
    } else if (err instanceof DrizzleQueryError && err.cause instanceof Error) {
      error(err.cause?.message, { label: "query", reqId: id });
      res.sendStatus(500);
    } else {
      if (err instanceof Error) error(err.message, { reqId: id });
      res.sendStatus(500);
    }
  } else {
    next();
  }
}
