import { Router } from "express";
import apiV1Faker from "./dev/faker";

const apiV1DevRouter = Router();

// {host}/api/v1/faker
apiV1DevRouter.use("/faker", apiV1Faker);

export default apiV1DevRouter;
