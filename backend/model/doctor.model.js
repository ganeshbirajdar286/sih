import { mongoose, Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    User_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Specialization: {
      type: String,
      enum: [
        "Dermatologist",
        "Oncologist",
        "Cardiologist",
        "Endocrinologist",
        "Gastroenterologist",
        "Neurologist",
        "Obstetrics and Gynaecology",
        "Ophthalmologist",
        "Family doctor",
        "Psychiatrist",
        "Pediatrician",
        "Allergist",
        "Geriatrician",
        "Internal medicine",
        "Nephrologist",
        "Orthopedics",
        "Anesthesiologist",
        "Infectious disease physician",
        "Radiologist",
        "General physician",
        "Hematologist",
        "Surgeon",
        "Urologist",
        "Colorectal surgeon",
      ],
    },
    Certificates: {
      type: String,
      required: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    Experience: {
      type: Number,
      required: true,
    },
    Qualifications: {
      type: String,
      require: true,
    },
    Clinic_Name: {
      type: String,
    },
    Bio: {
      type: String,
    },
    Consultation: {
      type: Number,
    },
  },
  { timestamps: true },
);

const Doctor = mongoose.model("Doctor", doctorSchema);

export default Doctor;
