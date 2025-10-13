import { Router, type Request, type Response } from "express";
import { debug, error } from "../../logging";

const apiV1UsersRouter = Router();

// findMany() -> encontrarVarios()
apiV1UsersRouter.get("/", (req, res) => {
  error("Not implemented");
  res.status(501).send("Not implemented");
});

// create() -> criar()
apiV1UsersRouter.post("/", (req, res) => {
  error("Not implemented");
  res.status(501).send("Not implemented");
});

// findOne() -> encontrarUnico()
apiV1UsersRouter.get("/:id", (req: Request, res: Response) => {
  debug("api.v1.user.id");
  res.send("Retornando informações do usuário " + req.params.id);
  // error("Not implemented");
  // res.status(501).send("Not implemented");
});

// update() -> atualizar()
apiV1UsersRouter.put("/:id", (req: Request, res: Response) => {
  error("Not implemented");
  res.status(501).send("Not implemented");
});

// updateField() -> atualizarCampo()
apiV1UsersRouter.patch("/:id", (req: Request, res: Response) => {
  error("Not implemented");
  res.status(501).send("Not implemented");
});

// delete() -> excluir()
apiV1UsersRouter.delete("/:id", (req: Request, res: Response) => {
  error("Not implemented");
  res.status(501).send("Not implemented");
});

export default apiV1UsersRouter;
