import { Permissoes } from "../../db/enums/permissoes";
import { type ExtendedRequest, mdwRequerBody } from "../../middlewares";
import servicoPermissoes from "../../services/servicoPermissoes";
import { ParamsIdSchemaZ } from "./objects";
import { type NextFunction, type Response, Router } from "express";
import * as z4 from "zod/v4";

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
    const ok = await servicoPermissoes.adicionarPermissoesUsuario(
      parsedBody.usuarioId,
      ...parsedBody.permissoes,
    );
    if (ok) {
      res.sendStatus(200);
    } else {
      // 400 ou 500? -> Como o servidor não indica o que deu erro, retornar 500.
      res.sendStatus(500);
    }
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
    const ok = await servicoPermissoes.removerPermissoesUsuario(
      parsedBody.usuarioId,
      ...parsedBody.permissoes,
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
