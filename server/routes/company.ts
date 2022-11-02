import express from "express";
import {
  getCompanies,
  getCompanyById,
  createCompany,
  deleteCompany,
  modifyCompany,
} from "../controllers/company";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getCompanies);
router.get("/:id", auth, getCompanyById);
router.post("/", auth, createCompany);
router.patch("/:id", auth, modifyCompany);
router.delete("/:id", auth, deleteCompany);

export default router;
