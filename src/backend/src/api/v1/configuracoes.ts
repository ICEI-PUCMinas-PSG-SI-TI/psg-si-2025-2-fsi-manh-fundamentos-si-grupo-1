import { type NextFunction, type Response, Router } from "express";
import z4 from "zod/v4";
import { Identificador } from "../../db/enums/identificador";
import { error } from "../../logging";
import type { ExtendedRequest } from "../../middlewares";
import { mdwRequerBody } from "../../middlewares";
import servicoConfiguracoes, {
  UpdateConfiguracaoDtoZ,
} from "../../services/servicoConfiguracoes";
import servicoProdutos from "../../services/servicoProdutos";

const apiV1ConfiguracoesRouter = Router();

async function getConfiguracoes(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const config = await servicoConfiguracoes.selecionar();
    if (config) {
      res.json(config);
    } else {
      error("Nenhum valor encontrado.", { label: "endConfig" });
      res.sendStatus(500);
    }
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
    const parsedBody = UpdateConfiguracaoDtoZ.parse(req.body);
    const atualizado = await servicoConfiguracoes.atualizar(parsedBody);
    if (atualizado) {
      res.sendStatus(200);
    } else {
      error("Atualização não realizada.", { label: "endConfig" });
      res.sendStatus(500);
    }
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
    // TODO: Retornar alguma coisa indicando erro/sucesso
    await servicoProdutos.alterarFormatoCodigo(parsedBody.identificador);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

apiV1ConfiguracoesRouter
  .get("/", getConfiguracoes)
  .patch("/codigo", mdwRequerBody, alterarIdentificador)
  .patch("/", mdwRequerBody, patchConfiguracoes);

export default apiV1ConfiguracoesRouter;
