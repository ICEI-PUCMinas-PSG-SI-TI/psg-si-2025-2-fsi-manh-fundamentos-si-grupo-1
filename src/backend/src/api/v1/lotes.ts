import { loteConsultaSchema, LoteService } from "../../services/ServicoLotes";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { ClientError } from "../../error";
import z from "zod";
import { InsertLoteSchemaZ } from "../../db/schema";

const api_v1_lotes_router = Router();

const lotes = new LoteService();

async function getLotes(req: Request, res: Response, next: NextFunction) {
  try {
    // TODO: Utilizar parametros
    if (req.body) {
      const parsedBody = loteConsultaSchema.parse(req.body);
      const consulta = await lotes.selecionarConsulta(parsedBody);
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

const GetLoteIdParamsSchema = z.object({
  id: z.uuid(),
});

async function getLoteId(req: Request, res: Response, next: NextFunction) {
  try {
    const params = GetLoteIdParamsSchema.parse(req.params);
    const consulta = await lotes.selecionarPorId(params.id);
    if (consulta.length === 0) throw new ClientError("", 404);
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

async function substituirLoteId(_: Request, res: Response, next: NextFunction) {
  res.status(405).send("Not supported, use PATCH.");
  next();
}

async function atualizarLoteId(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // TODO: Atualizar informaçoes do lote
    throw new Error("Not implemented");
  } catch (err) {
    next(err);
  }
}

async function excluirLoteId(req: Request, res: Response, next: NextFunction) {
  try {
    const params = GetLoteIdParamsSchema.parse(req.params);
    const consulta = await lotes.excluirPorId(params.id);
    if (consulta === 0) throw new ClientError("", 404);
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

api_v1_lotes_router.get("/", getLotes);
api_v1_lotes_router.post("/", postLote);
api_v1_lotes_router.get("/:id", getLoteId);
api_v1_lotes_router.put("/:id", substituirLoteId);
api_v1_lotes_router.patch("/:id", atualizarLoteId);
api_v1_lotes_router.delete("/:id", excluirLoteId);

export default api_v1_lotes_router;
