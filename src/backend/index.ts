import express from "express";
import apiRouter from "./api";

const app = express();
const port = 8080;

app.use("/", (req, res, next) => {
  console.log(`HTTP ${req.method} ${req.ip} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.send("ping do endpoint /");
});

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`O backend está online na porta ${port}`);
});
