import type { NextFunction, Request, Response } from "express";
import { customAlphabet } from "nanoid";
import { COOKIE_SESSION_TOKEN } from "./auth";
import { alfabetoHexadecimal } from "./db/enums/identificador";
import { Permissoes } from "./db/enums/permissoes";
import { error, warning } from "./logging";
import servicoAutenticacao, {
  type GetSessaoDto,
} from "./services/servicoAutenticacao";

export type Cookies = {
  tokenSessao?: string;
};

export interface ExtendedRequest extends Request {
  /**
   * @deprecated Utilizar _cookies.tokenSessao
   */
  _sessionToken?: string;
  _usuario?: GetSessaoDto;
  _requestId?: string;
  _cookies?: Cookies;
}

function extrairCookies(cookies: unknown): Cookies | null {
  if (!cookies || typeof cookies !== "object") {
    return null;
  }
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
  res: Response,
  next: NextFunction,
): void {
  try {
    const cookies = extrairCookies(req.cookies);
    if (typeof cookies?.tokenSessao !== "string") {
      res.sendStatus(400);
      return;
    }
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
    if (typeof cookies?.tokenSessao !== "string") {
      res.sendStatus(401);
      return;
    }
    req._cookies = cookies;
    req._sessionToken = cookies.tokenSessao;
    if (!req._cookies.tokenSessao || req._cookies.tokenSessao.length === 0) {
      warning("Cookies de sessão não encontrados na request.", {
        label: "Session",
      });
      res.sendStatus(401);
      return;
    }
    const usuarioSessao = await servicoAutenticacao.consultarSessaoPorToken(
      req._cookies?.tokenSessao,
    );
    if (!usuarioSessao) {
      warning("Sessão inválida", {
        label: "Session",
      });
      res.sendStatus(401);
      return;
    }
    req._usuario = usuarioSessao;
    next();
  } catch (err) {
    next(err);
  }
}

export function mdwPermissoes(
  ...perms: Permissoes[]
): (e: ExtendedRequest, res: Response, n: NextFunction) => void {
  return (req: ExtendedRequest, res: Response, next: NextFunction): void => {
    try {
      const usuario = req._usuario;
      let permitido = false;
      if (usuario) {
        permitido = perms.reduce(
          (ok, perm) => ok || usuario.permissoes.includes(perm),
          permitido,
        );
      }
      if (permitido) {
        next();
      } else {
        res.sendStatus(401);
        return;
      }
    } catch (err) {
      next(err);
    }
  };
}

const createRequestId = customAlphabet(alfabetoHexadecimal, 4);

export function mdwRequestId(
  req: ExtendedRequest,
  _res: Response,
  next: NextFunction,
): void {
  req._requestId = createRequestId();
  next();
}

export function mdwSemBody(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.body) {
    error("Invalid request with body.", {
      reqId: req._requestId,
    });
    res.sendStatus(400);
  } else {
    next();
  }
}

export function mdwRequerBody(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): void {
  if (!req.body) {
    error("No body.", { reqId: req._requestId });
    res.sendStatus(400);
  } else {
    next();
  }
}
