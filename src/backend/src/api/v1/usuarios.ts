import {
  parseSessionUser,
  type SessionRequest,
  type SessionUserRequest,
} from "../../cookies";
import { Router, type NextFunction, type Response } from "express";
import servicoUsuarios, {
  InsertUsuarioSchemaReqZ,
} from "../../services/servicoUsuarios";
import { ClientError } from "../../error";
import { ParamsIdSchemaZ } from "./objects";
import z from "zod";
import { UpdateUsuarioSchemaZ } from "../../db/schema/usuarios";

const apiV1UsuariosRouter = Router();

/*
async function getUsuarios(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const consulta = await servicoUsuarios.selecionarTodos();
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

async function postUsuario(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.body)
      throw new ClientError("Não há informações para serem inseridas!");
    const parsedBody = InsertUsuarioSchemaReqZ.parse(req.body);
    await servicoUsuarios.inserir(parsedBody);
    res.send();
  } catch (err) {
    next(err);
  }
}*/

// TODO: Adicionar mais regras
const AlteracaoSenhaZ = z.strictObject({
  senhaAnterior: z.string().min(8).max(64),
  senhaNova: z.string().min(8).max(64),
});

async function alterarSenha(
  req: SessionUserRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.body) throw new ClientError("Bad Request", 400);
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
/*
async function getUsuarioId(
  req: SessionRequest,
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
  req: SessionRequest,
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
*/

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
    if (!req.body) throw new Error("Not implemented");
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
  .post("/alterar-senha", alterarSenha)
  // TODO: Implementar PUT e PATCH para o endpoint de usuários.
  .patch("/", patchUsuario);

// TODO: criar um endpoint /api/v1/admin/usuarios
// .get("/", getUsuarios)
// .post("/", postUsuario);
// .get("/:id", getUsuarioId)
// .delete("/:id", excluirUsuarioId);

export default apiV1UsuariosRouter;
