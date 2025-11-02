import {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import z from "zod";
import servicoFaker from "../../../services/servicoFaker";

const apiV1FakerRouter = Router();

const FakerParamsZ = z.strictObject({
  canRecurse: z.boolean().optional().default(false),
  quant: z.int().optional().default(10),
});

async function criarProdutos(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedBody = FakerParamsZ.parse(req.body);
    const { canRecurse, quant } = parsedBody;
    await servicoFaker.criarProdutos(quant, canRecurse);
    res.send();
  } catch (err) {
    next(err);
  }
}

async function criarLotes(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedBody = FakerParamsZ.parse(req.body);
    const { canRecurse, quant } = parsedBody;
    await servicoFaker.criarLotes(quant, canRecurse);
    res.send();
  } catch (err) {
    next(err);
  }
}

async function criarTransacoes(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = FakerParamsZ.parse(req.body);
    const { canRecurse, quant } = parsedBody;
    await servicoFaker.criarTransacoes(quant, canRecurse);
    res.send();
  } catch (err) {
    next(err);
  }
}

async function criarUsuarios(req: Request, res: Response, next: NextFunction) {
  try {
    const parsedBody = FakerParamsZ.parse(req.body);
    const { quant } = parsedBody;
    await servicoFaker.criarUsuarios(quant);
    res.send();
  } catch (err) {
    next(err);
  }
}

async function criarUnidadesMedida(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = FakerParamsZ.parse(req.body);
    const { quant } = parsedBody;
    await servicoFaker.criarUnidadesMedida(quant);
    res.send();
  } catch (err) {
    next(err);
  }
}

apiV1FakerRouter
  .post("/produtos", criarProdutos)
  .post("/lotes", criarLotes)
  .post("/movimentacoes", criarTransacoes)
  .post("/usuarios", criarUsuarios)
  .post("/unidades-medida", criarUnidadesMedida);

export default apiV1FakerRouter;
