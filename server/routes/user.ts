import express from "express";
import {
  getUsers,
  createUser,
  getCurrentUser,
  getUserById,
  getUsersByCompanyId,
  modifyUser,
  deleteUser,
} from "../controllers/user";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getUsers);
router.get("/:id", auth, getUserById);
router.get("/CurrentUser", auth, getCurrentUser);
router.get("/company/:companyId", auth, getUsersByCompanyId);
router.post("/", createUser);
router.patch("/:id", auth, modifyUser);
router.delete("/:id", auth, deleteUser);

export default router;
