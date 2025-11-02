import { Router } from "express";
import apiV1AdminUsuarios from "./admin/usuarios";
import { parseSessionUser, requireRoot } from "../../cookies";

const apiV1AdminRouter = Router();

// {host}/api/v1/admin/usuarios
apiV1AdminRouter.use(
  "/usuarios",
  parseSessionUser,
  requireRoot,
  apiV1AdminUsuarios,
);

export default apiV1AdminRouter;
