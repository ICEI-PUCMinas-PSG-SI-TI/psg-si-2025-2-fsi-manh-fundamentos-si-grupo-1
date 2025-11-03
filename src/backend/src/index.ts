import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import apiRouter from "./api";
import "dotenv/config";
import { error, info, middlewareHTTP } from "./logging";
import chalk from "chalk";
import { ClientError, HttpError } from "./error";
import z, { ZodError } from "zod";
import { inicializarAdministrador, verificarBancoDados } from "./db";
import cookieParser from "cookie-parser";
import authRouter from "./auth";
import { DrizzleQueryError } from "drizzle-orm";

z.config(z.locales.pt());

console.info(chalk.bgBlueBright("psg-si-fundamentos-backend\n"));

// Verifica se a base de dados está ok
if (!(await verificarBancoDados())) process.exit();

await inicializarAdministrador();

const app = express();
const port = 8080;

// MAYBE: add request id?
app.use(middlewareHTTP);

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("ping do endpoint /");
});

app.use("/auth", authRouter);
app.use("/api", apiRouter);

// Manipulação de errors
// Obs: É importante que todos os métodos HTTP chamem uma próxima função para que o erro sejá manipulado
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (err) {
    if (err instanceof ClientError || err instanceof HttpError) {
      res.status(err.code).send(err.message);
    } else if (err instanceof ZodError) {
      error(err.message);
      res.status(400).send("Parâmetros inválidos!");
    } else if (err instanceof DrizzleQueryError && err.cause instanceof Error) {
      error(err.cause?.message, { label: "query" });
      res.sendStatus(500);
    } else {
      if (err instanceof Error) error(err.message);
      res.sendStatus(500);
    }
  } else {
    next();
  }
});

app.listen(port, () =>
  info(`O backend está online na porta ${port}.`, { label: "server" }),
);
