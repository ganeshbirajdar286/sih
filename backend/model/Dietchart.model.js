import mongoose, { Schema } from "mongoose";

const mealSchema = new Schema(
  {
    recipe_name: String,

    ingredients: [String],

    instructions: String,

    nutrition: {
      calories: Number,
      protein_g: Number,
      carbs_g: Number,
      fat_g: Number,
      fiber_g: Number,
    },

    ayurveda_effects: {
      vata: String,
      pitta: String,
      kapha: String,
    },
  },
  { _id: false }
);

const weeklyPlanSchema = new Schema(
  {
    day: Number,

    breakfast: mealSchema,
    lunch: mealSchema,
    dinner: mealSchema,
  },
  { _id: false }
);

const dietChartSchema = new Schema(
  {
    Patient_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    Doctor_id: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },

    // 🧾 Duration
    duration_days: Number,

    // 👤 Patient Snapshot
    patient: {
      name: String,
      age: Number,
      gender: String,
      dosha: String,
    },

    // 🧘 Lifestyle
    lifestyle: {
      Meal_Frequency: String,
      Bowel_Movement: String,
      Water_Intake: String,
    },

    // 📅 Weekly Plan
    weekly_plan: [weeklyPlanSchema],

    // 📝 Doctor / AI Note
    note: String,
  },
  {
    timestamps: true,
  }
);

const DietChart = mongoose.model("DietChart", dietChartSchema);

export default DietChart;
