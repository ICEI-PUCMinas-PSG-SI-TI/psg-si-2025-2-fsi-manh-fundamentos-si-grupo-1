import type { NextFunction, Request, Response } from "express";
import { ClientError } from "./error";
import { warning } from "./logging";
import type { SelectUsuarioSchema } from "./db/schema/usuarios";
import servicoUsuarios from "./services/servicoUsuarios";
import servicoAutenticacao from "./services/servicoAutenticacao";

export interface SessionRequest extends Request {
  _sessionToken?: string;
}

export interface SessionUserRequest extends SessionRequest {
  _usuario?: SelectUsuarioSchema;
}

export function loadCookies(
  req: SessionRequest,
  _res: Response,
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
  _res: Response,
  next: NextFunction,
) {
  if (!req._sessionToken || req._sessionToken.length === 0) {
    warning("Usuário não autenticado", { label: "Session" });
    next(new ClientError("Não autenticado!", 400));
  } else {
    next();
  }
}

export async function parseSessionUser(
  req: SessionUserRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const sessionToken = req._sessionToken!;
    const sessao =
      await servicoAutenticacao.selecionarSessaoPorToken(sessionToken);
    if (!sessao) throw new ClientError("Not Found!", 404);
    const users = await servicoUsuarios.selecionarPorId(sessao.usuarioId);
    if (!users) throw new ClientError("Not Found!", 404);
    req._usuario = users;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRoot(
  req: SessionUserRequest,
  _res: Response,
  next: NextFunction,
) {
  try {
    const usuario = req._usuario!;
    if (usuario.nivelPermissoes !== 0)
      throw new ClientError("Unauthorized", 401);
    next();
  } catch (err) {
    next(err);
  }
}
