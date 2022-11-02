import express from "express";
import { getCategories, getCategoryById, createCategory, deleteCategory, modifyCategory } from "../controllers/category";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getCategories);
router.get("/:id", auth, getCategoryById);
router.post("/", auth, createCategory);
router.patch("/:id", auth, modifyCategory);
router.delete("/:id", auth, deleteCategory);


export default router;
