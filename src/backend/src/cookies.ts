import type { NextFunction, Request, Response } from "express";
import { ClientError } from "./error";
import { warning } from "./logging";

export interface SessionRequest extends Request {
  _sessionToken?: string;
}

export function loadCookies(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const cookies = req.cookies;
    if (typeof cookies.session_token !== "string")
      throw new ClientError("Não autenticado!", 400);
    req._sessionToken = cookies.session_token;
    next();
  } catch (err) {
    warning("Usuário não autenticado", { label: "Cookies" });
    next(err);
  }
}

export function requireSession(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  if (!req._sessionToken || req._sessionToken.length === 0) {
    warning("Usuário não autenticado", { label: "Session" });
    next(new ClientError("Não autenticado!", 400));
  } else {
    next();
  }
}
