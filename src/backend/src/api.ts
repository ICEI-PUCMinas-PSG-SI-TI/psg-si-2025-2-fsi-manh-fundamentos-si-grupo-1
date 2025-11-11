import { Router } from "express";
import apiV1Router from "./api/v1";
import { mdwAutenticacao } from "./middlewares";

const apiRouter = Router();

// {host}/api/v1/
// TODO: Verificar se usuário tem permissões para acessar toda a API
apiRouter.use("/v1", mdwAutenticacao, apiV1Router);

export default apiRouter;
