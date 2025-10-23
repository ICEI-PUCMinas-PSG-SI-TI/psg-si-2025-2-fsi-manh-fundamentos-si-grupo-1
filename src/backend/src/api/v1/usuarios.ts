import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import servicoUsuarios, {
  InsertUsuarioSchemaReqZ,
} from "../../services/ServicoUsuarios";
import { ClientError } from "../../error";
import { ParamsIdSchema } from "./objects";

const apiV1UsuariosRouter = Router();

async function getUsuarios(req: Request, res: Response, next: NextFunction) {
  try {
    const consulta = await servicoUsuarios.selecionarTodos();
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

async function postUsuario(req: Request, res: Response, next: NextFunction) {
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

async function getLoteId(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ParamsIdSchema.parse(req.params);
    const consulta = await servicoUsuarios.selecionarPorId(params.id);
    if (consulta.length === 0) throw new ClientError("Not Found", 404);
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

async function excluirLoteId(req: Request, res: Response, next: NextFunction) {
  try {
    const params = ParamsIdSchema.parse(req.params);
    const consulta = await servicoUsuarios.excluirPorId(params.id);
    if (consulta === 0) throw new ClientError("", 404);
    res.send(consulta);
  } catch (err) {
    next(err);
  }
}

function notImplemented(req: Request, res: Response, next: NextFunction) {
  try {
    throw new Error("Not implemented");
  } catch (err) {
    next(err);
  }
}

apiV1UsuariosRouter.get("/", getUsuarios);
apiV1UsuariosRouter.post("/", postUsuario);
apiV1UsuariosRouter.get("/:id", getLoteId);
apiV1UsuariosRouter.put("/:id", notImplemented);
apiV1UsuariosRouter.patch("/:id", notImplemented);
apiV1UsuariosRouter.delete("/:id", excluirLoteId);

export default apiV1UsuariosRouter;
