import express from "express";
import {
  getCompanyUserGroups,
  getCompanyUserGroupById,
  mapCompanyToUserGroup,
  modifyCompanyUserGroup,
  removeCompanyUserGroup,
} from "../controllers/companyUserGroup";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getCompanyUserGroups);
router.get("/:id", auth, getCompanyUserGroupById);
router.post("/", auth, mapCompanyToUserGroup);
router.patch("/:id", auth, modifyCompanyUserGroup);
router.delete("/:id", auth, removeCompanyUserGroup);

export default router;
