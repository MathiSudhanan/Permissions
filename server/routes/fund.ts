import express from "express";
import {
  getFunds,
  getFundById,
  createFund,
  deleteFund,
  modifyFund,
} from "../controllers/fund";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getFunds);
router.get("/:id", auth, getFundById);
router.post("/", auth, createFund);
router.patch("/:id", auth, modifyFund);
router.delete("/:id", auth, deleteFund);

export default router;
