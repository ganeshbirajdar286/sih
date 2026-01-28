import express from "express";
import { DoctorUpdateProfile, login, logout, patientAppointment, PatientUpdateProfile, register, updatePatientAppointment } from "../controller/auth.controller.js";
import { isLogin } from "../middleware/auth.middleware.js";
import { multerMiddleWare } from '../config/cloudinary.config.js';

const router=express.Router();
router.post("/register",register);
router.post("/login",login);
router.post("/update/doctorprofile",isLogin,multerMiddleWare,DoctorUpdateProfile)
router.post("/update/patientprofile",isLogin,multerMiddleWare,PatientUpdateProfile)
router.get("/logout",isLogin,logout)
router.post("/appointment/patient/:id",isLogin,patientAppointment)
router.post("/updatedappointment/patient/:id",isLogin,updatePatientAppointment)

export default router;