import {mongoose,Schema, Types} from "mongoose"

const patientReport=new Schema({
    Patient_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    Title:{
        type:String,
    },
    Category:{
       type:String,
       enum:["All Reports","Lab Reports","Imaging","Diagnostic"] 
    },
    File_url:{
       type:String,
    },
    Report_date:{
        type:date
    },
},{timestamps:true})

const PatientReport=mongoose.model("PatientReport",patientReport);
export default PatientReport;