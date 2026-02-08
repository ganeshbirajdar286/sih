import  {mongoose,Schema} from "mongoose"
import { type } from "node:os";

const userSchema=new Schema({
    Name:{
        type:String,
        required:true,
    },
    Age: {
      type: Number,
      required: true,
    },
    Image_url:{
        type:String
    },
    PhoneNumber:{
      type:Number,
    },
    Email:{
        type:String,
        lowercase:true,
        validate: {
      validator: function(value) {
        // Basic regex for email format validation
        return /^[^@]+@[^@]+\.[^@]+$/.test(value); 
      },
      message: 'Please enter a valid email address.'
    }
    },
    Password:{
       type:String,
       required:true
    },
    Gender:{
      type:String,
      enum:["Male","Female","Other"],
      required:true,
    },
    Height: {
      type: Number,
    },
    Weight: {
      type: Number,
    },
     Medical_records: [
      {
        type: Schema.Types.ObjectId,
        ref: "PatientRecord",
      },
    ],
    Doctor_id:{
      type:Schema.Types.ObjectId,
       ref:"Doctor"
    },
    Dosha:{
      type:String,
      default:null,
    },
    isDoctor:{
      type:Boolean,
      default:false,
    },
},{timestamps:true});

const User=mongoose.model("User",userSchema);
export default User; 