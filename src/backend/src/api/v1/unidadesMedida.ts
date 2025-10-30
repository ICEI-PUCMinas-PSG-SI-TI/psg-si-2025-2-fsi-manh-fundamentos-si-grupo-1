import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { ParamsIdSchemaZ } from "./objects";
import servicoUnidadesMedida from "../../services/servicoUnidadesMedida";
import { InsertUnidadesMedidasSchemaZ } from "../../db/schema/unidadesMedida";
import { ClientError } from "../../error";

const apiV1UnidadesMedida = Router();

async function getUnidadesMedida(
  req: Request,
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
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.body) throw new ClientError("Bad Request");
    const unidadeMedida = InsertUnidadesMedidasSchemaZ.parse(req.body);
    await servicoUnidadesMedida.inserir(unidadeMedida);
    res.send();
  } catch (err) {
    next(err);
  }
}

async function getUnidadeMedida(
  req: Request,
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
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    // TODO: Verificar se uuid existe
    const params = ParamsIdSchemaZ.parse(req.params);
    await servicoUnidadesMedida.excluirPorId(params.id);
  } catch (err) {
    next(err);
  }
}

apiV1UnidadesMedida
  .get("/", getUnidadesMedida)
  .post("/", postUnidadeMedida)
  .get("/:id", getUnidadeMedida)
  .delete("/:id", deleteUnidadeMedida);

export default apiV1UnidadesMedida;
