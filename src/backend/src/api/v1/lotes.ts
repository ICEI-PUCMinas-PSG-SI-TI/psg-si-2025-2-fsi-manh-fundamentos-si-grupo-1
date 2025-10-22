import { LoteConsultaSchema, LoteService } from "../../services/ServicoLotes";
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

function substituirLoteId(req: Request, res: Response, next: NextFunction) {
  res.status(405).send("Not supported, use PATCH.");
  // const params = ParamsIdSchema.parse(req.params);
  // if (!req.body)
  //   throw new ClientError("Não há informações para serem inseridas!");
  next();
}

function atualizarLoteId(req: Request, res: Response, next: NextFunction) {
  try {
    // const params = ParamsIdSchema.parse(req.params);
    // if (!req.body)
    //   throw new ClientError("Não há informações para serem inseridas!");
    // TODO: Atualizar informaçoes do lote
    throw new Error("Not implemented");
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

apiV1LotesRouter.get("/", getLotes);
apiV1LotesRouter.post("/", postLote);
apiV1LotesRouter.get("/:id", getLoteId);
apiV1LotesRouter.put("/:id", substituirLoteId);
apiV1LotesRouter.patch("/:id", atualizarLoteId);
apiV1LotesRouter.delete("/:id", excluirLoteId);

export default apiV1LotesRouter;
