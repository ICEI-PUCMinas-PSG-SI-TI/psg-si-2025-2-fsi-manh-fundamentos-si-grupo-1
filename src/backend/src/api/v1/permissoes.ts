import { Router, type NextFunction, type Response } from "express";
import { mdwRequerBody, type ExtendedRequest } from "../../middlewares";
import * as z4 from "zod/v4";
import { Permissoes } from "../../db/enums/permissoes";
import servicoPermissoes from "../../services/servicoPermissoes";
import { ParamsIdSchemaZ } from "./objects";

const apiV1PermissoesRouter = Router();

const ParamsPatchPermissoesZ = z4.object({
  usuarioId: z4.uuid(),
  permissoes: z4.array(z4.enum(Permissoes)),
});

export type ParamsPatchPermissoes = z4.infer<typeof ParamsPatchPermissoesZ>;

async function addPermissoes(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
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
): Promise<void> {
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
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const permissoes = await servicoPermissoes.selecionarPermissoes(params.id);
    res.send(permissoes);
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
): Promise<void> {
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
): Promise<void> {
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
