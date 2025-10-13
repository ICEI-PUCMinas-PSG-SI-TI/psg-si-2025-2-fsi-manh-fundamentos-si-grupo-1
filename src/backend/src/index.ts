import express from "express";
import apiRouter from "./api";
import "dotenv/config";
import { middlewareHTTP } from "./logging";
import chalk from "chalk";

const app = express();
const port = 8080;

// MAYBE: add request id?
app.use(middlewareHTTP);

app.get("/", (req, res) => {
  res.send("ping do endpoint /");
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(
    [
      chalk.bgBlueBright("psg-si-fundamentos-backend"),
      `O backend está online na porta ${port}`,
      chalk.bold("Requests:"),
    ].join("\n\n")
  );
});
