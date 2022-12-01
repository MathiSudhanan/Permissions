import express from "express";
import {
  getAllUserGroups,
  getUserGroupById,
  modifyUserGroupMapping,
  getUsersByUserGroupId,
  mapUserGroupToUser,
  removeUserGroupFromUser,
} from "../controllers/userGroupMapping";

const auth = require("../lib/auth");

const router = express.Router();
router.get("/", auth, getAllUserGroups);
router.get("/:id", auth, getUserGroupById);
router.get("/Users/:userGroupId", auth, getUsersByUserGroupId);
router.patch("/:id", auth, modifyUserGroupMapping);
router.post("/", auth, mapUserGroupToUser);
router.delete("/:id", auth, removeUserGroupFromUser);

export default router;
