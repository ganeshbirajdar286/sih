import { Schema, mongoose } from "mongoose";

const reviewSchema= new Schema({
  Doctor: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  Patient: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
}, { timestamps: true });

// Prevent same patient from rating same doctor twice
reviewSchema.index({Doctor:1,Patient:1},{unique:true})

const Review =mongoose.model("Review",reviewSchema);

export default Review