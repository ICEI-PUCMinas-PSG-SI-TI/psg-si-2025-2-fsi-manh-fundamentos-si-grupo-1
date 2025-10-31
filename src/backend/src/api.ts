import { Router } from "express";
import apiV1Router from "./api/v1";
import { loadCookies, requireSession } from "./cookies";

const apiRouter = Router();

// {host}/api/v1/
// TODO: Verificar se usuário tem permissões para acessar toda a API
apiRouter.use("/v1", loadCookies, requireSession, apiV1Router);

export default apiRouter;
