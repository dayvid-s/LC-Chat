import { Router } from "express";
import SalerController from "../controllers/SalerController";

const salerRoutes = Router();

salerRoutes.get("/salers", SalerController.getAll);
salerRoutes.get("/salers/:id", SalerController.getById);
salerRoutes.post("/salers", SalerController.create);
salerRoutes.post("/salers/many", SalerController.createMany);
salerRoutes.put("/salers/:id", SalerController.update);
salerRoutes.delete("/salers/:id", SalerController.delete);

export default salerRoutes;