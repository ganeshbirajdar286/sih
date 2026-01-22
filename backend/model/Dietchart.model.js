import {mongoose,Schema} from "mongoose"

const dietChartSchema=Schema({
    Patient_id:{
        type:Schema.Types.ObjectId,
        ref:"User",
    },
    Doctor_id:{
         type:Schema.Types.ObjectId,
        ref:"Doctor",
    },
      Meals: [
      {
        MealType: {
          type: String,
          enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
          required: true,
        },

        Recipe: {
          type: Schema.Types.ObjectId,
          ref: "Recipe",
          required: true,
        },
      },
    ],
    
    Lifestyle: {
      Meal_Frequency: {
        type: Number, 
      },

      Bowel_Movement: {
        type: Number,
      },

      Water_Intake: {
        type: Number,
      },
    },
  },
{timestamp:true})

const DietChart=mongoose.model("DietChart",dietChartSchema);
export default DietChart;