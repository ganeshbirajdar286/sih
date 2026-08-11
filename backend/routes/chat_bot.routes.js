import express from "express"
import { chatBot } from "../controller/chat.controller.js";

const router= express.Router();

router.post("/chat",chatBot)

export default router