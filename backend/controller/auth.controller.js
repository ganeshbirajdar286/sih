import User from "../model/users.model.js";
import Doctor from "../model/doctor.model.js";
import { hash_Password } from "../config/password_hash.js"
import { jwtToken } from "../config/jwt.js";
import { comparePassword } from "../config/password_hash.js";

export const register = async(req, res) => {
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

   const  nameExits= await User.findOne({Name})

   if(nameExits){
     return res.status(400).json({
        message:"User already exits "
     })
   }

     const hashedPassword = await hash_Password(Password);

   const user = await User.create({
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

    const token =jwtToken(user?.id);
     res.cookie("token",token,{
      httpOnly:true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
      sameSite:"none",
      secure:true
     })

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user?._id,
        name: user?.Name,
      },
      doctorProfile,
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
    console.log(Name,Password)
    if (!Name || !Password) {
      return res.status(400).json({
        message: "Name and Password are required",
      });
    }

    const user = await User.findOne({ Name:{ $regex: new RegExp(`^${Name}$`, "i") }});
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
    const token = jwtToken(user?._id)

     res.cookie("token",token,{
      httpOnly:true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
      sameSite:"none",
      secure:true
     })

    // 6) Send response
    return res.status(200).json({
      message: "Login successful",
      token,
      role,
      user: {
        id: user._id,
        Name: user.Name,
        Gender: user.Gender,
      },
      doctorProfile: doctor
        ? {
            id: doctor._id,
            Specialization: doctor.Specialization,
            Certificates: doctor.Certificates,
            Rating: doctor.Rating,
          }
        : null,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
