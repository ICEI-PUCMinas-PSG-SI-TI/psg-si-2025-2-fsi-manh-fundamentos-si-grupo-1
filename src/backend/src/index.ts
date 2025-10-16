import express, {
  type NextFunction,
  type Request,
  type Response,
} from "express";
import apiRouter from "./api";
import "dotenv/config";
import { middlewareHTTP } from "./logging";
import chalk from "chalk";
import { ClientError } from "./error";

const app = express();
const port = 8080;

// MAYBE: add request id?
app.use(middlewareHTTP);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("ping do endpoint /");
});

app.use("/api", apiRouter);

// Manipulação de errors
// Obs: É importante que todos os métodos HTTP chamem uma próxima função para que o erro sejá manipulado
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  if (err) {
    if (err instanceof ClientError) {
      res.status(400).send(err.message);
    } else {
      if (err instanceof Error) console.log(err.message);
      res.sendStatus(500);
    }
  } else {
    next();
  }
});

app.listen(port, () => {
  console.log(
    [
      chalk.bgBlueBright("psg-si-fundamentos-backend"),
      `O backend está online na porta ${port}`,
      chalk.bold("Requests:"),
    ].join("\n\n")
  );
});
