import type { ExtendedRequest } from "../../middlewares";
import { mdwRequerBody } from "../../middlewares";
import servicoLotes, { SetLoteDtoZ } from "../../services/servicoLotes";
import { LoteConsultaSchema } from "../../services/servicoLotes";
import { ParamsIdSchemaZ } from "./objects";
import { type NextFunction, type Response, Router } from "express";

const apiV1LotesRouter = Router();

async function getLotes(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (Object.keys(req.query).length === 0) {
      const consulta = await servicoLotes.selecionarTodos();
      res.json(consulta);
    } else {
      const parsedQueryParams = LoteConsultaSchema.parse(req.query);
      const consulta = await servicoLotes.selecionarConsulta(parsedQueryParams);
      res.json(consulta);
    }
  } catch (err) {
    next(err);
  }
}

async function postLote(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedBody = SetLoteDtoZ.parse(req.body);
    const idRegistro = await servicoLotes.inserir(parsedBody);
    res.send(idRegistro);
  } catch (err) {
    next(err);
  }
}

async function getLoteId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const consulta = await servicoLotes.selecionarPorId(params.id);
    if (consulta) {
      res.json(consulta);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
}

async function excluirLoteId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const atualizado = await servicoLotes.excluirPorId(params.id);
    if (atualizado) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
}

function notImplemented(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): void {
  try {
    throw new Error("Not implemented");
  } catch (err) {
    next(err);
  }
}

apiV1LotesRouter
  .get("/", getLotes)
  .post("/", mdwRequerBody, postLote)
  .get("/:id", getLoteId)
  // TODO: Implementar PUT e PATCH para o endpoint de lotes.
  .put("/:id", notImplemented)
  .patch("/:id", notImplemented)
  .delete("/:id", excluirLoteId);

export default apiV1LotesRouter;
