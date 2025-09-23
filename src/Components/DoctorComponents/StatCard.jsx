import React from 'react';
import { TrendingUp } from 'lucide-react';

const StatCard = ({ stat }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-3">{stat.value}</p>
          <div className="flex items-center">
            <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
            <span className="text-sm text-emerald-600 font-medium">{stat.change}</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </div>
        <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
          <stat.icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;