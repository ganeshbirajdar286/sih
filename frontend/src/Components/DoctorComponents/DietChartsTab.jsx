import React, { useState, useMemo } from "react";
import {
  Search,
  Plus,
  Download,
  Share2,
  Edit3,
  ChefHat,
  Leaf,
  User,
  ChevronDown,
  FileText,
  Trash2,
  Copy,
  Send
} from "lucide-react";

const DietChartsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [expandedChart, setExpandedChart] = useState(null);
  const [sortOption, setSortOption] = useState("recent");

  // --- Sample diet charts data ---
  const dietCharts = [
    {
      id: 1,
      patientName: "Priya Sharma",
      age: 32,
      gender: "Female",
      dosha: "Vata-Pitta",
      chartName: "Weight Management Plan",
      duration: "30 days",
      createdDate: "2024-01-10",
      lastModified: "2024-01-12",
      status: "active",
      priority: "high",
      compliance: 85,
      meals: {
        breakfast: "Oats porridge with nuts",
        lunch: "Brown rice with vegetables",
        dinner: "Vegetable soup with lentils",
      },
      restrictions: ["Spicy food", "Cold drinks", "Processed food"],
      supplements: ["Ashwagandha", "Triphala", "Vitamin D"],
      progress: {
        weight: "-2.5kg",
        energy: "+40%",
        digestion: "Improved",
      },
      notes: "Patient showing good compliance. Adjust protein intake.",
    },
    {
      id: 2,
      patientName: "Rajesh Kumar",
      age: 45,
      gender: "Male",
      dosha: "Vata",
      chartName: "Arthritis Relief Diet",
      duration: "45 days",
      createdDate: "2024-01-08",
      lastModified: "2024-01-14",
      status: "active",
      priority: "medium",
      compliance: 72,
      meals: {
        breakfast: "Wheat porridge with ghee",
        lunch: "Khichdi with vegetables",
        dinner: "Steamed vegetables with roti",
      },
      restrictions: ["Nightshades", "Dairy", "Red meat"],
      supplements: ["Turmeric", "Ginger", "Boswellia"],
      progress: {
        pain: "-60%",
        mobility: "+35%",
        inflammation: "Reduced",
      },
      notes: "Good response to anti-inflammatory foods.",
    },
    {
      id: 3,
      patientName: "Anita Desai",
      age: 28,
      gender: "Female",
      dosha: "Kapha",
      chartName: "PCOS Management Plan",
      duration: "60 days",
      createdDate: "2024-01-05",
      lastModified: "2024-01-15",
      status: "pending",
      priority: "high",
      compliance: 65,
      meals: {
        breakfast: "Fruit salad with seeds",
        lunch: "Quinoa with vegetables",
        dinner: "Grilled fish with greens",
      },
      restrictions: ["Sugar", "Refined carbs", "Dairy"],
      supplements: ["Cinnamon", "Fenugreek", "Myo-inositol"],
      progress: {
        cycles: "Regularizing",
        weight: "-1.8kg",
        insulin: "Improving",
      },
      notes: "Needs better compliance with evening meals.",
    },
    {
      id: 4,
      patientName: "Vikram Joshi",
      age: 52,
      gender: "Male",
      dosha: "Pitta",
      chartName: "Diabetes Control Diet",
      duration: "90 days",
      createdDate: "2024-01-12",
      lastModified: "2024-01-15",
      status: "active",
      priority: "high",
      compliance: 90,
      meals: {
        breakfast: "Besan chilla with vegetables",
        lunch: "Brown rice with dal",
        dinner: "Vegetable salad with tofu",
      },
      restrictions: ["Sugar", "White rice", "Fried food"],
      supplements: ["Bitter melon", "Fenugreek", "Alpha-lipoic acid"],
      progress: {
        glucose: "-45 mg/dL",
        hba1c: "-1.2%",
        energy: "+25%",
      },
      notes: "Excellent compliance. Consider reducing medication.",
    },
  ];

  const statusFilters = [
    {
      value: "all",
      label: "All Charts",
      count: dietCharts.length,
      color: "bg-gray-500",
    },
    {
      value: "active",
      label: "Active",
      count: dietCharts.filter((c) => c.status === "active").length,
      color: "bg-green-500",
    },
    {
      value: "pending",
      label: "Pending Review",
      count: dietCharts.filter((c) => c.status === "pending").length,
      color: "bg-amber-500",
    },
    {
      value: "completed",
      label: "Completed",
      count: dietCharts.filter((c) => c.status === "completed").length,
      color: "bg-blue-500",
    },
  ];

  const getStatusBadge = (status) => {
    const styles = {
      active: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      completed: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return `px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-800",
      medium: "bg-amber-100 text-amber-800",
      low: "bg-green-100 text-green-800",
    };
    return `px-2 py-1 rounded-full text-xs ${styles[priority]}`;
  };

  const getComplianceColor = (compliance) => {
    if (compliance >= 80) return "text-green-600";
    if (compliance >= 60) return "text-amber-600";
    return "text-red-600";
  };

  const toggleChart = (id) => {
    setExpandedChart(expandedChart === id ? null : id);
  };


  // --- Filtering first ---
  const filteredCharts = useMemo(() => {
    return dietCharts.filter(
      (chart) =>
        chart.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chart.chartName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chart.dosha.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [dietCharts, searchQuery]);

  // --- Then Sorting ---
  const sortedCharts = useMemo(() => {
    let sorted = [...filteredCharts];

    switch (sortOption) {
      case "recent":
        sorted.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
        break;
      case "compliance":
        sorted.sort((a, b) => b.compliance - a.compliance);
        break;
      case "priority":
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        sorted.sort(
          (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
        );
        break;
      default:
        break;
    }
    return sorted;
  }, [filteredCharts, sortOption]);

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Ayurvedic Diet Charts
          </h2>
          <p className="text-gray-600 mt-1">
            Create and manage personalized diet plans based on dosha analysis
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className=" cursor-pointer flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg">
            <Plus className="w-4 h-4" />
            New Diet Chart
          </button>

        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statusFilters.map((filter) => (
          <div
            key={filter.value}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${selectedStatus === filter.value
              ? "border-amber-300 bg-amber-50 shadow-lg"
              : "border-gray-100 bg-white shadow-sm"
              }`}
            onClick={() => setSelectedStatus(filter.value)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {filter.count}
                </div>
                <div className="text-sm text-gray-600">{filter.label}</div>
              </div>
              <div className={`w-3 h-3 rounded-full ${filter.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients, charts, doshas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Sort */}
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className=" cursor-pointer px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            >
              <option value="recent">Sort by Recent</option>
              <option value="compliance">Sort by Compliance</option>
              <option value="priority">Sort by Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm text-amber-700">
            <Leaf className="w-4 h-4" />
            <span>{sortedCharts.length} diet charts found</span>
          </div>
        </div>
      </div>

      {/* Diet Charts Grid */}
      <div className="grid grid-cols-1  gap-6 items-stretch">
        {sortedCharts.map((chart) => (
          <div
            key={chart.id}
            className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Chart Header (clickable) */}
            <div
              className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleChart(chart.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <ChefHat className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{chart.chartName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={getStatusBadge(chart.status)}>{chart.status}</span>
                      <span className={getPriorityBadge(chart.priority)}>
                        {chart.priority} priority
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform ${expandedChart === chart.id ? "rotate-180" : ""
                    }`}
                />
              </div>

              {/* Patient Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="w-4 h-4" />
                    <span>{chart.patientName}</span>
                    <span>• {chart.age}yrs • {chart.gender}</span>
                  </div>
                </div>
                <div className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                  {chart.dosha} Dosha
                </div>
              </div>
            </div>

            {/* Expanded Section with smooth transition */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden ${expandedChart === chart.id ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                }`}
            >
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                {/* your expanded details (meals, notes, actions, etc.) */}
              </div>
            </div>


            {/* Chart Details */}
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-900">
                    {chart.duration}
                  </div>
                  <div className="text-xs text-gray-600">Duration</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div
                    className={`text-2xl font-bold ${getComplianceColor(
                      chart.compliance
                    )}`}
                  >
                    {chart.compliance}%
                  </div>
                  <div className="text-xs text-gray-600">Compliance</div>
                </div>
              </div>

              {/* Progress Indicators */}
              <div className="space-y-2">
                {Object.entries(chart.progress).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-gray-600 capitalize">{key}:</span>
                    <span className="font-medium text-green-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Expanded Details */}
            {expandedChart === chart.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                {/* Meal Plan */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Daily Meal Plan
                  </h4>
                  <div className="space-y-2 text-sm">
                    {Object.entries(chart.meals).map(
                      ([meal, description]) => (
                        <div
                          key={meal}
                          className="flex justify-between items-center p-2 bg-white rounded-lg"
                        >
                          <span className="font-medium capitalize text-gray-700">
                            {meal}:
                          </span>
                          <span className="text-gray-600">{description}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Restrictions & Supplements */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Restrictions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {chart.restrictions.map((restriction, index) => (
                        <span
                          key={index}
                          className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs"
                        >
                          {restriction}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Supplements
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {chart.supplements.map((supplement, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >
                          {supplement}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Clinical Notes
                  </h4>
                  <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                    {chart.notes}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  {/* Left actions */}
                  <div className="flex flex-wrap gap-2">
                    <button className=" cursor-pointer  flex items-center gap-2 bg-amber-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-amber-600 transition-colors w-full sm:w-auto justify-center">
                      <Edit3 className="w-4 h-4" />
                      Edit Chart
                    </button>
                    <button
                      type="button"
                      className="cursor-pointer flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center"
                    >
                      <Send className="w-4 h-4" />
                      Send
                    </button>
                  </div>

                  {/* Right actions */}
                  <div className="flex flex-wrap gap-2 sm:justify-end">
                    <button className="flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
                      <Trash2 className="w-4 h-4 text-red-500" />
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCharts.length === 0 && (
        <div className="text-center py-12">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No diet charts found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery ? `No charts match "${searchQuery}". Try adjusting your search.` : "Get started by creating your first diet chart."}
          </p>
          <button className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-xl font-medium mx-auto">
            <Plus className="w-4 h-4" />
            Create New Chart
          </button>
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-amber-600">92%</div>
            <div className="text-sm text-gray-600">Average Compliance Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">156</div>
            <div className="text-sm text-gray-600">Active Diet Plans</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">4.8★</div>
            <div className="text-sm text-gray-600">Patient Satisfaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DietChartsTab;