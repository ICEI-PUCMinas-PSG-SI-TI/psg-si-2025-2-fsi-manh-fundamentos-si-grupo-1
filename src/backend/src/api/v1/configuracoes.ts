import servicoConfiguracoes from "../../services/ServicoConfiguracoes";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";

const apiV1ConfiguracoesRouter = Router();

async function getConfiguracoes(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const config = await servicoConfiguracoes.selecionar();
    res.send(config);
  } catch (err) {
    next(err);
  }
}

function notImplemented(req: Request, res: Response, next: NextFunction) {
  try {
    throw new Error("Not implemented");
  } catch (err) {
    next(err);
  }
}

apiV1ConfiguracoesRouter
  .get("/", getConfiguracoes)
  .put("/", notImplemented)
  .patch("/", notImplemented);

export default apiV1ConfiguracoesRouter;
