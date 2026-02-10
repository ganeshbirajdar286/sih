import express, { Router } from "express";
import { alldoctor, dietChart, Doctor_selected_appointment, DoctorUpdateProfile, getDoctorBookedSlots, getSingleDoctor, login, logout, myPatient, patientAppointment, PatientDeleteReport, patientReport, PatientUpdateProfile, register,  updatePatientAppointment } from "../controller/auth.controller.js";
import { isLogin } from "../middleware/auth.middleware.js";
import { multerMiddleWare } from '../config/cloudinary.config.js';

const router=express.Router();
router.post("/register",multerMiddleWare,register);
router.post("/login",login);
router.post("/update/doctorprofile",isLogin,multerMiddleWare,DoctorUpdateProfile)
router.post("/update/patientprofile",isLogin,multerMiddleWare,PatientUpdateProfile)
router.post("/logout",isLogin,logout)
router.get("/patient/doctor",isLogin,alldoctor)
router.get("/patient/singledoctor/:id",isLogin,getSingleDoctor)
router.get("/patient/appointments/:id",isLogin,getDoctorBookedSlots);
router.post("/appointment/patient/:id",isLogin,patientAppointment)
router.post("/updatedappointment/patient/:id",isLogin,updatePatientAppointment)
router.post("/report/patient",isLogin,multerMiddleWare,patientReport)
router.delete("/patientreport/:reportId",isLogin,PatientDeleteReport)
router.get("/doctor/mypatient",isLogin,myPatient);
router.post("/doctor/appointment/:id",isLogin,Doctor_selected_appointment)
router.post("/doctor/dietchart",isLogin,dietChart)

export default router;