import express from "express";
import {
  getUserGroups,
  getUserGroupId,
  createUserGroup,
  deleteUserGroup,
  modifyUserGroup,
} from "../controllers/userGroup";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getUserGroups);
router.get("/:id", auth, getUserGroupId);
router.post("/", auth, createUserGroup);
router.patch("/:id", auth, modifyUserGroup);
router.delete("/:id", auth, deleteUserGroup);

export default router;
