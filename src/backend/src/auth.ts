import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { ClientError } from "./error";
import {
  AutenticacaoServico,
  CredenciaisSchemaZ,
} from "./services/servicoAutenticacao";
import { error } from "./logging";

const authRouter = Router();

const COOKIE_SESSION_TOKEN = "session_token";

const servicoAutenticacao = new AutenticacaoServico();

// A aplicação ira suportar criação de novos logins apenas por administradores
// POST /auth/login
// POST /auth/logout

async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedCredenciais = CredenciaisSchemaZ.parse(req.body);
    // if login invalid, this function will return a error
    // else, it will return the token
    const userAgent = req.headers["user-agent"] || "";
    const reqIp = req.ip || "";
    const token = await servicoAutenticacao.login(
      parsedCredenciais,
      userAgent,
      reqIp,
    );
    if (token != null) {
      res.cookie(COOKIE_SESSION_TOKEN, token, {
        httpOnly: true,
        // TODO: Use when http available or create a DEVELOPMENT env var
        // secure: true,
        // maxAge: 24hours
        maxAge: 86400000,
        path: "/",
        sameSite: "lax",
      });
      res.redirect("/");
    } else {
      error("Não foi possível gerar o token.", { label: "Auth" });
      throw new ClientError("Unauthorized", 401);
    }
  } catch (err) {
    next(err);
  }
}

async function logout(req: Request, res: Response, next: NextFunction) {
  // this function will receive the token, invalidate, and redirect
  try {
    const cookies = req.cookies;
    if (typeof cookies.session_token === "string") {
      await servicoAutenticacao.logout(cookies.session_token);
      // limpar cookies
      res.clearCookie(COOKIE_SESSION_TOKEN);
    }
    // redirecionar
    res.redirect("/login");
  } catch (err) {
    next(err);
  }
}

async function validate(req: Request, res: Response, next: NextFunction) {
  try {
    const cookies = req.cookies;
    if (typeof cookies.session_token !== "string")
      throw new ClientError("Não autenticado!", 400);
    const sessaoAtiva = await servicoAutenticacao.consultarSessaoPorToken(
      cookies.session_token,
    );
    if (!sessaoAtiva) throw new ClientError("Não autenticado!", 400);
    res.send("Autenticado");
  } catch (err) {
    next(err);
  }
}

authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/validate", validate);

export default authRouter;
