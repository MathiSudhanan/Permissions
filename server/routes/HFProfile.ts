import express from "express";
import {
  getHFProfileById,
  getHFProfiles,
  createHFProfile,
  deleteHFProfile,
  modifyHFProfile,
  getNewHFProfile,
} from "../controllers/HFProfile";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getHFProfiles);
router.get("/new", auth, getNewHFProfile);
router.get("/:id", auth, getHFProfileById);
router.post("/", auth, createHFProfile);
router.patch("/:id", auth, modifyHFProfile);
router.delete("/:id", auth, deleteHFProfile);

export default router;
