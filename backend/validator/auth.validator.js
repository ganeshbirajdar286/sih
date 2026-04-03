import {body} from "express-validator"

export const registerValidator=[
    body("Name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({min:3}).withMessage("Name must be at least 3 characters"),

  body("Email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email"),

   body("Password")
    .notEmpty().withMessage("Password is required")
    .isStrongPassword().withMessage("Strong Password needed"), 
    
    body("Age")
    .notEmpty().withMessage("Age is required")
    .isInt({ min: 1 }).withMessage("Age must be a number"),

    body("Gender")
    .notEmpty().withMessage("Gender is required")
    .isIn(["Male","Female","Other"])
    .withMessage("Gender must be Male, Female, or Other"),

    body("Height")
    .isFloat().withMessage("Height must be a number")
    .notEmpty().withMessage("Height is required"),
     
    body("Weight")
    .isFloat().withMessage("Height must be a number")
    .notEmpty().withMessage("Height is required"),

     body("isDoctor")
    .optional()
    .isBoolean().withMessage("isDoctor must be true or false"),

    body("Specialization")
    .if(body("isDoctor").equals("true"))
    .notEmpty().withMessage("Specialization required for doctor")
    .isIn([ "Allergist", "Anesthesiologist", "Cardiologist", "Colorectal Surgeon",
  "Dermatologist", "Endocrinologist", "Family Doctor", "Gastroenterologist",
  "General Physician", "Geriatrician", "Hematologist", "Infectious Disease Physician",
  "Internal Medicine", "Nephrologist", "Neurologist",
  "Obstetrics and Gynaecology", "Oncologist", "Ophthalmologist",
  "Orthopedics", "Pediatrician", "Psychiatrist", "Radiologist",
  "Surgeon", "Urologist",]),

     body("Experience")
    .if(body("isDoctor").equals("true"))
    .notEmpty().withMessage("Experience required for doctor"),
]

export const loginValidator=[
    body("Email")
    .notEmpty().withMessage("Email is required ")
     .isEmail().withMessage("Invalid email"),

     body("Password")
     .notEmpty().withMessage("Password is required")
     .isStrongPassword().withMessage("Required Strong Password")
]

export const submitDoshaValidator=[
  body("prakriti.vata")
    .notEmpty().withMessage("Prakriti vata required")
    .isInt({ min: 0, max: 100 }).withMessage("Must be 0–100"),

  body("prakriti.pitta")
    .notEmpty().withMessage("Prakriti pitta required")
    .isInt({ min: 0, max: 100 }),

  body("prakriti.kapha")
    .notEmpty().withMessage("Prakriti kapha required")
    .isInt({ min: 0, max: 100 }),


  body("vikriti.vata")
    .notEmpty().withMessage("Vikriti vata required")
    .isInt({ min: 0, max: 100 }),

  body("vikriti.pitta")
    .notEmpty().withMessage("Vikriti pitta required")
    .isInt({ min: 0, max: 100 }),

  body("vikriti.kapha")
    .notEmpty().withMessage("Vikriti kapha required")
    .isInt({ min: 0, max: 100 }),

 body("prakriti").custom((value) => {
    const total = value.vata + value.pitta + value.kapha;
    if (total !== 100) {
      throw new Error("Prakriti must total 100");
    }
    return true;
  }),

  body("vikriti").custom((value) => {
    const total = value.vata + value.pitta + value.kapha;
    if (total !== 100) {
      throw new Error("Vikriti must total 100");
    }
    return true;
  }),

  body("dominantPrakriti")
    .notEmpty().withMessage("dominantPrakriti required")
    .isIn(["vata", "pitta", "kapha"])
    .withMessage("Invalid dominantPrakriti"),

  body("dominantVikriti")
    .notEmpty().withMessage("dominantVikriti required")
    .isIn(["vata", "pitta", "kapha"])
    .withMessage("Invalid dominantVikriti"),
]

export const PatientUpdateProfileValidator = [

  body("PhoneNumber")
    .optional()
    .trim()
    .matches(/^[6-9]\d{9}$/)
    .withMessage("Invalid Indian phone number"),

  body("Name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("Age")
    .isInt({ min: 1 })
    .withMessage("Age must be a valid number"),

  body("Height")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Height must be a valid number"),

  body("Weight")
    .optional()
    .isFloat({ min: 1 })
    .withMessage("Weight must be a valid number"),
];

export const patientAppointmentValidator=[
  body("Appointment_Date")
    .notEmpty().withMessage("Appointment date is required")
    .bail() // Stops further validation if previous one fails
    .isISO8601().withMessage("Invalid date format (YYYY-MM-DD)")
    .custom((value) => {
      const today = new Date();
      const inputDate = new Date(value);

    if (inputDate < today.setHours(0,0,0,0)) {  //Hours = 0,Minutes = 0,Seconds = 0,Milliseconds = 0
        throw new Error("Date cannot be in the past");
      }
      return true;
    }),

  body("Time_slot")
    .notEmpty().withMessage("Time slot is required")
    .bail()
    .isIn([
        "09:00-10:00",
        "10:15-11:15",
        "11:30-12:30",
        "14:00-15:00",
        "15:15-16:15",
        "16:30-17:30",
        "17:45-18:45",
        "19:00-20:00",
        "20:15-21:15",
      ])
    .withMessage("Invalid time slot")
    .custom((value, { req }) => {
  const today = new Date();
  const inputDate = new Date(req.body.Appointment_Date);

  // if same day
  if (inputDate.toDateString() === today.toDateString()) {
    const currentTime = today.getHours() * 60 + today.getMinutes();

    const [start] = value.split("-");
    const [h, m] = start.split(":").map(Number);

    const slotTime = h * 60 + m;

    if (slotTime <= currentTime) {
      throw new Error("Cannot book past time slot");
    }
  }

  return true;
}),

  body("Condition")
    .notEmpty().withMessage("Condition is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Condition must be at least 3 characters"),
]

export const updatePatientAppointmentValidator=[
  body("Appointment_Date")
  .notEmpty().withMessage("Appointment Date is required")
  .bail()
  .isISO8601().withMessage("Invalid date format (YYYY-MM-DD)")
  .custom((value)=>{
    const inputdate=new Date(value);
    const todayDate=new Date().setHours(0,0,0,0);
    if(inputdate<todayDate){
       throw new Error("Date cannot be in the past");
    }
    return true;
  }),

   body("Time_slot")
    .notEmpty().withMessage("Time slot is required")
    .bail()
    .isIn([
        "09:00-10:00",
        "10:15-11:15",
        "11:30-12:30",
        "14:00-15:00",
        "15:15-16:15",
        "16:30-17:30",
        "17:45-18:45",
        "19:00-20:00",
        "20:15-21:15",
      ])
    .withMessage("Invalid time slot")
    .custom((value, { req }) => {
  const today = new Date();
  const inputDate = new Date(req.body.Appointment_Date);

  // if same day
  if (inputDate.toDateString() === today.toDateString()) {
    const currentTime = today.getHours() * 60 + today.getMinutes();

    const [start] = value.split("-");
    const [h, m] = start.split(":").map(Number);

    const slotTime = h * 60 + m;

    if (slotTime <= currentTime) {
      throw new Error("Cannot book past time slot");
    }
  }

  return true;
})

]

export const  addOrUpdateReviewValidator=[
 body("rating")
  .notEmpty().withMessage("Rating is required")
  .bail()
  .isInt({ min: 0, max: 5 })
  .withMessage("Rating must be between 0 and 5"),

  body("comment")
  .notEmpty().withMessage("Comment is required")
  .bail()
  .trim()
   .isLength({ min: 3, max: 500 })
  .withMessage("Comment must be between 3 and 500 characters")
  .escape(),
]

export const createReportValidator=[
  body("Title")
  .notEmpty().withMessage("Title is required")
  .trim()
  .isLength({min:3,max:500}).withMessage("Title must be between 3 to 500")
  .escape(),

  body("Category").
  notEmpty().withMessage("Category is required")
  .bail()
  .isIn(["All Reports", "Lab Reports", "Imaging", "Diagnostic"]).withMessage("invalid Category")

]

export const DoctorUpdateProfileValidator = [
  body("Name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters")
    .escape(),

  body("Email")
    .optional()
    .isEmail().withMessage("Invalid email format"),

  body("PhoneNumber")
    .optional({ values: "falsy" })
    .isMobilePhone("en-IN")
    .withMessage("Invalid Indian phone number"),

  body("Experience")
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage("Experience must be between 0 and 50 years"),

  body("Bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio must not exceed 500 characters")
    .escape(),

  body("Specialization")
    .optional()
    .trim()
    .isIn([
      "Cardiologist",
      "Dermatologist",
      "Neurologist",
      "Orthopedic",
      "General Physician"
    ])
    .withMessage("Invalid specialization"),

  body("Qualifications")
     .optional({ values: "falsy" }) //ignore "", null, undefined
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Qualifications must be valid")
    .escape(),

  body("Clinic_Name")
     .optional({ values: "falsy" })
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Clinic name must be valid")
    .escape(),

  body("Consultation")
     .optional({ values: "falsy" })
    .isFloat({ min: 0 })
    .withMessage("Consultation fee must be a valid number"),
];

export const dietChartValidator=[
  body("Age")
    .notEmpty().withMessage("Age is reequired")
    .bail()
    .isInt({ min: 0 }).withMessage("Age must be number "),

  body("Gender")
    .notEmpty()
    .bail()
    .isIn(["male", "female", "other"]).withMessage("Invalid Gender"),

  body("Dosha")
    .notEmpty()
    .bail()
    .isIn(["vata", "pitta", "kapha"]).withMessage("Invaild  Dosha"),

  body("Email")
    .notEmpty().withMessage("Email is required")
    .bail()
    .isEmail().withMessage("Invalid Email")
]