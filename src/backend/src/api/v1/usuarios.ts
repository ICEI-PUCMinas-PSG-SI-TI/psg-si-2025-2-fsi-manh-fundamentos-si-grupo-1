import type { SessionRequest } from "../../cookies";
import { Router, type NextFunction, type Response } from "express";
import servicoUsuarios, {
  InsertUsuarioSchemaReqZ,
} from "../../services/servicoUsuarios";
import { ClientError } from "../../error";
import { ParamsIdSchemaZ } from "./objects";

const apiV1UsuariosRouter = Router();

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
}

async function getUsuarioId(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const params = ParamsIdSchemaZ.parse(req.params);
    const consulta = await servicoUsuarios.selecionarPorId(params.id);
    if (consulta.length === 0) throw new ClientError("Not Found", 404);
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

function notImplemented(
  req: SessionRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    throw new Error("Not implemented");
  } catch (err) {
    next(err);
  }
}

apiV1UsuariosRouter
  .get("/", getUsuarios)
  .post("/", postUsuario)
  .get("/:id", getUsuarioId)
  // TODO: Implementar PUT e PATCH para o endpoint de usuários.
  .put("/:id", notImplemented)
  .patch("/:id", notImplemented)
  .delete("/:id", excluirUsuarioId);

export default apiV1UsuariosRouter;
