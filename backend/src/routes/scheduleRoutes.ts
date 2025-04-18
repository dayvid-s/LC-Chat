import express from "express";
import multer from "multer";
import isAuth from "../middleware/isAuth";

import * as ScheduleController from "../controllers/ScheduleController";

const upload = multer({ dest: "uploads/" });

const scheduleRoutes = express.Router();

scheduleRoutes.get("/schedules", isAuth, ScheduleController.index);

scheduleRoutes.post(
  "/schedules",
  isAuth,
  upload.single("file"),
  ScheduleController.store
);

scheduleRoutes.put("/schedules/:scheduleId", isAuth, ScheduleController.update);

scheduleRoutes.get("/schedules/:scheduleId", isAuth, ScheduleController.show);

scheduleRoutes.delete(
  "/schedules/:scheduleId",
  isAuth,
  ScheduleController.remove
);

export default scheduleRoutes;
