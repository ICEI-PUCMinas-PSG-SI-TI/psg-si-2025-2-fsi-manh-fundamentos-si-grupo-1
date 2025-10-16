import { parse, parse as parseUUID, v4 as uuid } from "uuid";
import { loteConsultaSchema, LoteService } from "../../services/ServicoLotes";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";

const api_v1_lotes_router = Router();

let lotes = new LoteService();

function getLotes(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body) {
      const parsedBody = loteConsultaSchema.parse(req.body);
      lotes
        .selecionarConsulta(parsedBody)
        .then((result) => res.send(result))
        .catch((err) => next(err));
    } else {
      lotes
        .selecionarTodos()
        .then((result) => res.send(result))
        .catch((err) => next(err));
    }
  } catch (err) {
    next(err);
  }
}

function postLote(_: Request, res: Response, next: NextFunction) {
  try {
    lotes
      .inserir({
        produto_id: parseUUID(uuid()),
        lote: "SR221115",
        quantidade: 100,
        validade: new Date(2026, 0, 1, 15, 0, 0, 0),
      })
      .then(() => res.send());
  } catch (err) {
    next(err);
  }
}

function getLoteId(
  req: Request<{ id?: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { id } = req.params;
    if (typeof id === "string") {
      lotes.selecionarPorId(parse(id)).then((result) => {
        if (result.length === 0) res.status(404).send();
        else res.send(result);
      });
    }
  } catch (err) {
    next(err);
  }
}

api_v1_lotes_router.get("/", getLotes);
api_v1_lotes_router.post("/", postLote);
api_v1_lotes_router.get("/:id", getLoteId);
// api_v1_lotes_router.put("/:id", atualizar);
// api_v1_lotes_router.patch("/:id", atualizar);
// api_v1_lotes_router.delete("/:id", excluir);

export default api_v1_lotes_router;
