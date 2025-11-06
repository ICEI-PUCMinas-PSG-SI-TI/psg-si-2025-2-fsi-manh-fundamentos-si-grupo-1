import type { SessionRequest } from "../../cookies";
import { LoteConsultaSchema, ServicoLotes } from "../../services/servicoLotes";
import { Router, type NextFunction, type Response } from "express";
import { ClientError } from "../../error";
import { ParamsIdSchemaZ } from "./objects";
import { InsertLoteSchemaZ } from "../../db/schema/lotes";
import { requireBody } from "../../middlewares";

const apiV1LotesRouter = Router();

const lotes = new ServicoLotes();

// GET / { queryParams: SelectLoteSchema }
// POST / { body: InsertLoteSchema }
// GET /:id
// PUT /:id { body: UpdateLoteSchema }
// PATCH /:id { body: UpdateLoteSchema }
// DELETE /:id

async function getLotes(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
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
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = InsertLoteSchemaZ.parse(req.body);
    const id = await lotes.inserir(parsedBody);
    res.send(id);
  } catch (err) {
    next(err);
  }
}

async function getLoteId(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const consulta = await lotes.selecionarPorId(params.id);
    if (!consulta) throw new ClientError("", 404);
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

async function excluirLoteId(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const consulta = await lotes.excluirPorId(params.id);
    if (consulta === 0) throw new ClientError("", 404);
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

function notImplemented(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    throw new Error("Not implemented");
  } catch (err) {
    next(err);
  }
}

apiV1LotesRouter
  .get("/", getLotes)
  .post("/", requireBody, postLote)
  .get("/:id", getLoteId)
  // TODO: Implementar PUT e PATCH para o endpoint de lotes.
  .put("/:id", notImplemented)
  .patch("/:id", notImplemented)
  .delete("/:id", excluirLoteId);

export default apiV1LotesRouter;
