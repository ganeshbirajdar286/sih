// src/components/ActiveDietPlan.jsx
import React, { useState, useEffect } from 'react';
import Card from './Card';
import { FaChevronDown, FaChevronUp, FaUtensils, FaClock, FaLeaf, FaInfoCircle } from 'react-icons/fa';

// ✅ Redux imports added
import { useSelector, useDispatch } from 'react-redux';
import { DietChart } from '../../feature/Patient/patient.thunk';

const DietPlanCard = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Mapping backend structure
  const mealData = item.data || {};
  const nutrition = mealData.nutrition || {};
  const ayurveda = mealData.ayurveda_effects || {};

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 hover:border-green-300">
      
      <div 
        className="flex justify-between items-center cursor-pointer p-4 sm:p-5 bg-white hover:bg-gray-50 transition-colors duration-200" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center flex-1 min-w-0 mr-4">
          
          <div className="bg-green-100 p-2 sm:p-2.5 rounded-lg mr-3 sm:mr-4 flex-shrink-0">
            <FaUtensils className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="min-w-0 flex-1">
            
            <div className="flex items-center gap-2 mb-0.5 sm:mb-1 flex-wrap">
              <p className="font-bold text-gray-500 text-xs sm:text-sm">
                {item.meal}
              </p>
              
              
              {nutrition.calories && (
                <span className="bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5 rounded">
                  {nutrition.calories} cal
                </span>
              )}
            </div>

            <p className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {mealData.recipe_name || 'No recipe'}
            </p>

          </div>
        </div>

        <button 
          className="text-gray-500 hover:text-green-600 transition-colors duration-200 flex-shrink-0 p-2"
        >
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-200 p-4 sm:p-5 bg-gray-50 space-y-4">
          
         
          {mealData.ingredients && mealData.ingredients.length > 0 && (
            <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-700 mb-2 text-sm sm:text-base flex items-center gap-2">
                <FaLeaf className="text-green-600" />
                Ingredients:
              </p>
              <div className="flex flex-wrap gap-2">
                {mealData.ingredients.map((ingredient, idx) => (
                  <span 
                    key={idx}
                    className="bg-green-50 text-green-700 text-xs sm:text-sm px-3 py-1 rounded-full border border-green-200"
                  >
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>
          )}

          
          {mealData.instructions && (
            <div>
              <p className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                Instructions:
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed bg-white p-3 rounded-lg border border-gray-200">
                {mealData.instructions}
              </p>
            </div>
          )}
          
          
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
            
            <p className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">
              Complete Nutrition Facts:
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
              
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-2 sm:p-3">
                <p className="text-xs text-gray-600 mb-1">Calories</p>
                <p className="text-base sm:text-lg font-bold text-orange-600">
                  {nutrition.calories || 0}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 sm:p-3">
                <p className="text-xs text-gray-600 mb-1">Protein</p>
                <p className="text-base sm:text-lg font-bold text-blue-600">
                  {nutrition.protein_g || 0}g
                </p>
              </div>

              <div className="bg-purple-50 border border-purple-100 rounded-lg p-2 sm:p-3">
                <p className="text-xs text-gray-600 mb-1">Carbs</p>
                <p className="text-base sm:text-lg font-bold text-purple-600">
                  {nutrition.carbs_g || 0}g
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-2 sm:p-3">
                <p className="text-xs text-gray-600 mb-1">Fat</p>
                <p className="text-base sm:text-lg font-bold text-yellow-600">
                  {nutrition.fat_g || 0}g
                </p>
              </div>

              <div className="bg-green-50 border border-green-100 rounded-lg p-2 sm:p-3">
                <p className="text-xs text-gray-600 mb-1">Fiber</p>
                <p className="text-base sm:text-lg font-bold text-green-600">
                  {nutrition.fiber_g || 0}g
                </p>
              </div>

            </div>
          </div>

          {(ayurveda.vata || ayurveda.pitta || ayurveda.kapha) && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:p-4 rounded-lg border border-amber-200">
              
              <p className="font-semibold text-gray-700 mb-3 text-sm sm:text-base flex items-center gap-2">
                <FaLeaf className="text-amber-600" />
                Ayurveda Effects (Dosha Balance):
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                
                {ayurveda.vata && (
                  <div className="bg-white border border-amber-200 rounded-lg p-2 sm:p-3">
                    <p className="text-xs text-gray-600 mb-1 font-semibold">Vata</p>
                    <p className="text-sm sm:text-base font-semibold text-amber-700 capitalize">
                      {ayurveda.vata}
                    </p>
                  </div>
                )}

                {ayurveda.pitta && (
                  <div className="bg-white border border-red-200 rounded-lg p-2 sm:p-3">
                    <p className="text-xs text-gray-600 mb-1 font-semibold">Pitta</p>
                    <p className="text-sm sm:text-base font-semibold text-red-600 capitalize">
                      {ayurveda.pitta}
                    </p>
                  </div>
                )}

                {ayurveda.kapha && (
                  <div className="bg-white border border-blue-200 rounded-lg p-2 sm:p-3">
                    <p className="text-xs text-gray-600 mb-1 font-semibold">Kapha</p>
                    <p className="text-sm sm:text-base font-semibold text-blue-600 capitalize">
                      {ayurveda.kapha}
                    </p>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

const ActiveDietPlan = () => {

  // ✅ Redux hooks added
  const dispatch = useDispatch();
  const { dietchart, loading, error } = useSelector((state) => state.patient);

  // ✅ Fetch diet chart on mount
  useEffect(() => {
    dispatch(DietChart());
  }, [dispatch]);



  const formattedPlan =
    dietchart?.daily_plan
      ? [
          { meal: "Breakfast", data: dietchart.daily_plan.breakfast },
          { meal: "Lunch", data: dietchart.daily_plan.lunch },
          { meal: "Dinner", data: dietchart.daily_plan.dinner },
        ].filter(item => item.data && Object.keys(item.data).length > 0)
      : [];

  const lifestyle = dietchart?.lifestyle || {};
  const note = dietchart?.note || '';
  const durationDays = dietchart?.duration_days || 0;


  const hasDietChart = dietchart && dietchart.daily_plan;

  return (
    <Card title="Active Diet Plan" icon={FaUtensils}>
      
      <div className="space-y-3 sm:space-y-4">

        
        {loading ? (
          <p className="text-center text-gray-500">Loading diet plan...</p>
        ) : error ? (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
              <FaInfoCircle className="mx-auto text-red-400 w-12 h-12 mb-3" />
              <p className="text-red-600 text-base sm:text-lg font-semibold mb-2">
                Error loading diet plan
              </p>
              <p className="text-red-500 text-sm">
                {typeof error === 'string' ? error : error?.message || "Please try again later"}
              </p>
              <button 
                onClick={() => dispatch(DietChart())}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : !hasDietChart ? (
          
          <div className="text-center py-8 sm:py-12">
            
            <FaUtensils className="mx-auto text-gray-300 w-12 h-12 sm:w-16 sm:h-16 mb-3" />
            
            <p className="text-gray-500 text-sm sm:text-base mb-1 font-semibold">
              No diet chart found
            </p>
            
            <p className="text-gray-400 text-xs sm:text-sm mb-4">
              Contact your doctor to create a personalized diet plan
            </p>

          

          </div>

        ) : (
          <>
            
            {(durationDays > 0 || note) && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                
                {durationDays > 0 && (
                  <div className="flex items-start gap-2">
                    <FaClock className="text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Plan Duration</p>
                      <p className="text-sm text-blue-700">{durationDays} days</p>
                    </div>
                  </div>
                )}

                {note && (
                  <div className="flex items-start gap-2">
                    <FaInfoCircle className="text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900">Doctor's Note</p>
                      <p className="text-sm text-blue-700">{note}</p>
                    </div>
                  </div>
                )}

              </div>
            )}

            
            {(lifestyle.Meal_Frequency || lifestyle.Water_Intake || lifestyle.Bowel_Movement) && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4">
                
                <p className="font-semibold text-gray-800 mb-3 text-sm sm:text-base flex items-center gap-2">
                  <FaLeaf className="text-green-600" />
                  Lifestyle Recommendations
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {lifestyle.Meal_Frequency && (
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <p className="text-xs text-gray-600 mb-1">Meal Frequency</p>
                      <p className="text-sm font-semibold text-green-700">
                        {lifestyle.Meal_Frequency}
                      </p>
                    </div>
                  )}

                  {lifestyle.Water_Intake && (
                    <div className="bg-white rounded-lg p-3 border border-blue-100">
                      <p className="text-xs text-gray-600 mb-1">Water Intake</p>
                      <p className="text-sm font-semibold text-blue-700">
                        {lifestyle.Water_Intake}
                      </p>
                    </div>
                  )}

                  {lifestyle.Bowel_Movement && (
                    <div className="bg-white rounded-lg p-3 border border-purple-100">
                      <p className="text-xs text-gray-600 mb-1">Bowel Movement</p>
                      <p className="text-sm font-semibold text-purple-700">
                        {lifestyle.Bowel_Movement}
                      </p>
                    </div>
                  )}

                </div>
              </div>
            )}

            
            <div className="space-y-3">
              {formattedPlan.map((item, index) => (
                <DietPlanCard key={index} item={item} />
              ))}
            </div>
          </>
        )}

      </div>

    </Card>
  );
};

export default ActiveDietPlan;