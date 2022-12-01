import express from "express";
import {
  getCompanyUserGroups,
  getCompanyUserGroupById,
  mapCompanyToUserGroup,
  modifyCompanyUserGroup,
  removeCompanyUserGroup,
  getUserGroupsByCompanyId,
} from "../controllers/companyUserGroup";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getCompanyUserGroups);
router.get("/:id", auth, getCompanyUserGroupById);
router.get("/cug/:companyId", auth, getUserGroupsByCompanyId);
router.post("/", auth, mapCompanyToUserGroup);
router.patch("/:id", auth, modifyCompanyUserGroup);
router.delete("/:id", auth, removeCompanyUserGroup);

export default router;
