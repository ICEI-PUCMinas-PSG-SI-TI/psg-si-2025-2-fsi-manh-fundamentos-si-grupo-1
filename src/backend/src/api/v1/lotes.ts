import { LoteConsultaSchema, LoteService } from "../../services/servicoLotes";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { ClientError } from "../../error";
import { ParamsIdSchema } from "./objects";
import { InsertLoteSchemaZ } from "../../db/schema/lotes";

const apiV1LotesRouter = Router();

const lotes = new LoteService();

// GET / { queryParams: SelectLoteSchema }
// POST / { body: InsertLoteSchema }
// GET /:id
// PUT /:id { body: UpdateLoteSchema }
// PATCH /:id { body: UpdateLoteSchema }
// DELETE /:id

async function getLotes(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.query) {
      const parsedQueryParams = LoteConsultaSchema.parse(req.query);
      const consulta = await lotes.selecionarConsulta(parsedQueryParams);
      res.send(consulta);
    } else {
      const consulta = await lotes.selecionarTodos();
      res.send(consulta);
    }
  } catch (err) {
    next(err);
  }
}

async function postLote(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.body)
      throw new ClientError("Não há informações para serem inseridas!");
    const parsedBody = InsertLoteSchemaZ.parse(req.body);
    await lotes.inserir(parsedBody);
    res.send();
  } catch (err) {
    next(err);
  }
}

async function getLoteId(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ParamsIdSchema.parse(req.params);
    const consulta = await lotes.selecionarPorId(params.id);
    if (consulta.length === 0) throw new ClientError("", 404);
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

async function excluirLoteId(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ParamsIdSchema.parse(req.params);
    const consulta = await lotes.excluirPorId(params.id);
    if (consulta === 0) throw new ClientError("", 404);
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

function notImplemented(req: Request, res: Response, next: NextFunction) {
  try {
    throw new Error("Not implemented");
  } catch (err) {
    next(err);
  }
}

apiV1LotesRouter
  .get("/", getLotes)
  .post("/", postLote)
  .get("/:id", getLoteId)
  // TODO: Implementar PUT e PATCH para o endpoint de lotes.
  .put("/:id", notImplemented)
  .patch("/:id", notImplemented)
  .delete("/:id", excluirLoteId);

export default apiV1LotesRouter;
