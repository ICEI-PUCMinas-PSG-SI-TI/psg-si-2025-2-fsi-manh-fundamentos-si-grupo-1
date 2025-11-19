import { InsertUnidadesMedidasSchemaZ } from "../../db/schema/unidadesMedida";
import type { ExtendedRequest } from "../../middlewares";
import { mdwRequerBody } from "../../middlewares";
import servicoUnidadesMedida from "../../services/servicoUnidadesMedida";
import { ParamsIdSchemaZ } from "./objects";
import { type NextFunction, type Response, Router } from "express";

const apiV1UnidadesMedida = Router();

async function getUnidadesMedida(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const unidadesMedida = await servicoUnidadesMedida.selecionarTodos();
    res.send(unidadesMedida);
  } catch (err) {
    next(err);
  }
}

async function postUnidadeMedida(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const unidadeMedida = InsertUnidadesMedidasSchemaZ.parse(req.body);
    const insercao = await servicoUnidadesMedida.inserir(unidadeMedida);
    if (insercao) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (err) {
    next(err);
  }
}

async function getUnidadeMedida(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    // TODO: if length === 0 return 404
    const unidadeMedida = await servicoUnidadesMedida.selecionarPorId(
      params.id,
    );
    if (unidadeMedida) {
      res.send(unidadeMedida);
    } else {
      res.send(500);
    }
  } catch (err) {
    next(err);
  }
}

async function deleteUnidadeMedida(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // TODO: Verificar se uuid existe
    const params = ParamsIdSchemaZ.parse(req.params);
    const atualizado = await servicoUnidadesMedida.excluirPorId(params.id);
    if (atualizado) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
}

apiV1UnidadesMedida
  .get("/", getUnidadesMedida)
  .post("/", mdwRequerBody, postUnidadeMedida)
  .get("/:id", getUnidadeMedida)
  .delete("/:id", deleteUnidadeMedida);

export default apiV1UnidadesMedida;
