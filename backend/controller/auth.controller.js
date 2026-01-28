import User from "../model/users.model.js";
import Doctor from "../model/doctor.model.js";
import { hash_Password } from "../config/password_hash.js";
import { jwtToken } from "../config/jwt.js";
import { comparePassword } from "../config/password_hash.js";
import { uploadFileToCloudinary } from "../config/cloudinary.config.js";
import Appointment from "../model/appointments.model.js";

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
    Certificates,
    Rating,
  } = req.body;
  try {
    if (!Name || !Age || !Password || !Gender) {
      return res.status(400).json({
        message: "Required fields missing",
      });
    }

    const nameExits = await User.findOne({ Name });

    if (nameExits) {
      return res.status(400).json({
        message: "User already exits ",
      });
    }

    const hashedPassword = await hash_Password(Password);

    let user = await User.create({
      Name,
      Age,
      Password: hashedPassword,
      Gender,
      Height,
      Weight,
    });

    let doctorProfile = null;

    if (isDoctor === true) {
      if (!Specialization) {
        return res.status(400).json({
          message: "Specialization required for doctor",
        });
      }

      doctorProfile = await Doctor.create({
        User_id: user?._id,
        Specialization,
        Certificates,
        Rating,
      });
    }

    user = await User.findByIdAndUpdate(
      user?._id,
      { Doctor_id: doctorProfile?._id },
      { new: true },
    );

    const token = jwtToken(user?.id,doctorProfile?._id);
    res.cookie("token", (token,doctorProfile?._id), {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
      sameSite: "none",
       secure: false, // true when deployed
    });

    res.status(201).json({
      message: "Registration successful",
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
    const token = jwtToken(user?._id,user?.Doctor_id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
      sameSite: "none",
      secure: false, // true when deployed
    });

    // 6) Send response
    return res.status(200).json({
      message: "Login successful",
      role,
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

     const doctor=req.user;
    const user = await User.findOne({ Doctor_id: doctor.doctor_id  }).populate(
      {
        path:"Doctor_id",
      }
    )

    const file =req.file;



     if (!user) {
      return res.status(404).json({ message: "doctor not found" });
    }
     if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      user.Image_url = uploadResult?.secure_url;
    } else if (req.body.Image_url) {
      user.Image_url= req.body.Image_url;
    }
    if(Name) user.Name=Name
    if(Email) user.Email=Email
    if(PhoneNumber) user.PhoneNumber=PhoneNumber
    if(Experience) user.Doctor_id.Experience=Experience
   if(Bio) user.Doctor_id.Bio=Bio
    if(Specialization) user.Doctor_id.Specialization=Specialization
   if(Qualifications) user.Doctor_id.Qualifications=Qualifications
   if(Clinic_Name) user.Doctor_id.Clinic_Name=Clinic_Name
   if(Consultation) user.Doctor_id.Consultation=Consultation

   await  user.save();

    return res.status(200).json({
      message:"user profile updated succesfully",
      user
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
 
export const PatientUpdateProfile = async (req, res) => {
  try {
   const {
    Name,
    Email,
    PhoneNumber,
      Age,
      Password,
      Height,
      Weight
  } = req.body;

  const file =req.file;


     const patient=req.user;
    const user = await User.findOne({_id:patient?.userId })
  
     if (!user) {
      return res.status(404).json({ message: "Patient  not found" });
    }

     if (file) {
      const uploadResult = await uploadFileToCloudinary(file);
      user.Image_url = uploadResult?.secure_url;
    } else if (req.body.Image_url) {
      user.Image_url= req.body.Image_url;
    }

    if(Name) user.Name=Name
    if(Email) user.Email=Email
    if(PhoneNumber) user.PhoneNumber=PhoneNumber
    if(Age) user.Age=Age
    if(Password) user.Password=Password
    if(Height) user.Height=Height
    if(Weight) user.Weight= Weight
   await  user.save();

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
    res.cookie("token", " ", {
      expires: new Date(0), 
      httpOnly: true,
      sameSite: "none",
      secure: false,
    });
    return res.status(200).json({
      message:"user logout successfully"
    })
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message:"Internal server error"
    })
  }
};

export const patientAppointment = async (req, res) => {
  try {
    const { Appointment_Date, Time_slot } = req.body;

    const DOCTOR = req.params.id;        
    const Patient = req.user.userId;      

    if (!Appointment_Date || !Time_slot) {
      return res.status(400).json({ message: "All fields required" });
    }

    const appointment = await Appointment.create({
      Appointment_Date,
      Time_slot,
      Doctor_id:DOCTOR,
      Patient_id:Patient,
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

export const updatePatientAppointment=async(req,res)=>{
   try {
    const { Appointment_Date, Time_slot } = req.body;

    const appointment = req.params.id;        
    const Patient = req.user.userId;      

    if (!Appointment_Date || !Time_slot) {
      return res.status(400).json({ message: "All fields required" });
    }
    
    const UpdatedAppointment=await Appointment.findByIdAndUpdate(appointment,{
      Appointment_Date,Time_slot
    },{
      new:true
    })      
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
}




