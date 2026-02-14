// src/components/DashboardHeader.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaPrint,
  FaCalendarAlt,
  FaWeight,
  FaRulerVertical,
  FaHeartbeat,
} from "react-icons/fa";
import { Patient } from "../../feature/Patient/patient.thunk";

const StatCard = ({ icon, label, value }) => {
  const Icon = icon;

  return (
    <div className="bg-white rounded-lg p-4 sm:p-5 flex items-center shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100">
      <div className="p-3 bg-green-100 text-green-600 rounded-full mr-3 sm:mr-4 flex-shrink-0">
        <Icon size={20} className="sm:w-6 sm:h-6" />
      </div>

      <div className="min-w-0">
        <p className="text-xs sm:text-sm text-gray-500 mb-0.5">
          {label}
        </p>
        <p className="text-lg sm:text-xl font-bold text-gray-800 truncate">
          {value || "—"}
        </p>
      </div>
    </div>
  );
};

const DashboardHeader = () => {
    const dispatch =useDispatch()
  const { patient, dosha } = useSelector(
    (state) => state.patient
  );
  useEffect(()=>{
    dispatch(Patient())
  },[dispatch])
  if (!patient) {
    return (
      <div className="text-gray-500 text-lg">
        Loading patient data...
      </div>
    );
  }
  const bmi =
    patient.Height && patient.Weight
      ? (
          patient.Weight /
          ((patient.Height / 100) * (patient.Height / 100))
        ).toFixed(1)
      : "N/A";

  return (
    <div className="mb-6 sm:mb-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 sm:mb-6 gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-1 sm:mb-2">
            {patient.Name}
          </h1>

          <p className="text-sm sm:text-base text-gray-500">
            {`${patient.Age} years old, ${patient.Gender} • Predominant Dosha: `}
            <span className="font-semibold text-green-600">
              {dosha?.dominantPrakriti || "—"}
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
          <button className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg shadow-md flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:scale-105">
            <FaPrint className="mr-2" />
            <span className="text-sm sm:text-base">
              Print Report
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard
          icon={FaWeight}
          label="Weight"
          value={`${patient.Weight || 0} kg`}
        />

        <StatCard
          icon={FaRulerVertical}
          label="Height"
          value={`${patient.Height || 0} cm`}
        />

        <StatCard
          icon={FaHeartbeat}
          label="BMI"
          value={bmi}
        />
      </div>
    </div>
  );
};

export default DashboardHeader;
