import { InsertCategoriaSchemaZ } from "../../db/schema/categorias";
import type { ExtendedRequest } from "../../middlewares";
import { mdwRequerBody } from "../../middlewares";
import servicoCategorias from "../../services/servicoCategorias";
import { ParamsIdSchemaZ } from "./objects";
import { type NextFunction, type Response, Router } from "express";

const apiV1CategoriasRouter = Router();

async function getCategorias(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
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
): Promise<void> {
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
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const categoria = await servicoCategorias.selecionarPorId(params.id);
    if (categoria) {
      res.send(categoria);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
}

async function deleteCategorias(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const ok = await servicoCategorias.excluirPorId(params.id);
    if (ok) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
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
