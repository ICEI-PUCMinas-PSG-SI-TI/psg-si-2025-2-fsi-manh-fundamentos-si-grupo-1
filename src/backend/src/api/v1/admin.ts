import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import apiV1AdminUsuarios from "./admin/usuarios";
import servicoAutenticacao from "../../services/servicoAutenticacao";

const apiV1AdminRouter = Router();

// {host}/api/v1/admin/usuarios
apiV1AdminRouter.use("/usuarios", apiV1AdminUsuarios);

// {host}/api/v1/admin/limpar-sessoes
apiV1AdminRouter.post(
  "/invalidar-sessoes",
  async (_: Request, res: Response, next: NextFunction) => {
    try {
      const ok = await servicoAutenticacao.invalidarSessoes();
      if (ok) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    } catch (err) {
      next(err);
    }
  },
);

export default apiV1AdminRouter;
