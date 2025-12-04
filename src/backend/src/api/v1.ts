import { Router } from "express";
import { Permissoes } from "../db/enums/permissoes";
import { mdwPermissoes } from "../middlewares";
import apiV1Admin from "./v1/admin";
import apiV1Categorias from "./v1/categorias";
import apiV1Configuracoes from "./v1/configuracoes";
import apiV1Dev from "./v1/dev";
import apiV1Lotes from "./v1/lotes";
import apiV1Permissoes from "./v1/permissoes";
import apiV1Produtos from "./v1/produtos";
import apiV1Transacoes from "./v1/transacoes";
import apiV1UnidadesMedida from "./v1/unidadesMedida";
import apiV1Usuarios from "./v1/usuarios";

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

// {host}/papi/v1/produtos
apiV1Router.use("/produtos", apiV1Produtos);

// {host}/api/v1/admin
// TODO: Verificar se usuário tem permissões de alterar permissões
apiV1Router.use(
  "/permissoes",
  mdwPermissoes(Permissoes.Administrador, Permissoes.Desenvolvedor),
  apiV1Permissoes,
);

// {host}/api/v1/admin
apiV1Router.use(
  "/admin",
  mdwPermissoes(Permissoes.Administrador, Permissoes.Desenvolvedor),
  apiV1Admin,
);

apiV1Router.use("/dev", mdwPermissoes(Permissoes.Desenvolvedor), apiV1Dev);

export default apiV1Router;
