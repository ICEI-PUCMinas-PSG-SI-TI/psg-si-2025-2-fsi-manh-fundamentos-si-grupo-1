import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import apiV1AdminUsuarios from "./admin/usuarios";
import apiV1Faker from "./admin/faker";
import servicoAutenticacao from "../../services/servicoAutenticacao";
import { Permissoes } from "../../db/schema/permissoes";
import { mdwPermissoes } from "../../middlewares";

const apiV1AdminRouter = Router();

// {host}/api/v1/faker
apiV1AdminRouter.use(
  "/faker",
  mdwPermissoes(Permissoes.Desenvolvedor),
  apiV1Faker,
);

// {host}/api/v1/admin/usuarios
apiV1AdminRouter.use("/usuarios", apiV1AdminUsuarios);

// {host}/api/v1/admin/limpar-sessoes
apiV1AdminRouter.post(
  "/invalidar-sessoes",
  async (_: Request, res: Response, next: NextFunction) => {
    try {
      await servicoAutenticacao.invalidarSessoes();
      res.send(200);
    } catch (err) {
      next(err);
    }
  },
);

export default apiV1AdminRouter;
