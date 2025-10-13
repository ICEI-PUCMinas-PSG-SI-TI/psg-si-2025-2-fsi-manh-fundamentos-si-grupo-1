import { parse, parse as parseUUID, v4 as uuid } from "uuid";
import { LoteService } from "../../services/lotes";
import { Router, type Request, type Response } from "express";

const api_v1_lotes_router = Router();

let lotes = new LoteService();

function encontrarVarios(_: Request, res: Response) {
  lotes.selecionarTodos().then((result) => res.send(result));
}

function criar(_: Request, res: Response) {
  lotes
    .inserir({
      produto_id: parseUUID(uuid()),
      lote: "SR221115",
      quantidade: 100,
      validade: new Date(2026, 0, 1, 15, 0, 0, 0),
    })
    .then((result) => res.send(result.toJSON()));
}

function encontrarUnico(req: Request<{ id?: string }>, res: Response) {
  const id = req.params.id;
  if (typeof id === "string") {
    lotes.selecionarId(parse(id)).then((result) => {
      if (result.length === 0) res.status(404).send();
      else res.send(result);
    });
  }
}

api_v1_lotes_router.get("/", encontrarVarios);
api_v1_lotes_router.post("/", criar);
api_v1_lotes_router.get("/:id", encontrarUnico);
// api_v1_lotes_router.get("/:id", atualizar);
// api_v1_lotes_router.get("/:id", excluir);

export default api_v1_lotes_router;
