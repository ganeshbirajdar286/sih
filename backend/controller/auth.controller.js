import User from "../model/users.model.js";
import Doctor from "../model/doctor.model.js";
import { hash_Password } from "../config/password_hash.js";
import { jwtToken } from "../config/jwt.js";
import { comparePassword } from "../config/password_hash.js";
import { uploadFileToCloudinary } from "../config/cloudinary.config.js";
import Appointment from "../model/appointments.model.js";
import Reports from "../model/report.model.js";
import { cloudinary } from "../config/cloudinary.config.js";
import { HumanMessage } from "@langchain/core/messages";
import Dosha from "../model/dosha.model.js"
import {
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { threadId } from "node:worker_threads";
import DietChart from "../model/Dietchart.model.js";
import { populate } from "dotenv";

export const register = async (req, res) => {
  const {
    Name,
    Age,
    Email,
    Password,
    Gender,
    Height,
    Weight,
    isDoctor,
    Specialization,
    Experience,
  } = req.body;

  try {
    if (!Name || !Age || !Password || !Gender || !Email) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const files = req.files || [];

    const profileImageFile = files.find(
      (file) => file.fieldname === "profileImage",
    );

    const certificateFile = files.find(
      (file) => file.fieldname === "certificate",
    );

    const nameExits = await User.findOne({ Name });

    if (nameExits) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    let profileImageUrl = null;

    if (profileImageFile) {
      const uploadResult = await uploadFileToCloudinary(profileImageFile);
      profileImageUrl = uploadResult?.secure_url;
    }

    let certificateUrl = null;

    if (certificateFile) {
      const uploadResult = await uploadFileToCloudinary(certificateFile);

      certificateUrl = uploadResult?.secure_url;
    }

    const hashedPassword = await hash_Password(Password);

    let user = await User.create({
      Name,
      Age,
      Email,
      Password: hashedPassword,
      Gender,
      Height,
      Weight,
      isDoctor,
      Image_url: profileImageUrl,
    });

    let doctorProfile = null;

    if (isDoctor === "true") {
      if (!Specialization || !Experience) {
        return res.status(400).json({
          message: "Specialization & Experience required",
        });
      }

      if (!certificateUrl) {
        return res.status(400).json({
          message: "Certificate required",
        });
      }

      doctorProfile = await Doctor.create({
        User_id: user._id,
        Specialization,
        Certificates: certificateUrl,
        Experience,
      });
    }

    user = await User.findByIdAndUpdate(
      user._id,
      { Doctor_id: doctorProfile?._id },
      { new: true },
    );

   if(doctorProfile){
     const token = jwtToken(user?.id, doctorProfile?._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });
   }

    res.status(201).json({
      message: "Registration successful",
      responseData: user,
      autoLogin: isDoctor === "true",
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { Email, Password } = req.body;
    if (!Email || !Password) {
      return res.status(400).json({
        message: "Email and Password are required",
      });
    }

    const user = await User.findOne({
      Email,
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Name  or password",
      });
    }

    const isMatch = await comparePassword(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Email or password",
      });
    }
    const doctor = await Doctor.findOne({ User_id: user._id });

    const role = doctor ? "DOCTOR" : "USER";

    const token = jwtToken(user?._id, user?.Doctor_id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 365,
    });

    return res.status(200).json({
      message: "Login successful",
      role,
      responseData: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const DoctorUpdateProfile = async (req, res) => {
  try {
    const {
      Name,
      Email,
      PhoneNumber,
      Experience,
      Bio,
      Specialization,
      Qualifications,
      Clinic_Name,
      Consultation,
    } = req.body;

    const doctor = req.user;

    const user = await User.findOne({
      Doctor_id: doctor.doctor_id,
    }).populate({
      path: "Doctor_id",
    });

    if (!user) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const files = req.files || [];

    const profileImageFile = files.find(
      (file) => file.fieldname === "profileImage",
    );

    if (profileImageFile) {
      const uploadResult = await uploadFileToCloudinary(profileImageFile);

      user.Image_url = uploadResult?.secure_url;
    } else if (req.body.Image_url) {
      user.Image_url = req.body.Image_url;
    }

    if (Name) user.Name = Name;
    if (Email) user.Email = Email;
    if (PhoneNumber) user.PhoneNumber = PhoneNumber;

    if (Experience) user.Doctor_id.Experience = Experience;

    if (Bio) user.Doctor_id.Bio = Bio;

    if (Specialization) user.Doctor_id.Specialization = Specialization;

    if (Qualifications) user.Doctor_id.Qualifications = Qualifications;

    if (Clinic_Name) user.Doctor_id.Clinic_Name = Clinic_Name;

    if (Consultation) user.Doctor_id.Consultation = Consultation;

    await user.save();
    await user.Doctor_id.save();

    return res.status(200).json({
      message: "User profile updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const PatientUpdateProfile = async (req, res) => {
  try {
    const { Name,PhoneNumber, Age, Height, Weight } =
      req.body;

    const files = req.files|| [];
  
     const profileImageFile = files.find(
      (file) => file.fieldname === "profileImage",
    );


    const patient = req.user;
    const user = await User.findOne({ _id: patient?.userId });

    if (!user) {
      return res.status(404).json({ message: "Patient  not found" });
    }

    if (profileImageFile) {
      const uploadResult = await uploadFileToCloudinary(profileImageFile);
      user.Image_url  = uploadResult?.secure_url;
    }

    if (Name) user.Name = Name;
    if (PhoneNumber) user.PhoneNumber = PhoneNumber;
    if (Age) user.Age = Age;
    if (Height) user.Height = Height;
    if (Weight) user.Weight = Weight;
    

    await user.save();

    return res.json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // localhost
    });

    return res.status(200).json({
      message: "User logout successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const alldoctor = async (req, res) => {
  try {
    const doctors = await Doctor.find().populate("User_id", "Name Image_url");
    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Doctor fetch error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
};

export const getSingleDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate("User_id");

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    res.status(200).json(doctor);
  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};

export const patientAppointment = async (req, res) => {
  try {
    const { Appointment_Date, Time_slot, Condition } = req.body;

    const DOCTOR = req.params.id;
    const Patient = req.user.userId;

    if (!Appointment_Date || !Time_slot || !Condition) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const appointment = await Appointment.create({
      Appointment_Date,
      Time_slot,
      Doctor_id: DOCTOR,
      Patient_id: Patient,
      Condition,
    });

    return res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const updatePatientAppointment = async (req, res) => {
  try {
    const { Appointment_Date, Time_slot } = req.body;

    const appointment = req.params.id;
    const Patient = req.user.userId;

    if (!Appointment_Date || !Time_slot) {
      return res.status(400).json({ message: "All fields required" });
    }

    const UpdatedAppointment = await Appointment.findByIdAndUpdate(
      appointment,
      {
        Appointment_Date,
        Time_slot,
      },
      {
        new: true,
      },
    );

    return res.status(201).json({
      message: "Appointment Updated successfully",
      UpdatedAppointment,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const createReport = async (req, res) => {
  try {
    const { Title, Category } = req.body;
    const patientId = req.params.id;
    if (!patientId) {
      return res.status(400).json({
        message: "Patient not found",
      });
    }
    const doctor = req.user.doctor_id;
    if (!doctor) {
      return res.status(400).json({
        message: "Doctor not found",
      });
    }

    const files = req.files || [];
    if (!Title || !Category) {
      return res.status(400).json({
        message: "Title and Category are required",
      });
    }

    const reportFile = files.find((file) => file.fieldname === "report");

    if (!reportFile) {
      return res.status(400).json({
        message: "Report file is required",
      });
    }

    let reportUrl = null;
    let reportPublicId = null;

    if (reportFile) {
      const uploadedResult = await uploadFileToCloudinary(reportFile);

      reportUrl = uploadedResult.secure_url;
      reportPublicId = uploadedResult.public_id;
    }
    const report = await Reports.create({
      Patient_id: patientId,
      Doctor_id: doctor,
      Title,
      Category,
      File_url: reportUrl,
      Cloudinary_public_id: reportPublicId,
    });

    await User.findByIdAndUpdate(
      patientId,
      {
        $addToSet: { Medical_records: report._id },
      },
      { new: true },
    );

    return res.status(201).json({
      message: "Report uploaded successfully",
      report,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// export const DeleteReport = async (req, res) => {
//   try {
//     const patientId = req.user.userId;
//     const { reportId } = req.params;

//     const report = await PatientReport.findById(reportId);

//     if (!report) {
//       return res.status(404).json({ message: "Report not found" });
//     }

//     if (report.Patient_id.toString() !== patientId.toString()) {
//       return res
//         .status(403)
//         .json({ message: "You are not allowed to delete this report" });
//     }

//     // ✅ 1) delete from cloudinary
//     await cloudinary.uploader.destroy(report.Cloudinary_public_id, {
//       resource_type: "raw",
//     });

//     // ✅ 2) delete from mongodb
//     await PatientReport.findByIdAndDelete(reportId);

//     return res.status(200).json({ message: "Report deleted successfully" });
//   } catch (error) {
//     return res
//       .status(500)
//       .json({ message: "Server error", error: error.message });
//   }
// };

export const myPatient = async (req, res) => {
  try {
    const patient = await Appointment.find({
      Doctor_id: req.user.doctor_id,
    }).populate(
      "Patient_id",
      "Name Age Image_url Email PhoneNumber Condition Dosha",
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "No patient found for this doctor",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export const Doctor_selected_appointment = async (req, res) => {
  try {
    const appointmentid = req.params.id;
    const { Status } = req.body;
    if (!appointmentid) {
      return res.status(404).json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentid,
      { Status },
      { new: true },
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "appointment status  updated successfully",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const llm = new ChatGroq({
  apiKey: process.env.GROQ_APT_KEY,
  model: "openai/gpt-oss-120b",
  temperature: 0,
  maxRetries: 2,
});

async function generateDiet(state) {
  console.log("Generating Diet Chart...");

  const userPrompt = state.messages.at(-1).content;

 const prompt = `
You are an Ayurvedic diet expert doctor.

Generate STRICT and MINIMAL JSON diet chart.

Patient Details:
${userPrompt}

Rules:
- Create ONLY ONE daily_plan.
- This same plan will be followed for 90 days.
- Keep everything concise.
- Use short phrases only.
- No long explanations.
- Ingredients max 5.
- Instructions max 12 words.
- Keep nutrition values realistic numbers.
- Keep ayurveda_effects one-word or two-word only.

Return JSON in EXACT structure:

{
  "duration_days": 90,
  "lifestyle": {
    "Meal_Frequency": "",
    "Bowel_Movement": "",
    "Water_Intake": ""
  },
  "daily_plan": {
    "breakfast": {
      "recipe_name": "",
      "ingredients": [],
      "instructions": "",
      "nutrition": {
        "calories": 0,
        "protein_g": 0,
        "carbs_g": 0,
        "fat_g": 0,
        "fiber_g": 0
      },
      "ayurveda_effects": {
        "vata": "",
        "pitta": "",
        "kapha": ""
      }
    },
    "lunch": {},
    "dinner": {}
  },
  "note": ""
}

Important:
- No markdown.
- No comments.
- No extra text.
- No trailing commas.
- Keep response under 1000 words.
- Ensure JSON is complete and closed.

Return ONLY valid JSON.
`;

  const response = await llm.invoke([new HumanMessage(prompt)]);

  return {
    messages: [response],
  };
}

const workflow = new StateGraph(MessagesAnnotation)
  .addNode("dietAgent", generateDiet)

  .addEdge("__start__", "dietAgent")
  .addEdge("dietAgent", "__end__");

const app = workflow.compile({});

export const dietChart = async (req, res) => {
  try {
    const { Email, Age, Gender, Dosha } = req.body;
  

    if (!Age || !Gender || !Dosha) {
      return res.status(400).json({
        success: false,
        message: "All patient fields required",
      });
    }

    const user = await User.findOne({ Email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const input = {
      messages: [
        new HumanMessage(`
Patient Email: ${Email}
Age: ${Age}
Gender: ${Gender}
Dosha Type: ${Dosha}
Generate 90 days Ayurvedic diet chart JSON.
        `),
      ],
    };

    const result = await app.invoke(input);

    // 🧹 Clean AI JSON
    function cleanAIJSON(text) {
      return text
        .replace(/```json|```/g, "")
        .replace(/\/\/.*$/gm, "")
        .replace(/½/g, "0.5")
        .replace(/¼/g, "0.25")
        .replace(/¾/g, "0.75")
        .trim();
    }

    const aiText = result.messages.at(-1).content;
    const cleaned = cleanAIJSON(aiText);
    const json = JSON.parse(cleaned);

    const diet = await DietChart.create({
      Patient_id: user._id,
      Doctor_id: req.user.doctor_id,
      duration_days: json.duration_days,

      patient: json.patient,

      lifestyle: json.lifestyle,

      daily_plan: json.daily_plan,


      note: json.note,
    });

    res.status(201).json({
      success: true,
      dietChart: diet,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Error generating AI diet chart",
    });
  }
};

export const getDoctorBookedSlots = async (req, res) => {
  try {
    const doctor = req.params.id;
    const patient = await Appointment.find({
      Doctor_id: doctor,
    }).populate(
      "Patient_id",
      "Name Age Image_url Email PhoneNumber Condition Dosha",
    );

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "No patient found for this doctor",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const patient_appoinment_detail = async (req, res) => {
  try {
    const patientId = req.user.userId;
    if (!patientId) {
      return res.status(404).json({
        message: "patient not found ",
      });
    }

    const appointment = await Appointment.find({
      Patient_id: patientId,
    }).populate({
      path: "Doctor_id",
      populate: {
        path: "User_id",
      },
    });
    return res.status(200).json({
      success: true,
      count: appointment.length,
      appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const delete_appointment = async (req, res) => {
  const id = req.params.id;

  try {
    const deletedAppointment = await Appointment.findByIdAndDelete(id);

    if (!deletedAppointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Appointment deleted successfully.",
      data: deletedAppointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the appointment.",
      error: error.message,
    });
  }
};

export const all_patient_report = async (req, res) => {
  try {
    const user = req.user.userId;
    if (!user) {
      return res.status(200).json({
        message: "User not found ",
      });
    }
    const report = await PatientReport.find({ Patient_id: user });
  } catch (error) {}
};

export const getReport=async(req,res)=>{
  try {
    const user=req.user.userId;

   if (!user) {
      return res.status(400).json({
        message: "Patient not found",
      });
    }
 
    const report= await User.find({_id:user}).populate({
        path: "Medical_records",      
         populate: {
      path: "Doctor_id",
      populate: {
        path: "User_id",
        model: "User",
        select: "Name Image_url Email",
      },
    },
      });
    return res.status(200).json({
      success:true,
      message:"report found successfully",
      report
    })
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}


export const getDoshaStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    const last = user.lastFilledAt;

    if (!last) {
      return res.json({ mustFill: true });
    }

    const diffDays =
      (Date.now() - new Date(last)) /
      (1000 * 60 * 60 * 24);

    if (diffDays >= 7) {
      return res.json({ mustFill: true });
    }

    res.json({ mustFill: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const submitDosha = async (req, res) => {
  try {
    const {
      prakriti,
      vikriti,
      dominantPrakriti,
      dominantVikriti,
    } = req.body;

    const data = await Dosha.create({
      Patient_id: req.user.userId,

      doshaAssessment: {
        prakriti,
        vikriti,
        dominantPrakriti,
        dominantVikriti,
      },
    });

    
    const user = await User.findByIdAndUpdate(
  req.user.userId,
  {
    Dosha: data._id,   
    lastFilledAt: new Date(),  
  },
  { new: true }             
);


    res.status(200).json({
      message: "Dosha assessment saved",
      data,
    });

  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};


export const getdosha=async(req,res)=>{
  try {
    const user=req.user.userId;
    if(!user){
      return res.status(400).json({
        message:"Patient not found"
      })
    }

    const dosha =await Dosha.find({Patient_id:user});
    return res.status(200).json({
      success:true,
      dosha 
    })

  } catch (error) {
    res.status(500).json({
      error: err.message,
    });
  }
}

export const patient=async(req,res)=>{
  try {
    const user= req.user.userId;
    if(!user){
      return res.status(400).json({
        message:"Patient not found"
      })
    }
    const patient=await User.find({_id:user});

    return res.status(200).json({
      success:true,
      patient
    })

  } catch (error) {
    res.status(500).json({
      error: err.message,
    });
  }
}

export const patient_diet_chart = async (req, res) => {
  try {
    const patientId = req.user.userId;
    

    if (!patientId) {
      return res.status(400).json({
        message: "Patient not found",
      });
    }

    const latestDietChart = await DietChart
      .findOne({
        Patient_id:patientId,
      })
      .sort({ createdAt: -1 })   // Latest first

    res.status(200).json({
      success: true,
      dietChart: latestDietChart,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

export const single_Patient = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Patient ID is required",
      });
    }

    const patient = await User.findById(id)
      .select("Name Age Email Gender Height Weight Medical_records Image_url  Dosha ")
      .populate("Medical_records  Dosha");
      

    if (!patient) {
      return res.status(404).json({
        success: false,
        message: "Patient not found",
      });
    }

    return res.status(200).json({
      success: true,
      patient,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
