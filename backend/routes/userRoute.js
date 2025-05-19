import express from "express";
import {
  loginUser,
  superAdminLogin,
  getWorkerRoles,
  getWorkers,
  createRole,
  updateRole,
  deleteRole,
  getCurrentUser,
} from "../controller/usercontroller.js";

const userRouter = express.Router();
userRouter.post("/superadminlogin", superAdminLogin);
userRouter.post("/login", loginUser);
userRouter.get("/roles", getWorkerRoles);
userRouter.get("/workers", getWorkers);
userRouter.post("/roles", createRole);
userRouter.put("/roles/:id", updateRole);
userRouter.delete("/roles/:id", deleteRole);
userRouter.get("/current", getCurrentUser);
export default userRouter;
