import {
  Router,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import apiV1Router from "./api/v1";
import { debug } from "./logging";

const apiRouter = Router();

// TODO: middleware de autenticacao e permissoes
apiRouter.use("/", (req: Request, res: Response, next: NextFunction) => {
  debug("api.usuarioEstaAutenticado");
  const usuarioEstaAutenticado = true;
  if (usuarioEstaAutenticado) {
    // Redireciona para o próximo middleware
    next();
  } else {
    // Responde diretamente a conexão
    res.status(401).send("O usuário não esta autenticado!");
  }
});

apiRouter.use("/", (req: Request, res: Response, next: NextFunction) => {
  debug("api.usuarioTemPermissoes");
  const usuarioTemPermissoes = true;
  if (usuarioTemPermissoes) {
    next();
  } else {
    res.status(401).send("O usuário não tem permissões!");
  }
});

// {host}/api/v1/
apiRouter.use("/v1", apiV1Router);

export default apiRouter;
