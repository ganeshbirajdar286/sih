import {mongoose,Schema} from "mongoose";

const doctorSchema=new Schema({
    User_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    Specialization:{
        type:String,
    },
    Certificates:{
        type:String
    },
    Rating:{
        type:Number
    },
    Experience:{
        type:Number,
        require:true,
    },
    Qualifications:{
        type:String,
        require:true,
    },
    Clinic_Name:{
        type:String, 
    },
    Bio:{
      type:String,  
    },
    Consultation:{
        type:Number,
    }
},{timestamps:true})

const Doctor=mongoose.model("Doctor",doctorSchema);

export default Doctor
