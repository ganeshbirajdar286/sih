import { mongoose, Schema } from "mongoose";

const appointment = new Schema(
  {
    Patient_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Doctor_id: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    Appointment_Date: {
      type: Date,
    },
    Time_slot: {
      type: String,
      enum: [
        "09:00-10:00",
        "10:15-11:15",
        "11:30-12:30",
        "14:00-15:00",
        "15:15-16:15",
        "16:30-17:30",
        "17:45-18:45",
        "19:00-20:00",
        "20:15-21:15",
      ],
      required: true,
    },
    Status:{
        type:"String",
        enum:["Accepted","Rejected",
          "Pending","completed"
        ],
        default:"Pending"
    },
    Condition:{
      type:String,
       required:true,
    }
  },
  { timestamps: true },
);

const Appointment =mongoose.model("Appointment",appointment);
export default Appointment;
