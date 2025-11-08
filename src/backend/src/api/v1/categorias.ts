import { Router, type NextFunction, type Response } from "express";
import { ParamsIdSchemaZ } from "./objects";
import servicoCategorias from "../../services/servicoCategorias";
import { InsertCategoriaSchemaZ } from "../../db/schema/categorias";
import type { ExtendedRequest } from "../../middlewares";
import { mdwRequerBody } from "../../middlewares";

const apiV1CategoriasRouter = Router();

async function getCategorias(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const categorias = await servicoCategorias.selecionarTodos();
    res.send(categorias);
  } catch (err) {
    next(err);
  }
}

async function postCategoria(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const categoria = InsertCategoriaSchemaZ.parse(req.body);
    const id = await servicoCategorias.inserir(categoria);
    res.send(id);
  } catch (err) {
    next(err);
  }
}

async function getCategoria(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    // TODO: if length === 0 return 404
    const categoria = await servicoCategorias.selecionarPorId(params.id);
    res.send(categoria);
  } catch (err) {
    next(err);
  }
}

async function deleteCategorias(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    // TODO: Verificar se uuid existe
    const params = ParamsIdSchemaZ.parse(req.params);
    await servicoCategorias.excluirPorId(params.id);
    res.send();
  } catch (err) {
    next(err);
  }
}

apiV1CategoriasRouter
  .get("/", getCategorias)
  .post("/", mdwRequerBody, postCategoria)
  .get("/:id", getCategoria)
  .delete("/:id", deleteCategorias);

export default apiV1CategoriasRouter;
