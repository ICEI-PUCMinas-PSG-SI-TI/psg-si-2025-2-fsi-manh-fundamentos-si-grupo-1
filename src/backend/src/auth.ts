import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { ClientError } from "./error";
import {
  ServicoAutenticacao,
  CredenciaisSchemaZ,
} from "./services/servicoAutenticacao";
import { error } from "./logging";
import { loadCookies, requireSession, type SessionRequest } from "./cookies";
import { noBody, requireBody } from "./middlewares";

const authRouter = Router();

const COOKIE_SESSION_TOKEN = "session_token";

const servicoAutenticacao = new ServicoAutenticacao();

// A aplicação ira suportar criação de novos logins apenas por administradores
// POST /auth/login
// POST /auth/logout

/**
 * Retorna informações do usuário da sessão de acordo com o token de sessão.
 */
async function sessao(req: SessionRequest, res: Response, next: NextFunction) {
  try {
    const _sessionToken = req._sessionToken;
    if (!_sessionToken) throw new ClientError("Não autenticado!", 400);
    const sessao =
      await servicoAutenticacao.consultarSessaoPorToken(_sessionToken);
    res.send(sessao);
  } catch (err) {
    next(err);
  }
}

/**
 * Recebe login e senha e cria uma nova sessão retornando token e informações
 * do usuário da sessão.
 */
async function login(req: Request, res: Response, next: NextFunction) {
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
    res.send(infoSessao.usuario);
  } catch (err) {
    error("Não foi possível realizar o login.", { label: "Auth" });
    next(err);
  }
}

async function logout(req: SessionRequest, res: Response, next: NextFunction) {
  // this function will receive the token, invalidate, and redirect
  try {
    const _sessionToken = req._sessionToken;
    // TODO: Limpar todos os cookies
    res.clearCookie(COOKIE_SESSION_TOKEN);
    if (_sessionToken) await servicoAutenticacao.logout(_sessionToken);
    res.send();
  } catch (err) {
    next(err);
  }
}

async function logoutAll(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  // this function will receive the token, invalidate, and redirect
  try {
    const _sessionToken = req._sessionToken;
    // TODO: Limpar todos os cookies
    res.clearCookie(COOKIE_SESSION_TOKEN);
    if (_sessionToken) await servicoAutenticacao.logoutAll(_sessionToken);
    res.send();
  } catch (err) {
    next(err);
  }
}

authRouter
  .get("/sessao", loadCookies, requireSession, noBody, sessao)
  .post("/login", requireBody, login)
  .post("/logout", loadCookies, logout)
  .post("/logout-all", loadCookies, logoutAll);

export default authRouter;
