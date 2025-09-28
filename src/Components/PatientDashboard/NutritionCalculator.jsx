import React, { useState } from 'react';

const NutritionCalculator = () => {
  // State for user inputs
  const [userData, setUserData] = useState({
    age: '',
    gender: '',
    weight: '',
    height: '',
    activityLevel: 'sedentary',
    prakriti: '',
    healthCondition: '',
    foodPreferences: []
  });

  // State for food search and selection
  const [foodSearch, setFoodSearch] = useState('');
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [foodQuantity, setFoodQuantity] = useState({});

  // State for nutritional results
  const [nutritionResults, setNutritionResults] = useState(null);
  const [ayurvedicAnalysis, setAyurvedicAnalysis] = useState(null);

  // Sample food database
  const foodDatabase = [
    {
      id: 1,
      name: "Brown Rice",
      category: "Grains",
      rasa: "Sweet",
      virya: "Cool",
      vipak: "Sweet",
      tags: ["vegetarian", "vegan", "glutenFree"],
      nutrition: {
        calories: 111,   // per 100g cooked
        protein: 2.6,
        carbs: 23,
        fat: 0.9
      }
    },
    {
      id: 2,
      name: "Lentils (Masoor Dal)",
      category: "Legumes",
      rasa: "Sweet",
      virya: "Hot",
      vipak: "Sweet",
      tags: ["vegetarian", "vegan", "glutenFree"],
      nutrition: {
        calories: 116,   // per 100g cooked
        protein: 9,
        carbs: 20,
        fat: 0.4
      }
    },
    {
      id: 3,
      name: "Spinach",
      category: "Vegetables",
      rasa: "Sweet, Astringent",
      virya: "Cool",
      vipak: "Sweet",
      tags: ["vegetarian", "vegan", "glutenFree", "dairyFree"],
      nutrition: {
        calories: 23,
        protein: 2.9,
        carbs: 3.6,
        fat: 0.4
      }
    },
    {
      id: 4,
      name: "Ghee",
      category: "Fats",
      rasa: "Sweet",
      virya: "Cool",
      vipak: "Sweet",
      tags: ["vegetarian"], // ❌ not vegan, not dairy-free
      nutrition: {
        calories: 900,
        protein: 0,
        carbs: 0,
        fat: 100
      }
    },
    {
      id: 5,
      name: "Almonds",
      category: "Nuts",
      rasa: "Sweet",
      virya: "Cool",
      vipak: "Sweet",
      tags: ["vegetarian", "vegan", "glutenFree", "dairyFree"],
      nutrition: {
        calories: 579,
        protein: 21,
        carbs: 22,
        fat: 50
      }
    },
    {
      id: 6,
      name: "Ginger",
      category: "Spices",
      rasa: "Pungent",
      virya: "Hot",
      vipak: "Sweet",
      tags: ["vegetarian", "vegan", "glutenFree", "dairyFree"],
      nutrition: {
        calories: 80,
        protein: 1.8,
        carbs: 18,
        fat: 0.8
      }
    },
    {
      id: 7,
      name: "Turmeric",
      category: "Spices",
      rasa: "Bitter, Pungent",
      virya: "Hot",
      vipak: "Pungent",
      tags: ["vegetarian", "vegan", "glutenFree", "dairyFree"],
      nutrition: {
        calories: 312,
        protein: 9.7,
        carbs: 67,
        fat: 3.3
      }
    },
    {
      id: 8,
      name: "Milk",
      category: "Dairy",
      rasa: "Sweet",
      virya: "Cool",
      vipak: "Sweet",
      tags: ["vegetarian"], // ❌ not vegan, not dairy-free
      nutrition: {
        calories: 42,  // per 100ml
        protein: 3.4,
        carbs: 5,
        fat: 1
      }
    }
  ];


  const filteredFoods = foodDatabase.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(foodSearch.toLowerCase());

    const matchesPreferences = !userData.foodPreferences
      ? true
      : food.tags.includes(userData.foodPreferences); // ✅ string check

    return matchesSearch && matchesPreferences;
  });


  // Handle user data changes
  const handleInputChange = (e) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const isChecked = e.target.checked;
      setUserData(prev => ({
        ...prev,
        foodPreferences: isChecked
          ? [...prev.foodPreferences, value]
          : prev.foodPreferences.filter(pref => pref !== value)
      }));
    } else {
      setUserData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };


  // Add food to selected list
  const addFood = (food) => {
    if (!selectedFoods.find(f => f.id === food.id)) {
      setSelectedFoods(prev => [...prev, { ...food, quantity: 100 }]);
      setFoodQuantity(prev => ({ ...prev, [food.id]: 100 }));
    }
  };

  // Remove food from selected list
  const removeFood = (foodId) => {
    setSelectedFoods(prev => prev.filter(food => food.id !== foodId));
    const newQuantities = { ...foodQuantity };
    delete newQuantities[foodId];
    setFoodQuantity(newQuantities);
  };

  // Update food quantity
  const updateQuantity = (foodId, quantity) => {
    setFoodQuantity(prev => ({ ...prev, [foodId]: parseInt(quantity) || 0 }));
    setSelectedFoods(prev =>
      prev.map(food =>
        food.id === foodId ? { ...food, quantity: parseInt(quantity) || 0 } : food
      )
    );
  };

  // Calculate nutrition
  const calculateNutrition = () => {
    if (selectedFoods.length === 0) {
      alert("Please add at least one food item to calculate nutrition.");
      return;
    }

    // Calculate total nutritional values
    const totals = selectedFoods.reduce((acc, food) => {
      const multiplier = (foodQuantity[food.id] || food.quantity) / 100;
      return {
        calories: acc.calories + (food.nutrition.calories * multiplier),
        protein: acc.protein + (food.nutrition.protein * multiplier),
        carbs: acc.carbs + (food.nutrition.carbs * multiplier),
        fat: acc.fat + (food.nutrition.fat * multiplier)
      };
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });


    // Ayurvedic analysis based on rasa distribution
    const rasaCount = selectedFoods.reduce((acc, food) => {
      const rasas = food.rasa.split(', ');
      const multiplier = (foodQuantity[food.id] || food.quantity) / 100; // scale by grams
      rasas.forEach(rasa => {
        acc[rasa] = (acc[rasa] || 0) + multiplier;
      });
      return acc;
    }, {});


    setNutritionResults(totals);
    setAyurvedicAnalysis(rasaCount);
  };

  // Calculate recommended daily intake
  const calculateRecommendedIntake = () => {
    if (!userData.age || !userData.weight || !userData.height || !userData.gender) {
      return null;
    }

    // Basic BMR calculation
    let bmr;
    if (userData.gender === 'male') {
      bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age + 5;
    } else {
      bmr = 10 * userData.weight + 6.25 * userData.height - 5 * userData.age - 161;
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = bmr * (activityMultipliers[userData.activityLevel] || 1.2);


    return {
      calories: Math.round(tdee),
      protein: Math.round(userData.weight * 0.8),
      carbs: Math.round((tdee * 0.5) / 4),
      fat: Math.round((tdee * 0.3) / 9)
    };
  };
  const recommendedIntake = calculateRecommendedIntake();
  const units = { calories: "kcal", protein: "g", carbs: "g", fat: "g" };

  const formatLabel = (nutrient) => {
    switch (nutrient) {
      case "calories": return "Calories";
      case "protein": return "Protein";
      case "carbs": return "Carbs";
      case "fat": return "Fat";
      default: return nutrient;
    }
  };
  return (
    <div className="min-h-full bg-gray-50">
      {/* Compact Header for Dashboard Integration */}
      <div className="bg-gradient-to-r from-green-600 to-green-800 text-white py-6 shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-2">Ayurvedic Nutrition Calculator</h1>
          <p className="text-md text-center text-green-100">
            Calculate nutritional values based on Ayurvedic principles
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* User Information Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input
                type="number"
                name="age"
                value={userData.age}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="1"
                max="120"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <select
                name="gender"
                value={userData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
              <input
                type="number"
                name="weight"
                value={userData.weight}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="1"
                max="300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
              <input
                type="number"
                name="height"
                value={userData.height}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                min="50"
                max="250"
              />
            </div>

            <div className="w-full">
              <label className="block text-sm md:text-base font-medium text-gray-700 mb-1">
                Activity Level
              </label>
              <select
                name="activityLevel"
                value={userData.activityLevel}
                onChange={handleInputChange}
                className="w-full min-w-0 px-1  py-2 
               border border-gray-300 rounded-md 
               focus:outline-none focus:ring-2 focus:ring-green-500 
               text-sm sm:text-base md:text-lg truncate"
              >
                <option value="sedentary"> no exercise</option>
                <option value="light"> exercise 1-3 days/week</option>
                <option value="moderate">moderate exercise 3-5 days/week</option>
                <option value="active"> hard exercise 6-7 days/week</option>
                <option value="veryActive"> very hard exercise, physical job</option>
              </select>
            </div>




            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prakriti (Body Constitution)</label>
              <select
                name="prakriti"
                value={userData.prakriti}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select</option>
                <option value="vata">Vata</option>
                <option value="pitta">Pitta</option>
                <option value="kapha">Kapha</option>
                <option value="vata-pitta">Vata-Pitta</option>
                <option value="pitta-kapha">Pitta-Kapha</option>
                <option value="vata-kapha">Vata-Kapha</option>
                <option value="tridoshic">Tridoshic (Balanced)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Food Preferences</label>
            <div className="flex flex-wrap gap-4">
              {['vegetarian', 'vegan', 'glutenFree', 'dairyFree'].map(preference => (
                <label key={preference} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="foodPreferences"
                    value={preference}   // make sure this value matches what you want to store
                    onChange={handleInputChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />

                  <span className="ml-2 text-sm text-gray-700 capitalize">
                    {preference === 'glutenFree' ? 'Gluten-Free' :
                      preference === 'dairyFree' ? 'Dairy-Free' : preference}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Food Selection Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Food Selection</h2>

          {/* Search Bar */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search for foods..."
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Available Foods */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Available Foods</h3>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-4 max-h-80 overflow-y-auto p-2">
              {filteredFoods.length === 0 ? (
                <p className="text-gray-500 text-center col-span-full">No foods match your preferences.</p>
              ) : (
                filteredFoods.map(food => (
                  <div key={food.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900">{food.name}</h4>
                      <p className="text-sm text-gray-600">Category: {food.category}</p>
                      <p className="text-sm text-gray-600">Rasa: {food.rasa}</p>
                      <p className="text-sm text-gray-600">Virya: {food.virya}</p>
                    </div>
                    <button
                      onClick={() => addFood(food)}
                      disabled={selectedFoods.find(f => f.id === food.id)}
                      className={`w-full py-2 px-4 rounded-md text-sm font-medium ${selectedFoods.find(f => f.id === food.id)
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                    >
                      {selectedFoods.find(f => f.id === food.id) ? 'Added' : 'Add Food'}
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Selected Foods */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Selected Foods</h3>
            {selectedFoods.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No foods selected. Add foods from the list above.
              </p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto p-2">
                {selectedFoods.map((food) => (
                  <div
                    key={food.id}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-4 items-center 
                     border border-gray-200 rounded-lg p-4"
                  >
                    {/* Food info */}
                    <div>
                      <span className="font-medium text-gray-900">{food.name}</span>
                      <span className="text-sm text-gray-500 ml-2">({food.category})</span>
                    </div>

                    {/* Quantity input */}
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-2 items-center">
                      <label className="text-sm text-gray-700 whitespace-nowrap">
                        Quantity (g):
                      </label>
                      <input
                        type="number"
                        value={foodQuantity[food.id] || ""}
                        onChange={(e) => updateQuantity(food.id, e.target.value)}
                        className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                        min="0"
                        max="1000"
                      />

                      <button
                        onClick={() => removeFood(food.id)}
                        className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded-md 
                         text-sm font-medium w-full sm:w-auto"
                      >
                        Remove
                      </button>
                    </div>


                  </div>
                ))}
              </div>
            )}
          </div>






          {/* Calculate Button */}
          <div className="mt-6 text-center">
            <button
              onClick={calculateNutrition}
              disabled={selectedFoods.length === 0}
              className={`px-6 py-3 rounded-lg font-medium ${selectedFoods.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
              Calculate Nutrition
            </button>
          </div>
        </div>


        {/* Results Section */}
        {(nutritionResults || recommendedIntake) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Nutrition Analysis</h2>

            {/* Recommended Intake */}
            {recommendedIntake && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Recommended Daily Intake</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(recommendedIntake).map(([key, value]) => (
                    <div key={key} className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-xl font-bold text-green-700">{value}</div>
                      <div className="text-sm text-gray-600">{formatLabel(key)} ({units[key]})</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Foods Nutrition */}
            {nutritionResults && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Selected Foods Nutrition</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(nutritionResults).map(([key, value]) => {
                    const num = Number(value);
                    return (
                      <div key={key} className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-xl font-bold text-blue-700">
                          {isNaN(num) ? "0" : num.toFixed(1)} {units[key]}
                        </div>
                        <div className="text-sm text-gray-600">{formatLabel(key)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Ayurvedic Analysis */}
            {ayurvedicAnalysis && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Ayurvedic Analysis</h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Rasa (Taste) Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(ayurvedicAnalysis).map(([rasa, count]) => (
                      <div key={rasa} className="flex items-center">
                        <span className="w-24 text-sm font-medium text-yellow-700">{rasa}:</span>
                        <div className="flex-1 bg-yellow-200 rounded-full h-4">
                          <div
                            className="bg-yellow-600 h-4 rounded-full"
                            style={{ width: `${(count / Object.values(ayurvedicAnalysis).reduce((a, b) => a + b, 0)) * 100}%` }}
                          ></div>
                        </div>
                        <span className="w-8 text-sm text-yellow-700 text-right ml-2">
                          {count.toFixed(1)}
                        </span>
                      </div>
                    ))}

                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default NutritionCalculator;