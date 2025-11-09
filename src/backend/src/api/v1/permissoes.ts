import { Router, type NextFunction, type Response } from "express";
import { mdwRequerBody, type ExtendedRequest } from "../../middlewares";
import z from "zod";
import { Permissoes } from "../../db/schema/permissoes";
import servicoPermissoes from "../../services/servicoPermissoes";
import { ParamsIdSchemaZ } from "./objects";

const apiV1PermissoesRouter = Router();

const ParamsPatchPermissoesZ = z.object({
  usuarioId: z.uuid(),
  permissoes: z.array(z.enum(Permissoes)),
});

export type ParamsPatchPermissoes = z.infer<typeof ParamsPatchPermissoesZ>;

async function addPermissoes(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = ParamsPatchPermissoesZ.parse(req.body);
    await servicoPermissoes.adicionarPermissoesUsuario(
      parsedBody.usuarioId,
      ...parsedBody.permissoes,
    );
    res.send();
  } catch (err) {
    next(err);
  }
}

async function delPermissoes(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = ParamsPatchPermissoesZ.parse(req.body);
    await servicoPermissoes.removerPermissoesUsuario(
      parsedBody.usuarioId,
      ...parsedBody.permissoes,
    );
    res.send();
  } catch (err) {
    next(err);
  }
}

async function verPermissoesId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const permissoes = await servicoPermissoes.selecionarPermissoes(params.id);
    res.send(permissoes);
  } catch (err) {
    next(err);
  }
}

const PermsPermissoesArrayZ = z.array(z.enum(Permissoes));

async function addPermissoesId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const parsedBody = PermsPermissoesArrayZ.parse(req.body);
    await servicoPermissoes.adicionarPermissoesUsuario(
      params.id,
      ...parsedBody,
    );
    res.send();
  } catch (err) {
    next(err);
  }
}
async function setPermissoesId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const parsedBody = PermsPermissoesArrayZ.parse(req.body);
    await servicoPermissoes.removerTodasPermissoes(params.id);
    await servicoPermissoes.adicionarPermissoesUsuario(
      params.id,
      ...parsedBody,
    );
    res.send();
  } catch (err) {
    next(err);
  }
}
async function delPermissoesId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const parsedBody = PermsPermissoesArrayZ.parse(req.body);
    await servicoPermissoes.removerPermissoesUsuario(params.id, ...parsedBody);
    res.send();
  } catch (err) {
    next(err);
  }
}

// Deprecated
apiV1PermissoesRouter
  .patch("/add", mdwRequerBody, addPermissoes)
  .patch("/remove", mdwRequerBody, delPermissoes);

apiV1PermissoesRouter
  .get("/ver/:id", verPermissoesId)
  .post("/add/:id", mdwRequerBody, addPermissoesId)
  .patch("/set/:id", mdwRequerBody, setPermissoesId)
  .patch("/remove/:id", mdwRequerBody, delPermissoesId);

export default apiV1PermissoesRouter;
