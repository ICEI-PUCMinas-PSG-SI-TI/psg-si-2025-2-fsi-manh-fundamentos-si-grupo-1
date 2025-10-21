import { Router } from "express";
import apiV1Usuarios from "./v1/usuarios";
import apiV1Lotes from "./v1/lotes";

const apiV1Router = Router();

// {host}/api/v1/usuarios
apiV1Router.use("/usuarios", apiV1Usuarios);

// {host}/api/v1/lotes
apiV1Router.use("/lotes", apiV1Lotes);

export default apiV1Router;
