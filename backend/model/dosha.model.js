import { mongoose, Schema } from "mongoose";

const Doshas = new Schema({
  Patient_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  doshaAssessment: {
    prakriti: {
      vata: Number,
      pitta: Number,
      kapha: Number,
    },

    vikriti: {
      vata: Number,
      pitta: Number,
      kapha: Number,
    },

    dominantPrakriti: String,
    dominantVikriti: String,

    lastFilledAt: Date,
  },
},{timestamps:true});

const Dosha=mongoose.model("Dosha",Doshas);
export default Dosha;
