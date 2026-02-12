// src/components/ActiveDietPlan.jsx
import React, { useState } from 'react';
import Card from './Card';
import { FaChevronDown, FaChevronUp, FaUtensils } from 'react-icons/fa';

const DietPlanCard = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  
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
          <div className="min-w-0">
            <p className="font-bold text-gray-500 text-xs sm:text-sm mb-0.5 sm:mb-1">
              {item.meal}
            </p>
            <p className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {item.dish}
            </p>
          </div>
        </div>
        <button 
          className="text-gray-500 hover:text-green-600 transition-colors duration-200 flex-shrink-0 p-2"
          aria-label={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? <FaChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <FaChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
      </div>
      
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="border-t border-gray-200 p-4 sm:p-5 bg-gray-50">
          <div className="mb-4">
            <p className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">Recipe:</p>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              {item.recipe}
            </p>
          </div>
          
          <div className="bg-white p-3 sm:p-4 rounded-lg border border-gray-200">
            <p className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
              Nutritional Analysis:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              <div className="bg-orange-50 border border-orange-100 rounded-lg p-2 sm:p-3">
                <p className="text-xs text-gray-600 mb-1">Calories</p>
                <p className="text-base sm:text-lg font-bold text-orange-600">
                  {item.analysis.cals}
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 sm:p-3">
                <p className="text-xs text-gray-600 mb-1">Rasa</p>
                <p className="text-sm sm:text-base font-semibold text-blue-600 truncate">
                  {item.analysis.rasa}
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-2 sm:p-3">
                <p className="text-xs text-gray-600 mb-1">Guna</p>
                <p className="text-sm sm:text-base font-semibold text-purple-600 truncate">
                  {item.analysis.guna}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActiveDietPlan = ({ plan }) => (
  <Card title="Active Diet Plan" icon={FaUtensils}>
    <div className="space-y-3 sm:space-y-4">
      {plan.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <FaUtensils className="mx-auto text-gray-300 w-12 h-12 sm:w-16 sm:h-16 mb-3" />
          <p className="text-gray-500 text-sm sm:text-base">No active diet plan</p>
          <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
            Create Diet Plan
          </button>
        </div>
      ) : (
        plan.map((item, index) => <DietPlanCard key={index} item={item} />)
      )}
    </div>
  </Card>
);

export default ActiveDietPlan;