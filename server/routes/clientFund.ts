import express from "express";
import {
  getClientFunds,
  getClientFundById,
  createClientFund,
  deleteClientFund,
  modifyClientFund,
} from "../controllers/clientFund";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getClientFunds);
router.get("/:id", auth, getClientFundById);
router.post("/", auth, createClientFund);
router.patch("/:id", auth, modifyClientFund);
router.delete("/:id", auth, deleteClientFund);

export default router;
