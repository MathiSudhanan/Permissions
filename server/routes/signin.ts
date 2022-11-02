import express from "express";
import {
  signin,
  getCurrentUser
} from "../controllers/user";

const router = express.Router();


router.post("/", signin);
router.get('/',getCurrentUser)

export default router;
