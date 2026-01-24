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
    }
},{timestamps:true})

const Doctor=mongoose.model("Doctor",doctorSchema);

export default Doctor
