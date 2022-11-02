import express from "express";
import { getStatById, getStats, createStat, deleteStat, modifyStat } from "../controllers/stat";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getStats);
router.get("/:id", auth, getStatById);
router.post("/", auth, createStat);
router.patch("/:id", auth, modifyStat);
router.delete("/:id", auth, deleteStat);


export default router;
