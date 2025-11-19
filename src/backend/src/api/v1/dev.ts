import apiV1Faker from "./dev/faker";
import { Router } from "express";

const apiV1DevRouter = Router();

// {host}/api/v1/faker
apiV1DevRouter.use("/faker", apiV1Faker);

export default apiV1DevRouter;
