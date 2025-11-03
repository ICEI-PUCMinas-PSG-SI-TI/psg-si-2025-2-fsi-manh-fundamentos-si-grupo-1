import { Router } from "express";
import apiV1AdminUsuarios from "./admin/usuarios";
import { parseSessionUser, requireRoot } from "../../cookies";
import apiV1Faker from "./admin/faker";

const apiV1AdminRouter = Router();

apiV1AdminRouter.use(parseSessionUser, requireRoot);

// {host}/api/v1/faker
apiV1AdminRouter.use("/faker", apiV1Faker);

// {host}/api/v1/admin/usuarios
apiV1AdminRouter.use("/usuarios", apiV1AdminUsuarios);

export default apiV1AdminRouter;
