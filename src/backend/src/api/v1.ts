import { Router } from "express";
import apiV1Usuarios from "./v1/usuarios";
import apiV1Lotes from "./v1/lotes";
import apiV1Configuracoes from "./v1/configuracoes";
import apiV1Categorias from "./v1/categorias";

const apiV1Router = Router();

// {host}/api/v1/usuarios
apiV1Router.use("/usuarios", apiV1Usuarios);

// {host}/api/v1/lotes
apiV1Router.use("/lotes", apiV1Lotes);

// {host}/api/v1/configuracoes
apiV1Router.use("/configuracoes", apiV1Configuracoes);

// {host}/api/v1/categorias
apiV1Router.use("/categorias", apiV1Categorias);

export default apiV1Router;
