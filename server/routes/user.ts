import express from "express";
import { getUsers, createUser, getCurrentUser } from "../controllers/user";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/", auth, getUsers);
router.get("/CurrentUser", auth, getCurrentUser);

router.post("/", createUser);

export default router;
