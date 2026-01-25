import  {mongoose,Schema} from "mongoose"

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
      require:true,
    },
    Email:{
      type:String,
      require:true,
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
},{timestamps:true});

const User=mongoose.model("User",userSchema);
export default User; 