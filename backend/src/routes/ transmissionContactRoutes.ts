import { Router } from "express";
import * as TransmissionContactController from "../controllers/TransmissionContactController";
import apiTokenAuth from "../middleware/apiTokenAuth";
import isAuth from "../middleware/isAuth";

const transmissionContactRoutes = Router();

transmissionContactRoutes.post(
  "/transmission-contacts",
  apiTokenAuth,
  isAuth,
  TransmissionContactController.create
);
transmissionContactRoutes.get(
  "/transmission-contacts/:transmissionListId",
  apiTokenAuth,
  isAuth,
  TransmissionContactController.list
);
transmissionContactRoutes.delete(
  "/transmission-contacts/:transmissionListId/:contactId",
  apiTokenAuth,
  isAuth,
  TransmissionContactController.remove
);

export default transmissionContactRoutes;
