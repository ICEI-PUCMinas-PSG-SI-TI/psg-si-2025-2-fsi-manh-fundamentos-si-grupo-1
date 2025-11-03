import { Router } from "express";
import apiV1Usuarios from "./v1/usuarios";
import apiV1Lotes from "./v1/lotes";
import apiV1Configuracoes from "./v1/configuracoes";
import apiV1Categorias from "./v1/categorias";
import apiV1UnidadesMedida from "./v1/unidadesMedida";
import apiV1Admin from "./v1/admin";
import apiV1Transacoes from "./v1/transacoes";
import apiV1Produtos from "./v1/produtos";

const apiV1Router = Router();

// {host}/api/v1/usuarios
apiV1Router.use("/usuarios", apiV1Usuarios);

// {host}/api/v1/lotes
apiV1Router.use("/lotes", apiV1Lotes);

// {host}/api/v1/configuracoes
apiV1Router.use("/configuracoes", apiV1Configuracoes);

// {host}/api/v1/categorias
apiV1Router.use("/categorias", apiV1Categorias);

// {host}/api/v1/unidades -> unidadesMedida
apiV1Router.use("/unidades", apiV1UnidadesMedida);

// {host}/api/v1/admin
apiV1Router.use("/transacoes", apiV1Transacoes);

// {host}/api/v1/produtos
apiV1Router.use("/produtos", apiV1Produtos);

// {host}/api/v1/admin
apiV1Router.use("/admin", apiV1Admin);

export default apiV1Router;
