import React from "react";

const StatCard = ({ stat }) => {
  const Icon = stat.icon;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex-1">
          {/* Label */}
          <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>

          {/* Value */}
          <p className="text-3xl font-bold text-gray-900 mb-3">{stat.value}</p>

          {/* Change Info */}
          <div className="flex items-center">
            <Icon className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-sm text-emerald-600 font-medium">{stat.change}</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>

        {/* Right Icon Box */}
        <div
          className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}
        >
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
