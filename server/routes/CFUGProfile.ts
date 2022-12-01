import express from "express";
import {
  getCFUGProfileById,
  getCFUGProfiles,
  createCFUGProfile,
  deleteCFUGProfile,
  modifyCFUGProfile,
  getNewCFUGProfile,
  getNewCFUGAndOtherProfiles,
} from "../controllers/CFUGProfile";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getCFUGProfiles);
router.get("/:id", auth, getCFUGProfileById);
router.get("/new", auth, getNewCFUGProfile);
router.get("/new/:clientFundId/:userGroupId", auth, getNewCFUGAndOtherProfiles);
router.post("/", auth, createCFUGProfile);
router.patch("/:id", auth, modifyCFUGProfile);
router.delete("/:id", auth, deleteCFUGProfile);

export default router;
