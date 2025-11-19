import { UpdateUsuarioSchemaZ } from "../../db/schema/usuarios";
import { type ExtendedRequest } from "../../middlewares";
import { mdwRequerBody } from "../../middlewares";
import servicoUsuarios from "../../services/servicoUsuarios";
import { ParamsIdSchemaZ, PasswordZ } from "./objects";
import { type NextFunction, type Response, Router } from "express";
import * as z4 from "zod/v4";

const apiV1UsuariosRouter = Router();

const AlteracaoSenhaZ = z4.strictObject({
  senhaAnterior: PasswordZ,
  senhaNova: PasswordZ,
});

async function getUsuarioId(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const consulta = await servicoUsuarios.listarUnicoPublico(params.id);
    if (consulta) {
      res.send(consulta);
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    next(err);
  }
}

async function alterarSenha(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const usuario = req._usuario!;
    const senhas = AlteracaoSenhaZ.parse(req.body);
    const ok = await servicoUsuarios.alterarSenha(
      senhas.senhaAnterior,
      senhas.senhaNova,
      usuario.id,
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

const UpdateUsuarioEndpointSchema = UpdateUsuarioSchemaZ.pick({
  login: true,
  nome: true,
  modoEscuro: true,
  foto: true,
}).strict();

async function patchUsuario(
  req: ExtendedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const updateFields = UpdateUsuarioEndpointSchema.parse(req.body);
    const usuario = req._usuario!;
    const atualizacoes = await servicoUsuarios.atualizar(
      usuario.id,
      updateFields,
    );
    if (atualizacoes > 0) {
      res.sendStatus(200);
    } else {
      res.sendStatus(400);
    }
  } catch (err) {
    next(err);
  }
}

apiV1UsuariosRouter
  .get("/:id", getUsuarioId)
  .post("/alterar-senha", mdwRequerBody, alterarSenha)
  // TODO: Implementar PUT e PATCH para o endpoint de usuários.
  .patch("/", mdwRequerBody, patchUsuario);

export default apiV1UsuariosRouter;
