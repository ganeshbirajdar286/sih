import { mongoose, Schema, Types } from "mongoose";

const Report = new Schema(
  {
    Patient_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Doctor_id: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
    },
    Title: {
      type: String,
    },
    Category: {
      type: String,
      enum: ["All Reports", "Lab Reports", "Imaging", "Diagnostic"],
    },
    File_url: {
      type: String,
    },
    Report_date: {
      type: Date,
      default: Date.now(),
    },
    Cloudinary_public_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const Reports = mongoose.model("Report", Report);
export default Reports;
