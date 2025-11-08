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

async function verPermissoes(
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

apiV1PermissoesRouter
  .get("/ver/:id", verPermissoes)
  .patch("/add", mdwRequerBody, addPermissoes)
  .patch("/remove", mdwRequerBody, delPermissoes);

export default apiV1PermissoesRouter;
