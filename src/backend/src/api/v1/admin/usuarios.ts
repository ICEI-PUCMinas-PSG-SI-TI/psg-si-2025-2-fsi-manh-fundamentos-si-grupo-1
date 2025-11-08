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
import { ClientError } from "../../../error";
import { ParamsIdSchemaZ, PasswordZ } from "../objects";
import z from "zod";
import { UpdateUsuarioSchemaZ } from "../../../db/schema/usuarios";
import { mdwRequerBody } from "../../../middlewares";

const apiV1AdminUsuariosRouter = Router();

async function getUsuarios(req: Request, res: Response, next: NextFunction) {
  try {
    const consulta = await servicoUsuarios.selecionarTodos();
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

async function postUsuario(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = InsertUsuarioSchemaReqZ.parse(req.body);
    await servicoUsuarios.inserir(parsedBody);
    res.send();
  } catch (err) {
    next(err);
  }
}

const AdmAlteracaoSenhaZ = z.strictObject({
  senha: PasswordZ,
});

async function alterarSenha(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const parsedBody = AdmAlteracaoSenhaZ.parse(req.body);
    const ok = await servicoUsuarios.substituirSenha(
      params.id,
      parsedBody.senha,
    );
    if (ok) {
      res.send();
    } else {
      throw new ClientError("Unauthorized", 401);
    }
  } catch (err) {
    next(err);
  }
}

async function getUsuarioId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const consulta = await servicoUsuarios.selecionarPorId(params.id);
    if (!consulta) throw new ClientError("Not Found", 404);
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

async function excluirUsuarioId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const consulta = await servicoUsuarios.excluirPorId(params.id);
    if (consulta === 0) throw new ClientError("", 404);
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

const AdmUpdateUsuarioEndpointSchema = UpdateUsuarioSchemaZ.pick({}).strict();

async function patchUsuario(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const updateFields = AdmUpdateUsuarioEndpointSchema.parse(req.body);
    const usuario = req._usuario!;
    const updates = await servicoUsuarios.atualizar(usuario.id, updateFields);
    if (updates === 1) {
      res.send();
    } else {
      throw new ClientError("Bad Request", 400);
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
