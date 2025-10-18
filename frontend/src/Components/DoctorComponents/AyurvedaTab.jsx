import React, { useState } from "react";

export default function DoctorAyurvedaDashboard() {
  // Sample patient data
  const patientData = {
    name: "John Doe",
    age: 28,
    gender: "Male",
    prakriti: "Vata-Pitta",
    doshaBalance: { vata: 45, pitta: 35, kapha: 20 },
    recommendations: [
      "Warm, moist foods to balance Vata",
      "Cooling practices for Pitta harmony",
      "Regular routine and early bedtime",
      "Abhyanga (oil massage) with sesame oil",
    ],
    seasonalAdvice: "Focus on grounding practices during this windy season",
    dailyRoutine: [
      "Wake up early (before sunrise)",
      "Morning meditation and light exercise",
      "Eat warm, easy-to-digest meals",
      "Wind down 30 minutes before bed with relaxation",
    ],
    foodRecommendations: [
      { dosha: "Vata", foods: ["Cooked grains", "Warm soups", "Ghee"] },
      { dosha: "Pitta", foods: ["Cooling fruits", "Coconut water", "Leafy greens"] },
      { dosha: "Kapha", foods: ["Spices", "Light grains", "Bitter greens"] },
    ],
    lifestyleTips: [
      "Daily oil massage for circulation",
      "Stay hydrated with warm liquids",
      "Practice mindful breathing",
      "Spend time in nature",
    ],
  };

  const ayurvedaComponents = [
    {
      name: "Ashwagandha",
      type: "Herb",
      doshaBalance: "Vata & Kapha",
      benefits: ["Reduces stress & anxiety", "Improves stamina and strength", "Supports immune system"],
      contraindications: ["Pregnancy", "Hyperthyroidism"],
      icon: "🌿",
      color: "green"
    },
    {
      name: "Turmeric",
      type: "Spice/Herb",
      doshaBalance: "All doshas",
      benefits: ["Anti-inflammatory", "Supports digestion", "Boosts immunity"],
      contraindications: ["Gallstones", "Bleeding disorders"],
      icon: "🟡",
      color: "yellow"
    },
    {
      name: "Triphala",
      type: "Herbal Mix",
      doshaBalance: "Vata & Pitta",
      benefits: ["Supports digestion and bowel movement", "Detoxification", "Promotes healthy vision"],
      contraindications: ["Diarrhea", "Abdominal cramps"],
      icon: "🍃",
      color: "emerald"
    },
    {
      name: "Brahmi",
      type: "Herb",
      doshaBalance: "Vata & Pitta",
      benefits: ["Enhances memory", "Reduces anxiety", "Promotes hair growth"],
      contraindications: ["Thyroid disorders", "Diabetes medication"],
      icon: "🌱",
      color: "teal"
    },
    {
      name: "Ginger",
      type: "Spice",
      doshaBalance: "Vata & Kapha",
      benefits: ["Improves digestion", "Reduces nausea", "Anti-inflammatory"],
      contraindications: ["Ulcers", "Heartburn"],
      icon: "🫚",
      color: "orange"
    },
    {
      name: "Neem",
      type: "Herb",
      doshaBalance: "Pitta & Kapha",
      benefits: ["Blood purification", "Skin health", "Antibacterial"],
      contraindications: ["Pregnancy", "Weak digestion"],
      icon: "🌳",
      color: "lime"
    }
  ];

  const [expandedSections, setExpandedSections] = useState({
    diet: true,
    lifestyle: false,
    routine: false,
    herbs: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getColorClass = (color) => {
    const colorMap = {
      green: "bg-green-100 border-green-200 text-green-800",
      yellow: "bg-amber-100 border-amber-200 text-amber-800",
      emerald: "bg-emerald-100 border-emerald-200 text-emerald-800",
      teal: "bg-teal-100 border-teal-200 text-teal-800",
      orange: "bg-orange-100 border-orange-200 text-orange-800",
      lime: "bg-lime-100 border-lime-200 text-lime-800"
    };
    return colorMap[color] || "bg-gray-100 border-gray-200 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-blue-50/30 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Enhanced Header */}
      
        {/* Main Content Grid */}
        <div className="grid xl:grid-cols-3 gap-8 mb-8">
          
          {/* Left Column - Patient Overview */}
          <div className="xl:col-span-1 space-y-8">
            
            {/* Patient Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Patient Profile</h2>
                  <p className="text-slate-600 text-sm">Personal Information</p>
                </div>
              </div>
              
              <div className="grid gap-4">
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Name</span>
                  <span className="font-semibold text-slate-800">{patientData.name}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Age</span>
                  <span className="font-semibold text-slate-800">{patientData.age} years</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Gender</span>
                  <span className="font-semibold text-slate-800">{patientData.gender}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span className="text-amber-700">Prakriti</span>
                  <span className="font-bold text-amber-700">{patientData.prakriti}</span>
                </div>
              </div>
            </div>

            {/* Dosha Balance Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚖️</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Dosha Analysis</h2>
                  <p className="text-slate-600 text-sm">Current Balance</p>
                </div>
              </div>

              <div className="space-y-5">
                {Object.entries(patientData.doshaBalance).map(([dosha, value]) => (
                  <div key={dosha} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium capitalize text-slate-700 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${
                          dosha === "vata" ? "bg-purple-500" :
                          dosha === "pitta" ? "bg-red-500" : "bg-green-500"
                        }`}></span>
                        {dosha}
                      </span>
                      <span className="font-bold text-slate-800">{value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-700 ${
                          dosha === "vata" ? "bg-gradient-to-r from-purple-400 to-purple-600" :
                          dosha === "pitta" ? "bg-gradient-to-r from-red-400 to-red-600" : 
                          "bg-gradient-to-r from-green-400 to-green-600"
                        }`}
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Seasonal Advice */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl shadow-sm border border-green-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🌤️</span>
                </div>
                <h3 className="font-bold text-green-800">Seasonal Guidance</h3>
              </div>
              <p className="text-green-700 leading-relaxed">{patientData.seasonalAdvice}</p>
            </div>
          </div>

          {/* Middle Column - Recommendations */}
          <div className="xl:col-span-1 space-y-8">
            
            {/* Key Recommendations */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💡</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Treatment Plan</h2>
                  <p className="text-slate-600 text-sm">Key Recommendations</p>
                </div>
              </div>

              <div className="grid gap-3">
                {patientData.recommendations.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50/50 rounded-xl border border-amber-100">
                    <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{rec}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Expandable Sections */}
            <div className="space-y-4">
              
              {/* Diet Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => toggleSection('diet')}
                  className="w-full text-left p-5 flex justify-between items-center hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-xl">🍎</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Diet & Nutrition</h3>
                      <p className="text-slate-600 text-sm">Personalized food plan</p>
                    </div>
                  </div>
                  <span className="text-2xl text-slate-400 group-hover:text-slate-600 transition-colors">
                    {expandedSections.diet ? '−' : '+'}
                  </span>
                </button>
                
                {expandedSections.diet && (
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                    <div className="grid gap-4">
                      {patientData.foodRecommendations.map((rec, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
                          <h4 className="font-semibold text-slate-700 mb-3 flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              rec.dosha === "Vata" ? "bg-purple-500" :
                              rec.dosha === "Pitta" ? "bg-red-500" : "bg-green-500"
                            }`}></span>
                            {rec.dosha} Balancing Foods
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {rec.foods.map((food, foodIdx) => (
                              <span key={foodIdx} className="bg-slate-100 px-3 py-1.5 rounded-lg text-sm text-slate-700 border border-slate-200">
                                {food}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lifestyle Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => toggleSection('lifestyle')}
                  className="w-full text-left p-5 flex justify-between items-center hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-xl">🌿</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Lifestyle</h3>
                      <p className="text-slate-600 text-sm">Daily practices & habits</p>
                    </div>
                  </div>
                  <span className="text-2xl text-slate-400 group-hover:text-slate-600 transition-colors">
                    {expandedSections.lifestyle ? '−' : '+'}
                  </span>
                </button>
                
                {expandedSections.lifestyle && (
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                    <div className="grid gap-3">
                      {patientData.lifestyleTips.map((tip, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200">
                          <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                          <span className="text-slate-700">{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Daily Routine Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button
                  onClick={() => toggleSection('routine')}
                  className="w-full text-left p-5 flex justify-between items-center hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-xl">⏰</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800">Daily Routine</h3>
                      <p className="text-slate-600 text-sm">Structured schedule</p>
                    </div>
                  </div>
                  <span className="text-2xl text-slate-400 group-hover:text-slate-600 transition-colors">
                    {expandedSections.routine ? '−' : '+'}
                  </span>
                </button>
                
                {expandedSections.routine && (
                  <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                    <div className="space-y-4">
                      {patientData.dailyRoutine.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-200">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm flex-shrink-0">
                            {idx + 1}
                          </div>
                          <span className="text-slate-700 leading-relaxed">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Ayurveda Components */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌿</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Ayurvedic Reference</h2>
                  <p className="text-slate-600 text-sm">Herbs & Components</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {ayurvedaComponents.map((item, idx) => (
                  <div key={idx} className={`rounded-xl p-4 border-2 ${getColorClass(item.color)} transition-transform hover:scale-[1.02]`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{item.icon}</span>
                        <h3 className="font-bold">{item.name}</h3>
                      </div>
                      <span className="text-xs font-medium px-2 py-1 bg-white/50 rounded-full">{item.type}</span>
                    </div>
                    
                    <div className="mb-3">
                      <span className="text-sm font-medium">Dosha: </span>
                      <span className="text-sm">{item.doshaBalance}</span>
                    </div>
                    
                    <div className="mb-2">
                      <span className="text-sm font-medium">Benefits:</span>
                      <ul className="text-sm mt-1 space-y-1">
                        {item.benefits.map((b, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-xs">✓</span>
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <span className="text-sm font-medium text-red-700">Contraindications:</span>
                      <ul className="text-sm mt-1 space-y-1">
                        {item.contraindications.map((c, i) => (
                          <li key={i} className="flex items-center gap-2 text-red-600">
                            <span className="text-xs">⚠️</span>
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
          <p className="text-lg font-light italic mb-2">
            "When diet is wrong, medicine is of no use. When diet is correct, medicine is of no need."
          </p>
          <p className="text-slate-300 text-sm">- Ancient Ayurvedic Wisdom</p>
        </div>
      </div>
    </div>
  );
}