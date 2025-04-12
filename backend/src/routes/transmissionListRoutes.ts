import { Router } from "express";
import multer from "multer";
import * as TransmissionListController from "../controllers/TransmissionListController";
import isAuth from "../middleware/isAuth";

import uploadConfig from "../config/upload";

const upload = multer(uploadConfig);
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
transmissionListRoutes.post(
  "/transmission-lists/:listId/send-media",
  isAuth,
  upload.single("media"),
  TransmissionListController.sendMediaToList
);

transmissionListRoutes.put(
  "/transmission-lists/:id",
  isAuth,
  TransmissionListController.update
);
export default transmissionListRoutes;
