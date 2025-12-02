import type { ExtendedRequest } from "../../middlewares";
import servicoTransacoes, {
  ConsultaMovimentacoesParamsZ,
  SetMovimentacaoDtoZ,
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
      res.json(consulta);
    } else {
      const parsedQueryParams = ConsultaMovimentacoesParamsZ.parse(req.query);
      const consulta =
        await servicoTransacoes.selecionarConsulta(parsedQueryParams);
      res.json(consulta);
    }
  } catch (err) {
    next(err);
  }
}

// TODO: verificar permissões
apiV1TransacoesRouter.get("/", getTransacoes);

async function criarTransacao(
  req:ExtendedRequest,
  res:Response,
  next: NextFunction,
): Promise<void>{
  try{
    const dados = SetMovimentacaoDtoZ.parse({
      loteId: req.body.loteId,
      quantidade: req.body.quantidade,
      motivo: req.body.motivo,
      produtoId:req.body.produtoId,
      localOrigem: req.body.localOrigem ?? null,
      localDestino: req.body.localDestino ?? null,
      observacao: req.body.observacao ?? null,
      usuarioId: req._usuario!.id, // agora funciona
      horario: new Date().toISOString(),
    });

    const id = await servicoTransacoes.inserir(dados);
    res.status(201).json({id});
  }catch(err){
    next(err);
  }
}
apiV1TransacoesRouter.post("/",criarTransacao);

export default apiV1TransacoesRouter;
