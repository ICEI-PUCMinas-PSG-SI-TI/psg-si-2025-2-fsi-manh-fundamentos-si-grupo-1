import express from "express";
import apiRouter from "./api";
import "dotenv/config";
import { info, middlewareHTTP } from "./logging";
import chalk from "chalk";
import { mdwError } from "./error";
import z from "zod";
import { inicializarAdministrador, verificarBancoDados } from "./db";
import cookieParser from "cookie-parser";
import authRouter from "./auth";
import { mdwRequestId } from "./middlewares";

z.config(z.locales.pt());

console.info(chalk.bgBlueBright("psg-si-fundamentos-backend\n"));

// Verifica se a base de dados está ok
if (!(await verificarBancoDados())) process.exit();

await inicializarAdministrador();

const app = express();
const port = process.env.PORT || 8080;

app.use(mdwRequestId);

app.use(middlewareHTTP);

app.use(express.json());

app.use(cookieParser());

// TODO: static -> vue.js
app
  .get("/", (req, res) => res.send("ping do endpoint /"))
  .get("/ping", (req, res) => res.send("pong"));

app.use("/auth", authRouter);
app.use("/api", apiRouter);

// Manipulação de errors
// Obs: É importante que todos os métodos HTTP chamem uma próxima função para que o erro sejá manipulado
app.use(mdwError);

app.listen(port, () =>
  info(`O backend está online na porta ${port}.`, { label: "server" }),
);
