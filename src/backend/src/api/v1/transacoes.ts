import { Router, type NextFunction, type Response } from "express";
import type { ExtendedRequest } from "../../middlewares";
import servicoTransacoes, {
  ParamsConsultaTransacoesZ,
} from "../../services/servicoTransacoes";

const apiV1TransacoesRouter = Router();

async function getTransacoes(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (Object.keys(req.query).length === 0) {
      const consulta = await servicoTransacoes.selecionarTodos();
      res.send(consulta);
    } else {
      const parsedQueryParams = ParamsConsultaTransacoesZ.parse(req.query);
      const consulta =
        await servicoTransacoes.selecionarConsulta(parsedQueryParams);
      res.send(consulta);
    }
  } catch (err) {
    next(err);
  }
}

apiV1TransacoesRouter.get("/", getTransacoes);

export default apiV1TransacoesRouter;
