// src/components/DashboardHeader.jsx
import React from 'react';
import { FaPrint, FaCalendarAlt, FaWeight, FaRulerVertical, FaHeartbeat } from 'react-icons/fa';

const StatCard = ({ icon, label, value }) => {
    const Icon = icon;
    return (
        <div className="bg-white rounded-lg p-4 sm:p-5 flex items-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
            <div className="p-3 bg-green-100 text-green-600 rounded-full mr-3 sm:mr-4 flex-shrink-0">
                <Icon size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-500 mb-0.5">{label}</p>
                <p className="text-lg sm:text-xl font-bold text-gray-800 truncate">{value}</p>
            </div>
        </div>
    );
};

const DashboardHeader = ({ patient }) => {
    return (
        <div className="mb-6 sm:mb-8 animate-fadeIn">
            {/* Top Row: Title and Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-4">
                <div className="w-full md:w-auto">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
                        {patient.name}
                    </h1>
                    <p className="text-sm sm:text-base text-gray-500">
                        {`${patient.age} years old, ${patient.gender} • Predominant Dosha: `}
                        <span className="font-semibold text-green-600">{patient.dosha}</span>
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
                    <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <FaPrint className="mr-2" /> 
                        <span className="text-sm sm:text-base">Print Report</span>
                    </button>
                    <button className="bg-gray-700 cursor-pointer hover:bg-gray-800 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-105">
                        <FaCalendarAlt className="mr-2" /> 
                        <span className="text-sm sm:text-base">Schedule</span>
                    </button>
                </div>
            </div>
            
            {/* Bottom Row: Key Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <StatCard icon={FaWeight} label="Weight" value={patient.keyStats.weight} />
                <StatCard icon={FaRulerVertical} label="Height" value={patient.keyStats.height} />
                <StatCard icon={FaHeartbeat} label="BMI" value={patient.keyStats.bmi} />
            </div>
        </div>
    );
};

export default DashboardHeader;