import { type NextFunction, type Response, Router } from "express";
import type { ExtendedRequest } from "../../middlewares";
import servicoAlertas, {
  ParamsConsultaAlertasZ,
} from "../../services/servicoAlertas";
import { ParamsIdSchemaZ } from "./objects";

const apiV1AlertasRouter = Router();

async function getAlertas(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (Object.keys(req.query).length === 0) {
      const alertas = await servicoAlertas.listarTodos();
      res.json(alertas);
    } else {
      const parsedQueryParams = ParamsConsultaAlertasZ.parse(req.query);
      const alertas = await servicoAlertas.consultar(parsedQueryParams);
      res.json(alertas);
    }
  } catch (err) {
    next(err);
  }
}

async function getQuantidadeAlertasAtivos(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const quantidade = await servicoAlertas.contarNaoMutados();
    res.json({
      quantidade,
    });
  } catch (err) {
    next(err);
  }
}

async function patchSilenciarAlerta(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const ok = await servicoAlertas.ignorarAlerta(params.id);
    if (ok) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
}

async function postVerificar(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const consulta = await servicoAlertas.conferirTodos();
    res.json(consulta);
  } catch (err) {
    next(err);
  }
}

apiV1AlertasRouter
  .get("/", getAlertas)
  .get("/quantidade-nao-mutado", getQuantidadeAlertasAtivos)
  .patch("/silenciar/:id", patchSilenciarAlerta)
  .post("/verificar", postVerificar);

export default apiV1AlertasRouter;
