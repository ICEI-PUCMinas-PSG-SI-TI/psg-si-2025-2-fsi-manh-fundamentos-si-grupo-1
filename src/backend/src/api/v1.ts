import { Router } from "express";
import apiV1UsersRouter from "./v1/usuarios";

const apiV1Router = Router();

// {host}/api/v1/usuarios
apiV1Router.use("/usuarios", apiV1UsersRouter);

export default apiV1Router;
