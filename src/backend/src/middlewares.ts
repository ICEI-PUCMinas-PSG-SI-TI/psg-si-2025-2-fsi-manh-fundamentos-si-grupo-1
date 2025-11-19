import { COOKIE_SESSION_TOKEN } from "./auth";
import { Permissoes } from "./db/enums/permissoes";
import { ClientError } from "./error";
import { error, warning } from "./logging";
import servicoAutenticacao, {
  type UserSessionInfo,
} from "./services/servicoAutenticacao";
import type { NextFunction, Request, Response } from "express";

export type Cookies = {
  tokenSessao?: string;
};

export interface ExtendedRequest extends Request {
  /**
   * @deprecated Utilizar _cookies.tokenSessao
   */
  _sessionToken?: string;
  _usuario?: UserSessionInfo;
  _requestId?: string;
  _cookies?: Cookies;
}

function extrairCookies(cookies: unknown): Cookies | null {
  if (!cookies || typeof cookies !== "object") return null;
  const _cookies: Cookies = {};
  if (
    COOKIE_SESSION_TOKEN in cookies &&
    typeof cookies.session_token === "string"
  ) {
    _cookies.tokenSessao = cookies.session_token;
  }
  return _cookies;
}

export function mdwLoadSessionCookies(
  req: ExtendedRequest,
  _res: Response,
  next: NextFunction,
): void {
  try {
    const cookies = extrairCookies(req.cookies);
    if (typeof cookies?.tokenSessao !== "string")
      throw new ClientError("Não autenticado!", 400);
    req._cookies = cookies;
    req._sessionToken = cookies.tokenSessao;
    next();
  } catch (err) {
    warning("Usuário não autenticado", { label: "Cookies" });
    next(err);
  }
}

// TODO: Limpar cookies?
// TODO: Criar HttpError401
// TODO: Utilizar consultarSessao e mover toda a lógica par ao serviço
export async function mdwAutenticacao(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const cookies = extrairCookies(req.cookies);
    if (typeof cookies?.tokenSessao !== "string")
      throw new ClientError("Unauthorized", 401);
    req._cookies = cookies;
    req._sessionToken = cookies.tokenSessao;
    if (!req._cookies.tokenSessao || req._cookies.tokenSessao.length === 0) {
      warning("Cookies de sessão não encontrados na request.", {
        label: "Session",
      });
      throw new ClientError("Unauthorized", 401);
    }
    const usuarioSessao = await servicoAutenticacao.consultarSessaoPorToken(
      req._cookies?.tokenSessao,
    );
    if (!usuarioSessao) {
      warning("Sessão inválida", {
        label: "Session",
      });
      throw new ClientError("Unauthorized", 401);
    }
    req._usuario = usuarioSessao;
    next();
  } catch (err) {
    next(err);
  }
}

export function mdwPermissoes(...perms: Permissoes[]) {
  return (req: ExtendedRequest, _res: Response, next: NextFunction): void => {
    try {
      const usuario = req._usuario;
      let permitido = false;
      if (usuario) {
        permitido = perms.reduce(
          (ok, perm) => ok || usuario.permissoes.includes(perm),
          permitido,
        );
      }
      if (!permitido) throw new ClientError("Unauthorized", 401);
      next();
    } catch (err) {
      next(err);
    }
  };
}

export function mdwRequestId(
  req: ExtendedRequest,
  _res: Response,
  next: NextFunction,
): void {
  // Source - https://stackoverflow.com/questions/6248666/how-to-generate-short-uid-like-ax4j9z-in-js
  // Posted by kennytm
  // Retrieved 11/5/2025, License - CC-BY-SA 4.0

  const firstPart = (Math.random() * 46656) | 0;
  const secondPart = (Math.random() * 46656) | 0;
  req._requestId =
    ("000" + firstPart.toString(36)).slice(-3) +
    ("000" + secondPart.toString(36)).slice(-3);
  next();
}

export function mdwSemBody(
  req: ExtendedRequest,
  _res: Response,
  next: NextFunction,
): void {
  if (req.body) {
    error("Invalid request with body.", {
      reqId: req._requestId,
    });
    next(new ClientError("Bad Request"));
  } else {
    next();
  }
}

export function mdwRequerBody(
  req: ExtendedRequest,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.body) {
    error("No body.", { reqId: req._requestId });
    next(new ClientError("Bad Request"));
  } else {
    next();
  }
}
