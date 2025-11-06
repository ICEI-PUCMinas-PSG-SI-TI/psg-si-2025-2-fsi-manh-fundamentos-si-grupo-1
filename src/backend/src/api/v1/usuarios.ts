import {
  parseSessionUser,
  type SessionRequest,
  type SessionUserRequest,
} from "../../cookies";
import { Router, type NextFunction, type Response } from "express";
import servicoUsuarios from "../../services/servicoUsuarios";
import { ClientError } from "../../error";
import z from "zod";
import { UpdateUsuarioSchemaZ } from "../../db/schema/usuarios";
import { ParamsIdSchemaZ, PasswordZ } from "./objects";
import { requireBody } from "../../middlewares";

const apiV1UsuariosRouter = Router();

const AlteracaoSenhaZ = z.strictObject({
  senhaAnterior: PasswordZ,
  senhaNova: PasswordZ,
});

async function getUsuarioId(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const consulta = await servicoUsuarios.selecionarInfoPorId(params.id);
    if (!consulta) throw new ClientError("Not Found", 404);
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

async function alterarSenha(
  req: SessionUserRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const usuario = req._usuario!;
    const senhas = AlteracaoSenhaZ.parse(req.body);
    const ok = await servicoUsuarios.alterarSenha(
      senhas.senhaAnterior,
      senhas.senhaNova,
      usuario.id,
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

const UpdateUsuarioEndpointSchema = UpdateUsuarioSchemaZ.pick({
  login: true,
  nome: true,
  modoEscuro: true,
  foto: true,
}).strict();

async function patchUsuario(
  req: SessionUserRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const updateFields = UpdateUsuarioEndpointSchema.parse(req.body);
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

apiV1UsuariosRouter
  .use(parseSessionUser)
  .get("/:id", getUsuarioId)
  .post("/alterar-senha", requireBody, alterarSenha)
  // TODO: Implementar PUT e PATCH para o endpoint de usuários.
  .patch("/", requireBody, patchUsuario);

export default apiV1UsuariosRouter;
