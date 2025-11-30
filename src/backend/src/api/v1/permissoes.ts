import { Permissoes } from "../../db/enums/permissoes";
import { type ExtendedRequest, mdwRequerBody } from "../../middlewares";
import servicoPermissoes from "../../services/servicoPermissoes";
import { ParamsIdSchemaZ } from "./objects";
import { type NextFunction, type Response, Router } from "express";
import * as z4 from "zod/v4";

const apiV1PermissoesRouter = Router();

async function verPermissoesId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const permissoes = await servicoPermissoes.selecionarPermissoes(params.id);
    res.json(permissoes);
  } catch (err) {
    next(err);
  }
}

const PermsPermissoesArrayZ = z4.array(z4.enum(Permissoes));

async function addPermissoesId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const parsedBody = PermsPermissoesArrayZ.parse(req.body);
    const ok = await servicoPermissoes.adicionarPermissoesUsuario(
      params.id,
      ...parsedBody,
    );
    if (ok) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
}
async function setPermissoesId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const parsedBody = PermsPermissoesArrayZ.parse(req.body);
    const ok = await servicoPermissoes.definirPermissoesUsuario(
      params.id,
      ...parsedBody,
    );
    if (ok) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
}
async function delPermissoesId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const parsedBody = PermsPermissoesArrayZ.parse(req.body);
    const ok = await servicoPermissoes.removerPermissoesUsuario(
      params.id,
      ...parsedBody,
    );
    if (ok) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
}

apiV1PermissoesRouter
  .get("/ver/:id", verPermissoesId)
  .post("/add/:id", mdwRequerBody, addPermissoesId)
  .patch("/set/:id", mdwRequerBody, setPermissoesId)
  .patch("/remove/:id", mdwRequerBody, delPermissoesId);

export default apiV1PermissoesRouter;
