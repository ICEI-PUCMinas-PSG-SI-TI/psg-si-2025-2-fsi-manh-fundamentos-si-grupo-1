import { Router, type NextFunction, type Response } from "express";
import type { SessionRequest } from "../../cookies";
import servicoProdutos from "../../services/servicoProdutos";
import { ParamsIdSchemaZ } from "./objects";
import { ClientError } from "../../error";

const apiV1ProdutosRouter = Router();

async function getProdutos(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const consulta = await servicoProdutos.selecionarTodos();
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

async function getProdutoId(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const consulta = await servicoProdutos.selecionarPorId(params.id);
    if (!consulta) throw new ClientError("Not Found", 404);
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

apiV1ProdutosRouter.get("/", getProdutos);
apiV1ProdutosRouter.get("/:id", getProdutoId);

export default apiV1ProdutosRouter;
