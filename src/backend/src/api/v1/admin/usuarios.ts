import { type ExtendedRequest } from "../../../middlewares";
import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import servicoUsuarios, {
  InsertUsuarioSchemaReqZ,
} from "../../../services/servicoUsuarios";
import { ParamsIdSchemaZ, PasswordZ } from "../objects";
import * as z4 from "zod/v4";
import { UpdateUsuarioSchemaZ } from "../../../db/schema/usuarios";
import { mdwRequerBody } from "../../../middlewares";

const apiV1AdminUsuariosRouter = Router();

async function getUsuarios(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const consulta = await servicoUsuarios.listarTodosPerfil();
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

async function postUsuario(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedBody = InsertUsuarioSchemaReqZ.parse(req.body);
    const uuid = await servicoUsuarios.inserir(parsedBody);
    res.send(uuid);
  } catch (err) {
    next(err);
  }
}

const AdmAlteracaoSenhaZ = z4.strictObject({
  senha: PasswordZ,
});

async function alterarSenha(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const parsedBody = AdmAlteracaoSenhaZ.parse(req.body);
    const ok = await servicoUsuarios.substituirSenha(
      params.id,
      parsedBody.senha,
    );
    if (ok) {
      res.sendStatus(200);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
}

async function getUsuarioId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const consulta = await servicoUsuarios.selecionarPorId(params.id);
    if (consulta) {
      res.send(consulta);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
}

async function excluirUsuarioId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const alterado = await servicoUsuarios.excluirPorId(params.id);
    if (alterado) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
}

const AdmUpdateUsuarioEndpointSchema = UpdateUsuarioSchemaZ.strict();

// TODO: Handle password change
async function patchUsuario(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const updateFields = AdmUpdateUsuarioEndpointSchema.parse(req.body);
    const params = ParamsIdSchemaZ.parse(req.params);
    const alteracoes = await servicoUsuarios.atualizar(params.id, updateFields);
    if (alteracoes > 0) {
      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
}

apiV1AdminUsuariosRouter
  .get("/", getUsuarios)
  .post("/", mdwRequerBody, postUsuario)
  .patch("/:id", mdwRequerBody, patchUsuario)
  .post("/alterar-senha/:id", mdwRequerBody, alterarSenha)
  .get("/:id", getUsuarioId)
  .delete("/:id", excluirUsuarioId);

export default apiV1AdminUsuariosRouter;
