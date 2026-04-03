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
  getdosha,
  patient,
  patient_diet_chart,
  single_Patient,
  getdietchart,
  addOrUpdateReview,
  getDoctorReviews,
  getprofile,
  updateDietChart,
  getDietchartById,
} from "../controller/auth.controller.js";
import { isLogin } from "../middleware/auth.middleware.js";
import { multerMiddleWare } from "../config/cloudinary.config.js";
import {
  addOrUpdateReviewValidator,
  createReportValidator,
  dietChartValidator,
  DoctorUpdateProfileValidator,
  loginValidator,
  patientAppointmentValidator,
  PatientUpdateProfileValidator,
  registerValidator,
  submitDoshaValidator,
  updatePatientAppointmentValidator,
} from "../validator/auth.validator.js";
import { validate } from "../middleware/Validate.js";

const router = express.Router();

router.post(
  "/register",
  multerMiddleWare,
  registerValidator,
  validate,
  register,
);
router.post("/login", loginValidator, validate, login);
router.post("/logout", isLogin, logout);
router.get("/status", isLogin, getDoshaStatus);
router.post("/submit", isLogin, submitDoshaValidator, validate, submitDosha);





// patient route
router.post(
  "/update/patientprofile",
  isLogin,
  multerMiddleWare,
  PatientUpdateProfileValidator,
  validate,
  PatientUpdateProfile,
);
router.get("/patient/doctor", isLogin, alldoctor);
router.get("/patient/singledoctor/:id", isLogin, getSingleDoctor);
router.get("/patient/appointments/:id", isLogin, getDoctorBookedSlots);
router.get("/patient", isLogin, patient);
router.get("/patient/schedule", isLogin, patient_appoinment_detail);
router.get("/patient/getreport", isLogin, getReport);
router.get("/patient/getdosha", isLogin, getdosha);
router.get("/patient/dietchart", isLogin, patient_diet_chart);
router.post(
  "/appointment/patient/:id",
  isLogin,
  patientAppointmentValidator,
  validate,
  patientAppointment,
);
router.post(
  "/updatedappointment/patient/:id",
  isLogin,
  updatePatientAppointmentValidator,
  validate,
  updatePatientAppointment,
);
//router.delete("/patientreport/:reportId", isLogin, PatientDeleteReport);
router.delete("/patient/deleteappointment/:id", isLogin, delete_appointment);
router.post(
  "/patient/review/:id",
  isLogin,
  addOrUpdateReviewValidator,
  validate,
  addOrUpdateReview,
);
router.get("/patient/doctor/reviews/:id", getDoctorReviews);




// doctor  route
router.post(
  "/update/doctorprofile",
  isLogin,
  multerMiddleWare,
  DoctorUpdateProfileValidator,validate,
  DoctorUpdateProfile,
);
router.get("/doctor/mypatient", isLogin, myPatient);
router.post("/doctor/appointment/:id", isLogin, Doctor_selected_appointment);
router.post("/doctor/dietchart", isLogin,dietChartValidator,validate, dietChart);
router.post(
  "/doctor/createreport/:id",
  isLogin,
  multerMiddleWare,
  createReportValidator,validate,
  createReport,
);
router.delete("/doctor/deleteappointment/:id", isLogin, delete_appointment);
router.get("/doctor/patient/:id", isLogin, single_Patient);
router.get("/doctor/getdietcharts", isLogin, getdietchart);
router.get("/doctor/getdietchart/:id",isLogin,getDietchartById);
router.get("/doctor/profile", isLogin, getprofile);
router.put("/doctor/updatedietchart/:id", updateDietChart);

export default router;
