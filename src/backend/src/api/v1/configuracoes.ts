import { UpdateConfiguracaoSchemaZ } from "../../db/schema/configuracoes";
import { ClientError } from "../../error";
import servicoConfiguracoes from "../../services/servicoConfiguracoes";
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

async function patchConfiguracoes(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.body) throw new ClientError("Bad Request");
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
  .patch("/", patchConfiguracoes);

export default apiV1ConfiguracoesRouter;
