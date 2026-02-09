import User from "../model/users.model.js";
import Doctor from "../model/doctor.model.js";
import { hash_Password } from "../config/password_hash.js";
import { jwtToken } from "../config/jwt.js";
import { comparePassword } from "../config/password_hash.js";
import { uploadFileToCloudinary } from "../config/cloudinary.config.js";
import Appointment from "../model/appointments.model.js";
import PatientReport from "../model/patient_reports.model.js";
import { cloudinary } from "../config/cloudinary.config.js";
import { HumanMessage } from "@langchain/core/messages";
import {
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { threadId } from "node:worker_threads";
import DietChart from "../model/Dietchart.model.js";

export const register = async (req, res) => {
  const {
    Name,
    Age,
    Password,
    Gender,
    Height,
    Weight,
    isDoctor,
    Specialization,
    Dosha,
    Experience,
  } = req.body;
  try {
    if (!Name || !Age || !Password || !Gender) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }
     const file=req.file;

    const nameExits = await User.findOne({ Name });


    if (nameExits) {
      return res.status(400).json({
        message: "User already exits ",
      });
    }

    let certificateUrl=null;
     if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
        certificateUrl = uploadResult?.secure_url;
    } 
    const hashedPassword = await hash_Password(Password);

    let user = await User.create({
      Name,
      Age,
      Password: hashedPassword,
      Gender,
      Height,
      Weight,
      Dosha,
      isDoctor,
    });

    let doctorProfile = null;

    if (isDoctor === "true") {
      console.log(Specialization);
      if (!Specialization) {
        return res.status(400).json({
          message: "Specialization required for doctor",
        });
      }

       if (!Experience) {
    return res.status(400).json({
      message: "Experience required for doctor",
    });
  }

  if (!certificateUrl) {
    return res.status(400).json({
      message: "Certificate upload required",
    });
  }

      doctorProfile = await Doctor.create({
        User_id: user?._id,
        Specialization,
        Certificates:certificateUrl,
        Experience,
      });
    }

    user = await User.findByIdAndUpdate(
      user?._id,
      { Doctor_id: doctorProfile?._id },
      { new: true },
    );

    const token = jwtToken(user?.id, doctorProfile?._id);
   res.cookie("token", token, {
  httpOnly: true,
  secure: false,     // localhost
  sameSite: "lax",   // localhost
  maxAge: 1000 * 60 * 60 * 24 * 365,
});


    res.status(201).json({
      message: "Registration successful",
         responseData:user
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
    const { Name, Password } = req.body;
    if (!Name || !Password) {
      return res.status(400).json({
        message: "Name and Password are required",
      });
    }

    const user = await User.findOne({
      Name: { $regex: new RegExp(`^${Name}$`, "i") },
    });
    if (!user) {
      return res.status(401).json({
        message: "Invalid Name  or password",
      });
    }

    const isMatch = await comparePassword(Password, user.Password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Name or password",
      });
    }
    const doctor = await Doctor.findOne({ User_id: user._id });

    const role = doctor ? "DOCTOR" : "USER";

    // 5) Create JWT token
    const token = jwtToken(user?._id, user?.Doctor_id);

 res.cookie("token", token, {
  httpOnly: true,
  secure: false,     // localhost
  sameSite: "lax",   // localhost
  maxAge: 1000 * 60 * 60 * 24 * 365,
});


    // 6) Send response
    return res.status(200).json({
      message: "Login successful",
      role,
      responseData:user
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
    const user = await User.findOne({ Doctor_id: doctor.doctor_id }).populate({
      path: "Doctor_id",
    });

    const file = req.file;

    if (!user) {
      return res.status(404).json({ message: "doctor not found" });
    }
    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
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

    return res.status(200).json({
      message: "user profile updated succesfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

export const PatientUpdateProfile = async (req, res) => {
  try {
    const { Name, Email, PhoneNumber, Age, Password, Height, Weight } =
      req.body;

    const file = req.file;

    const patient = req.user;
    const user = await User.findOne({ _id: patient?.userId });

    if (!user) {
      return res.status(404).json({ message: "Patient  not found" });
    }

    if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      user.Image_url = uploadResult?.secure_url;
    } else if (req.body.Image_url) {
      user.Image_url = req.body.Image_url;
    }

    if (Name) user.Name = Name;
    if (Email) user.Email = Email;
    if (PhoneNumber) user.PhoneNumber = PhoneNumber;
    if (Age) user.Age = Age;
    if (Password) user.Password = Password;
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



export const patientAppointment = async (req, res) => {
  try {
    const { Appointment_Date, Time_slot, Condition } = req.body;

    const DOCTOR = req.params.id;
    const Patient = req.user.userId;

    if ((!Appointment_Date || !Time_slot, !Condition)) {
      return res.status(400).json({ message: "All fields required" });
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

export const patientReport = async (req, res) => {
  try {
    const { Title, Category } = req.body;
    const pateintId = req.user.userId;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "File is required" });
    }

    if (!Title || !Category) {
      return res
        .status(400)
        .json({ message: "Title and Category are required" });
    }

    const uploadResult = await uploadFileToCloudinary(file);

    const report = await PatientReport.create({
      Patient_id: pateintId,
      Title,
      Category,
      File_url: uploadResult.secure_url,
      Cloudinary_public_id: uploadResult.public_id,
    });
    return res.status(201).json({
      message: "Report uploaded successfully",
      report,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
export const PatientDeleteReport = async (req, res) => {
  try {
    const patientId = req.user.userId;
    const { reportId } = req.params;

    const report = await PatientReport.findById(reportId);

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.Patient_id.toString() !== patientId.toString()) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this report" });
    }

    // ✅ 1) delete from cloudinary
    await cloudinary.uploader.destroy(report.Cloudinary_public_id, {
      resource_type: "raw",
    });

    // ✅ 2) delete from mongodb
    await PatientReport.findByIdAndDelete(reportId);

    return res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

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

Generate a STRICT JSON Ayurvedic diet chart.

Patient Details:
${userPrompt}

Diet Duration: 90 days

Diet Planning Rule:
- Create ONLY ONE WEEK diet plan (7 days).
- This weekly diet will be followed repeatedly for 90 days.
- Do NOT generate 90 separate days.
- Provide Indian Ayurvedic meals.
- Balance patient's dosha.

Meals per day:
- breakfast
- lunch
- dinner

For EACH meal include:
- recipe_name
- ingredients (array)
- instructions (string)
- nutrition:
    - calories
    - protein_g
    - carbs_g
    - fat_g
    - fiber_g
- ayurveda_effects:
    - vata
    - pitta
    - kapha

Lifestyle (common for full 90 days):
- Meal_Frequency
- Bowel_Movement
- Water_Intake

Return JSON in this EXACT structure:

{
  "duration_days": 90,

  "patient": {
    "name": "",
    "age": 0,
    "gender": "",
    "dosha": ""
  },

  "lifestyle": {
    "Meal_Frequency": "",
    "Bowel_Movement": "",
    "Water_Intake": ""
  },

  "weekly_plan": [
    {
      "day": 1,
      "breakfast": {},
      "lunch": {},
      "dinner": {}
    }
  ],

  "note": ""
}

Rules:
- weekly_plan must contain EXACTLY 7 days.
- day must be 1 → 7.
- No extra text.
- No markdown.
- No comments.
- No trailing commas.

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
    const { Name, Age, Gender, Dosha } = req.body;
    if (!Name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Patient name is required",
      });
    }

    if (!Age || !Gender || !Dosha) {
      return res.status(400).json({
        success: false,
        message: "All patient fields required",
      });
    }


    const user = await User.findOne({ Name });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    const input = {
      messages: [
        new HumanMessage(`
Patient Name: ${Name}
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

      weekly_plan: json.weekly_plan,

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

