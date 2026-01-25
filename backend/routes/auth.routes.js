import express from "express";
import { DoctorUpdateProfile, login, logout, PatientUpdateProfile, register } from "../controller/auth.controller.js";
import { isLogin } from "../middleware/auth.middleware.js";
import { multerMiddleWare } from '../config/cloudinary.config.js';

const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.post("/update/doctorprofile",isLogin,multerMiddleWare,DoctorUpdateProfile)
router.post("/update/patientprofile",isLogin,multerMiddleWare,PatientUpdateProfile)
router.get("/logout",isLogin,logout)

export default router;