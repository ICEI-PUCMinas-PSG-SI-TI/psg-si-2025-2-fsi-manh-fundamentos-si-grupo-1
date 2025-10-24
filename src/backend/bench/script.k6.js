/* eslint-disable */
import http from "k6/http";
import { expect } from "https://jslib.k6.io/k6-testing/0.5.0/index.js";

// grafana/k6
// k6 run script.k6.js

// TODO: Otimizar API, com mais de 100 request o logging da aplicação deixa tudo lento
export const options = { vus: 100, duration: "5s" };

// TODO: Criar testes e adicionar outras partes da API
export default function () {
  let res = http.get("http://localhost:8080/api/v1/lotes/");
  expect.soft(res.status).toBe(200);

  // sleep(1);

  let res2 = http.post("http://localhost:8080/api/v1/lotes");
  expect.soft(res2.status).toBe(200);
}
