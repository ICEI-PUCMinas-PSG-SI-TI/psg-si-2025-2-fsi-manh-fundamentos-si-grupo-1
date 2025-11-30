import type { ExtendedRequest } from "../../middlewares";
import servicoTransacoes, {
  ConsultaMovimentacoesParamsZ,
} from "../../services/servicoTransacoes";
import { type NextFunction, type Response, Router } from "express";

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
      const parsedQueryParams = ConsultaMovimentacoesParamsZ.parse(req.query);
      const consulta =
        await servicoTransacoes.selecionarConsulta(parsedQueryParams);
      res.send(consulta);
    }
  } catch (err) {
    next(err);
  }
}

// TODO: Criar post de transações, verificar permissões
apiV1TransacoesRouter.get("/", getTransacoes);

export default apiV1TransacoesRouter;
