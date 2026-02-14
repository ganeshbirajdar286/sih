import express, { Router } from "express";
import {
  alldoctor,
  createReport,
  delete_appointment,
  dietChart,
  Doctor_selected_appointment,
  DoctorUpdateProfile,
  getDoctorBookedSlots,
  getReport,
  getSingleDoctor,
  login,
  logout,
  myPatient,
  patient_appoinment_detail,
  patientAppointment,
 // PatientDeleteReport,
  PatientUpdateProfile,
  register,
  updatePatientAppointment,
  getDoshaStatus,
   submitDosha,
   getdosha
} from "../controller/auth.controller.js";
import { isLogin } from "../middleware/auth.middleware.js";
import { multerMiddleWare } from "../config/cloudinary.config.js";

const router = express.Router();

router.post("/register", multerMiddleWare, register);
router.post("/login", login);
router.post("/logout", isLogin, logout);
router.get("/status", isLogin, getDoshaStatus);
router.post("/submit", isLogin, submitDosha);

// patient route
router.post(
  "/update/patientprofile",
  isLogin,
  multerMiddleWare,
  PatientUpdateProfile,
);
router.get("/patient/doctor", isLogin, alldoctor);
router.get("/patient/singledoctor/:id", isLogin, getSingleDoctor);
router.get("/patient/appointments/:id", isLogin, getDoctorBookedSlots);
router.get("/patient/schedule", isLogin, patient_appoinment_detail);
router.get("/patient/getreport",isLogin,getReport)
router.get("/patient/getdosha",isLogin,getdosha)
router.post("/appointment/patient/:id", isLogin, patientAppointment);
router.post(
  "/updatedappointment/patient/:id",
  isLogin,
  updatePatientAppointment,
);
//router.delete("/patientreport/:reportId", isLogin, PatientDeleteReport);
router.delete("/patient/deleteappointment/:id", isLogin, delete_appointment);



// doctor  route
router.post(
  "/update/doctorprofile",
  isLogin,
  multerMiddleWare,
  DoctorUpdateProfile,
);
router.get("/doctor/mypatient", isLogin, myPatient);
router.post("/doctor/appointment/:id", isLogin, Doctor_selected_appointment);
router.post("/doctor/dietchart", isLogin, dietChart);
router.post("/doctor/createreport/:id", isLogin, multerMiddleWare, createReport);



export default router;
