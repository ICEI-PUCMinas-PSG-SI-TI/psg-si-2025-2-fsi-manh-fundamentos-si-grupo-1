import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import apiV1AdminUsuarios from "./admin/usuarios";
import { mdwAdministrador } from "../../middlewares";
import apiV1Faker from "./admin/faker";
import servicoAutenticacao from "../../services/servicoAutenticacao";

const apiV1AdminRouter = Router();

apiV1AdminRouter.use(mdwAdministrador);

// {host}/api/v1/faker
apiV1AdminRouter.use("/faker", apiV1Faker);

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
