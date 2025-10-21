import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";

const apiV1UsuariosRouter = Router();

function notImplemented(req: Request, res: Response, next: NextFunction) {
  try {
    throw new Error("Not implemented");
  } catch (err) {
    next(err);
  }
}

apiV1UsuariosRouter.get("/", notImplemented);
apiV1UsuariosRouter.post("/", notImplemented);
apiV1UsuariosRouter.get("/:id", notImplemented);
apiV1UsuariosRouter.put("/:id", notImplemented);
apiV1UsuariosRouter.patch("/:id", notImplemented);
apiV1UsuariosRouter.delete("/:id", notImplemented);

export default apiV1UsuariosRouter;
