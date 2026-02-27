import { Router } from "express";
import {
  createTemperatureLog,
  bulkCreateTemperatureLogs,
  updateTemperatureLog,
  getTemperatureLogs,
  approveTemperatureLog,
} from "../controllers/temperature.controller";

import {
  protect,
  allowRoles,
  managerOnly,
} from "../middleware/auth.middleware";

const router = Router();

/* =========================================================
   GET ALL TEMPERATURE LOGS
   - All roles can access
========================================================= */
router.get(
  "/",
  protect,
  allowRoles("employee", "supervisor", "manager"),
  getTemperatureLogs
);

/* =========================================================
   CREATE SINGLE TEMPERATURE LOG
========================================================= */
router.post(
  "/",
  protect,
  allowRoles("employee", "supervisor", "manager"),
  createTemperatureLog
);

/* =========================================================
   BULK CREATE TEMPERATURE LOGS
========================================================= */
router.post(
  "/bulk",
  protect,
  allowRoles("employee", "supervisor", "manager"),
  bulkCreateTemperatureLogs
);

/* =========================================================
   UPDATE TEMPERATURE (VALUE CHANGE)
========================================================= */
router.put(
  "/:id",
  protect,
  allowRoles("employee", "supervisor", "manager"),
  updateTemperatureLog
);

/* =========================================================
   APPROVE TEMPERATURE (Manager Only)
========================================================= */
router.patch(
  "/:id/approve",
  protect,
  managerOnly,
  approveTemperatureLog
);

export default router;