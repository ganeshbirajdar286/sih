import  {mongoose,Schema} from "mongoose"

const userSchema=new Schema({
    Name:{
        type:String,
        require:true,
    },
    Age: {
      type: Number,
      required: true,
    },
    Image_url:{
        type:String
    },
     Email:{
        type:String,
        lowercase:true,
        unique:true,
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
       require:true
    },
    Gender:{
      type:String,
      enum:["Male","Female","Other"],
      require:true,
    },
     DoctorId: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true, 
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