import type { ExtendedRequest } from "../../middlewares";
import { LoteConsultaSchema, ServicoLotes } from "../../services/servicoLotes";
import { Router, type NextFunction, type Response } from "express";
import { ParamsIdSchemaZ } from "./objects";
import { InsertLoteSchemaZ } from "../../db/schema/lotes";
import { mdwRequerBody } from "../../middlewares";

const apiV1LotesRouter = Router();

const lotes = new ServicoLotes();

// GET / { queryParams: SelectLoteSchema }
// POST / { body: InsertLoteSchema }
// GET /:id
// PUT /:id { body: UpdateLoteSchema }
// PATCH /:id { body: UpdateLoteSchema }
// DELETE /:id

async function getLotes(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (Object.keys(req.query).length === 0) {
      const consulta = await lotes.selecionarTodos();
      res.send(consulta);
    } else {
      const parsedQueryParams = LoteConsultaSchema.parse(req.query);
      const consulta = await lotes.selecionarConsulta(parsedQueryParams);
      res.send(consulta);
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
    const parsedBody = InsertLoteSchemaZ.parse(req.body);
    const id = await lotes.inserir(parsedBody);
    res.send(id);
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
    const consulta = await lotes.selecionarPorId(params.id);
    if (consulta) {
      res.send(consulta);
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
    const atualizado = await lotes.excluirPorId(params.id);
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
