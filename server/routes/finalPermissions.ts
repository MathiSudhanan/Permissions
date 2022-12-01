import express from "express";
import {
 getFinalPermissions
} from "../controllers/finalPermissions";

const auth = require("../lib/auth");

const router = express.Router();

router.get("/:clientFundId/:userId", auth, getFinalPermissions);

export default router;