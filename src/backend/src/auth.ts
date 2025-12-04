import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import { ClientError } from "./error";
import { error } from "./logging";
import {
  type ExtendedRequest,
  mdwAutenticacao,
  mdwLoadSessionCookies,
  mdwRequerBody,
  mdwSemBody,
} from "./middlewares";
import servicoAutenticacao, {
  CredenciaisSchemaZ,
} from "./services/servicoAutenticacao";

const authRouter = Router();

export const COOKIE_SESSION_TOKEN = "session_token";

// A aplicação ira suportar criação de novos logins apenas por administradores
// POST /auth/login
// POST /auth/logout

/**
 * Retorna informações do usuário da sessão de acordo com o token de sessão.
 */
async function sessao(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const _sessionToken = req._sessionToken;
    if (!_sessionToken) {
      throw new ClientError("Não autenticado!", 401);
    }
    const sessao =
      await servicoAutenticacao.consultarSessaoPorToken(_sessionToken);
    res.json(sessao);
  } catch (err) {
    next(err);
  }
}

/**
 * Recebe login e senha e cria uma nova sessão retornando token e informações
 * do usuário da sessão.
 */
async function login(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedCredenciais = CredenciaisSchemaZ.parse(req.body);
    // if login invalid, this function will return a error
    // else, it will return the token
    const userAgent = req.headers["user-agent"] || "";
    const reqIp = req.ip || "";
    const infoSessao = await servicoAutenticacao.login(
      parsedCredenciais.login,
      parsedCredenciais.senha,
      userAgent,
      reqIp,
    );
    res.cookie(COOKIE_SESSION_TOKEN, infoSessao.token, {
      httpOnly: true,
      // TODO: Use when http available or create a DEVELOPMENT env var
      // secure: true,
      // maxAge: 24hours
      maxAge: 86400000,
      path: "/",
      sameSite: "lax",
    });
    res.json(infoSessao.usuario);
  } catch (err) {
    error("Não foi possível realizar o login.", { label: "Auth" });
    next(err);
  }
}

async function logout(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // this function will receive the token, invalidate, and redirect
  try {
    const _sessionToken = req._sessionToken;
    // TODO: Limpar todos os cookies
    res.clearCookie(COOKIE_SESSION_TOKEN);
    if (_sessionToken) {
      await servicoAutenticacao.logout(_sessionToken);
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

async function logoutAll(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // this function will receive the token, invalidate, and redirect
  try {
    const _sessionToken = req._sessionToken;
    // TODO: Limpar todos os cookies
    res.clearCookie(COOKIE_SESSION_TOKEN);
    if (_sessionToken) {
      await servicoAutenticacao.logoutAll(_sessionToken);
    }
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

authRouter
  .get("/sessao", mdwAutenticacao, mdwSemBody, sessao)
  .post("/login", mdwRequerBody, login)
  .post("/logout", mdwLoadSessionCookies, logout)
  .post("/logout-all", mdwLoadSessionCookies, logoutAll)
  // Retornar 404 caso a rota não existe (necessário devido a rota inicial
  // redirecionar para index.html)
  .all(/(.*)/, (_: Request, res: Response) => res.sendStatus(404));

export default authRouter;
