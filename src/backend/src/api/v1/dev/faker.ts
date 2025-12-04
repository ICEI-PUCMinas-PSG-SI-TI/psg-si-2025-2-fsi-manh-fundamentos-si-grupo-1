import {
  type NextFunction,
  type Request,
  type Response,
  Router,
} from "express";
import * as z4 from "zod/v4";
import servicoFaker from "../../../services/servicoFaker";

const apiV1FakerRouter = Router();

const FakerParamsZ = z4.strictObject({
  canRecurse: z4.boolean().optional().default(false),
  quant: z4
    .int()
    .min(1, "O mínimo de entidades geradas por request é 1.")
    .max(1000, "O máximo de entidades geradas por request é de 1000.")
    .optional()
    .default(10),
});

async function criarProdutos(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedBody = FakerParamsZ.parse(req.body);
    const { canRecurse, quant } = parsedBody;
    await servicoFaker.criarProdutos(quant, canRecurse);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

async function criarLotes(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedBody = FakerParamsZ.parse(req.body);
    const { canRecurse, quant } = parsedBody;
    await servicoFaker.criarLotes(quant, canRecurse);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

async function criarTransacoes(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedBody = FakerParamsZ.parse(req.body);
    const { canRecurse, quant } = parsedBody;
    await servicoFaker.criarTransacoes(quant, canRecurse);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

async function criarUsuarios(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedBody = FakerParamsZ.parse(req.body);
    const { quant } = parsedBody;
    await servicoFaker.criarUsuarios(quant);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

async function criarUnidadesMedida(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedBody = FakerParamsZ.parse(req.body);
    const { quant } = parsedBody;
    await servicoFaker.criarUnidadesMedida(quant);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

async function criarCategorias(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const parsedBody = FakerParamsZ.parse(req.body);
    const { quant } = parsedBody;
    await servicoFaker.criarCategorias(quant);
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}

apiV1FakerRouter
  .post("/produtos", criarProdutos)
  .post("/lotes", criarLotes)
  .post("/movimentacoes", criarTransacoes)
  .post("/usuarios", criarUsuarios)
  .post("/unidades-medida", criarUnidadesMedida)
  .post("/categorias", criarCategorias);

export default apiV1FakerRouter;
