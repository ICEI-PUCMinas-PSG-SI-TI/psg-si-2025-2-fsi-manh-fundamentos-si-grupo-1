import express from "express";
import apiRouter from "./api";
import "dotenv/config";
import { LoteService } from "./services/lotes";

const app = express();
const port = 8080;

let lotes = new LoteService();

app.use("/", (req, res, next) => {
  console.log(`HTTP ${req.method} ${req.ip} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.send("ping do endpoint /");
});

app.get("/teste", (req, res) => {
  lotes.criarLote();
  lotes.lerLotes();
  res.send("comandos executados!");
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`O backend está online na porta ${port}`);
});
