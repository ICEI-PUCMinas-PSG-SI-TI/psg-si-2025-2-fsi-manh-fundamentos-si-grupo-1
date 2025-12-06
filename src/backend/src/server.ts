import chalk from "chalk";
import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import * as z4 from "zod/v4";
import apiRouter from "./api";
import authRouter from "./auth";
import { inicializarAdministrador, verificarBancoDados } from "./db";
import { mdwError } from "./error";
import { info, middlewareHTTP } from "./logging";
import { mdwRequestId } from "./middlewares";

const app = express();
const port = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

z4.config(z4.locales.pt());

console.info(chalk.bgBlueBright("psg-si-fundamentos-backend\n"));

// Verifica se a base de dados está ok
if (!(await verificarBancoDados())) {
  process.exit();
}

// Garante que há pelo menos um administrador
// TODO: Inicializar um perfil de desenvolvedor
await inicializarAdministrador();

app
  // Adiciona id em todas as requests
  .use(mdwRequestId)

  // Registra informações de cada request no log
  .use(middlewareHTTP)

  // Endpoint de teste para verificar se o servidor esta respondendo
  .get("/ping", (req, res) => res.send("pong"))

  // Transforma o body das requests em json de acordo com o Header Content-Type
  .use(express.json())

  // Analisa os cookies de cada request
  .use(cookieParser())

  // Roteador/Endpoint responsável por realizar a autenticação.
  .use("/auth", authRouter)

  // Roteador/Endpoint reponsável por toda a API (leitura e escrita de dados).
  .use("/api", apiRouter)

  // Retornar arquivos estaticos (como index.html) na pasta backend/src/dist/
  .use(express.static(path.join(__dirname, "../dist")))

  // Enviar todas as requisições não tratadas para o index.html (Vue.js)
  .get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../dist", "index.html"));
  })

  // Manipulação de errors: É importante que todos os métodos HTTP
  // chamem uma próxima função para que o erro sejá manipulado.
  .use(mdwError)

  .listen(port, () =>
    info(`O backend está online na porta ${port}.`, { label: "server" }),
  );
