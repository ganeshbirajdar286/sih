import mongoose, { Schema } from "mongoose";

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    mealtype: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },

    isVeg: {
      type: Boolean,
      required: true,
    },

    food_id: {
      type: Schema.Types.ObjectId,
      ref: "Food",
      required: true,
    },

    recipe: {
      type: String, 
      required: true,
    },

    diet_chart: {
      type: Schema.Types.ObjectId,
      ref: "DietChart",
    },
  },
  { timestamps: true }
);
const Recipe=mongoose.model("Recipe", recipeSchema);
export default Recipe

