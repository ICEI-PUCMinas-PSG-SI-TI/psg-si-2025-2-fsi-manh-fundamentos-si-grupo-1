import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";

const api_v1_usuarios_router = Router();

function notImplemented(req: Request, res: Response, next: NextFunction) {
  try {
    throw new Error("Not implemented");
  } catch (err) {
    next(err);
  }
}

api_v1_usuarios_router.get("/", notImplemented);
api_v1_usuarios_router.post("/", notImplemented);
api_v1_usuarios_router.get("/:id", notImplemented);
api_v1_usuarios_router.put("/:id", notImplemented);
api_v1_usuarios_router.patch("/:id", notImplemented);
api_v1_usuarios_router.delete("/:id", notImplemented);

export default api_v1_usuarios_router;
