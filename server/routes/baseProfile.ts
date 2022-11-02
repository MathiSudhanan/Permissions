import express from "express";
import {
  getBaseProfileById,
  getBaseProfiles,
  createBaseProfile,
  deleteBaseProfile,
  modifyBaseProfile,
  getNewBaseProfile,
} from "../controllers/baseProfile";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getBaseProfiles);
router.get("/new", auth, getNewBaseProfile);
router.get("/:id", auth, getBaseProfileById);
router.post("/", auth, createBaseProfile);
router.patch("/:id", auth, modifyBaseProfile);
router.delete("/:id", auth, deleteBaseProfile);

export default router;
