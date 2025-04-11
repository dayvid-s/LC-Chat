import { Router } from "express";
import * as TransmissionListController from "../controllers/TransmissionListController";
import isAuth from "../middleware/isAuth";

const transmissionListRoutes = Router();

transmissionListRoutes.post(
  "/transmission-lists",
  isAuth,
  TransmissionListController.store
);
transmissionListRoutes.get(
  "/transmission-lists",
  isAuth,
  TransmissionListController.index
);
transmissionListRoutes.get(
  "/transmission-lists/:id",
  isAuth,
  TransmissionListController.show
);
transmissionListRoutes.delete(
  "/transmission-lists/:id",
  isAuth,
  TransmissionListController.remove
);

transmissionListRoutes.put(
  "/transmission-lists/:id",
  isAuth,
  TransmissionListController.update
);
export default transmissionListRoutes;
