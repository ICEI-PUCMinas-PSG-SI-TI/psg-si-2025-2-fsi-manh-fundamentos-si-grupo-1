import { Router } from "express";
import api_v1_usuarios from "./v1/usuarios";
import api_v1_lotes from "./v1/lotes";

const api_v1_router = Router();

// {host}/api/v1/usuarios
api_v1_router.use("/usuarios", api_v1_usuarios);

// {host}/api/v1/lotes
api_v1_router.use("/lotes", api_v1_lotes);

export default api_v1_router;
