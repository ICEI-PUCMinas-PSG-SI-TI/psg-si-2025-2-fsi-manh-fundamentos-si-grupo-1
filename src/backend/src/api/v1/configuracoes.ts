import type { SessionRequest } from "../../cookies";
import { UpdateConfiguracaoSchemaZ } from "../../db/schema/configuracoes";
import { requireBody } from "../../middlewares";
import servicoConfiguracoes from "../../services/servicoConfiguracoes";
import { Router, type NextFunction, type Response } from "express";

const apiV1ConfiguracoesRouter = Router();

async function getConfiguracoes(
  req: SessionRequest,
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

async function patchConfiguracoes(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = UpdateConfiguracaoSchemaZ.parse(req.body);
    await servicoConfiguracoes.atualizar(parsedBody);
    res.send();
  } catch (err) {
    next(err);
  }
}

apiV1ConfiguracoesRouter
  .get("/", getConfiguracoes)
  .put("/", patchConfiguracoes)
  .patch("/", requireBody, patchConfiguracoes);

export default apiV1ConfiguracoesRouter;
