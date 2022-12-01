import express from "express";
import {
  getCFUProfileById,
  getCFUProfiles,
  createCFUProfile,
  deleteCFUProfile,
  modifyCFUProfile,
  getNewCFUProfile,
  getNewCFUAndOtherProfiles,
} from "../controllers/CFUProfile";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getCFUProfiles);
router.get("/:id", auth, getCFUProfileById);
router.get("/new", auth, getNewCFUProfile);
router.get("/new/:clientFundId/:userGroupId", auth, getNewCFUAndOtherProfiles);
router.post("/", auth, createCFUProfile);
router.patch("/:id", auth, modifyCFUProfile);
router.delete("/:id", auth, deleteCFUProfile);

export default router;
