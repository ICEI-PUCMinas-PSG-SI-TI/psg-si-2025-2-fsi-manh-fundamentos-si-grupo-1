import type { ExtendedRequest } from "../../middlewares";
import { Router, type NextFunction, type Response } from "express";
import { ParamsIdSchemaZ } from "./objects";
import servicoUnidadesMedida from "../../services/servicoUnidadesMedida";
import { InsertUnidadesMedidasSchemaZ } from "../../db/schema/unidadesMedida";
import { mdwRequerBody } from "../../middlewares";

const apiV1UnidadesMedida = Router();

async function getUnidadesMedida(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
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
) {
  try {
    const unidadeMedida = InsertUnidadesMedidasSchemaZ.parse(req.body);
    await servicoUnidadesMedida.inserir(unidadeMedida);
    res.send();
  } catch (err) {
    next(err);
  }
}

async function getUnidadeMedida(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    // TODO: if length === 0 return 404
    const unidadeMedida = await servicoUnidadesMedida.selecionarPorId(
      params.id,
    );
    res.send(unidadeMedida);
  } catch (err) {
    next(err);
  }
}

async function deleteUnidadeMedida(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    // TODO: Verificar se uuid existe
    const params = ParamsIdSchemaZ.parse(req.params);
    await servicoUnidadesMedida.excluirPorId(params.id);
    res.send();
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
