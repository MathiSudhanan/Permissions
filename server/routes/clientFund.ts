import express from "express";
import {
  getClientFunds,
  getClientFundById,
  createClientFund,
  deleteClientFund,
  modifyClientFund,
  getClientFundsByCompanyId,
} from "../controllers/clientFund";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getClientFunds);
router.get("/:id", auth, getClientFundById);
router.get("/cug/:companyId", auth, getClientFundsByCompanyId);
router.post("/", auth, createClientFund);
router.patch("/:id", auth, modifyClientFund);
router.delete("/:id", auth, deleteClientFund);

export default router;
