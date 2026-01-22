import mongoose, { Schema } from "mongoose";

const foodSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String, 
      enum:["Vegetarian","Vegan","Gluten-Free","Dairy-Free"],
      required: true,
    },

    calories: {
      type: Number,
      required: true,
    },

    protein: {
      type: Number,
      required: true,
    },

    carbs: {
      type: Number,
      required: true,
    },

    fat: {
      type: Number,
      required: true,
    },

    fiber: {
      type: Number,
      required: true,
    },

    rasa: {
      type: String, // sweet, sour, salty, bitter, pungent, astringent
    },

    vata_effect: {
      type: String, // increase / decrease / balance
    },

    pitta_effect: {
      type: String,
    },

    kapha_effect: {
      type: String,
    },
  },
  { timestamps: true }
);

const Food=mongoose.model("Food", foodSchema);
export default Food;
