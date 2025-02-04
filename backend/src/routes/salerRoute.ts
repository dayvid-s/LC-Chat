import { Router } from "express";
import SalerController from "../controllers/SalerController";
import isAuth from "../middleware/isAuth";

const salerRoutes = Router();
salerRoutes.get("/salers", isAuth, SalerController.getAll);
salerRoutes.get("/salers/:id", isAuth, SalerController.getById);
salerRoutes.post("/salers", isAuth, SalerController.create);
salerRoutes.post("/salers/many", SalerController.createMany);
salerRoutes.put("/salers/:id", isAuth, SalerController.update);
salerRoutes.delete("/salers/:id", isAuth, SalerController.delete);
export default salerRoutes;
