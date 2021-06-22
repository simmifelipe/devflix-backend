import { Router } from "express";
import seasonRouter from "./season.routes";

const routes = Router();

routes.use('/seasons', seasonRouter);


export default routes;