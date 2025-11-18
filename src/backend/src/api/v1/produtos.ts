import { Router, type NextFunction, type Response } from "express";
import type { ExtendedRequest } from "../../middlewares";
import servicoProdutos, {
  ParamsConsultaProdutosZ,
} from "../../services/servicoProdutos";
import { ParamsIdSchemaZ } from "./objects";
import { ClientError } from "../../error";

const apiV1ProdutosRouter = Router();

async function getProdutos(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (Object.keys(req.query).length === 0) {
      const consulta = await servicoProdutos.selecionarTodos();
      res.send(consulta);
    } else {
      const parsedBody = ParamsConsultaProdutosZ.parse(req.query);
      const consulta = await servicoProdutos.selecionarConsulta(parsedBody);
      res.send(consulta);
    }
  } catch (err) {
    next(err);
  }
}

async function getProdutoId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
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
