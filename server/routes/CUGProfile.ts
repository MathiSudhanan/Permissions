import express from "express";
import {
  getCUGProfileById,
  getCUGProfiles,
  createCUGProfile,
  deleteCUGProfile,
  modifyCUGProfile,
  getNewCUGProfile,
  getNewCUGAndBaseProfile,
  
} from "../controllers/CUGProfile";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getCUGProfiles);
router.get("/:id", auth, getCUGProfileById);
router.get("/new", auth, getNewCUGProfile);
router.get("/new/:id", auth, getNewCUGAndBaseProfile);
router.post("/", auth, createCUGProfile);
router.patch("/:id", auth, modifyCUGProfile);
router.delete("/:id", auth, deleteCUGProfile);

export default router;
