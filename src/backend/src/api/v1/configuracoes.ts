import type { ExtendedRequest } from "../../middlewares";
import { UpdateConfiguracaoSchemaZ } from "../../db/schema/configuracoes";
import { mdwRequerBody } from "../../middlewares";
import servicoConfiguracoes from "../../services/servicoConfiguracoes";
import { Router, type NextFunction, type Response } from "express";
import z4 from "zod/v4";
import { Identificador } from "../../db/enums/identificador";
import servicoProdutos from "../../services/servicoProdutos";

const apiV1ConfiguracoesRouter = Router();

async function getConfiguracoes(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const config = await servicoConfiguracoes.selecionar();
    res.send(config);
  } catch (err) {
    next(err);
  }
}

async function patchConfiguracoes(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedBody = UpdateConfiguracaoSchemaZ.parse(req.body);
    await servicoConfiguracoes.atualizar(parsedBody);
    res.send();
  } catch (err) {
    next(err);
  }
}

async function alterarIdentificador(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedBody = z4
      .object({
        identificador: z4.enum(Identificador),
      })
      .parse(req.body);
    await servicoProdutos.alterarFormatoCodigo(parsedBody.identificador);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

apiV1ConfiguracoesRouter
  .get("/", getConfiguracoes)
  .put("/", patchConfiguracoes)
  .patch("/codigo", alterarIdentificador)
  .patch("/", mdwRequerBody, patchConfiguracoes);

export default apiV1ConfiguracoesRouter;
