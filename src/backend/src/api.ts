import apiV1Router from "./api/v1";
import { mdwAutenticacao } from "./middlewares";
import { type Request, type Response, Router } from "express";

const apiRouter = Router();

// {host}/api/v1/
// TODO: Verificar se usuário tem permissões para acessar toda a API
apiRouter
  .use("/v1", mdwAutenticacao, apiV1Router)
  // Retornar 404 caso a rota não existe (necessário devido a rota inicial
  // redirecionar para index.html)
  .all(/(.*)/, (_: Request, res: Response) => res.sendStatus(404));

export default apiRouter;
