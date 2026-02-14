import React from "react";
import DashboardHeader from "../PatientComponents/DashboardHeader";
import PrakritiSnapshot from "../PatientComponents/PrakritiSnapshot";
import LifestyleLog from "../PatientComponents/LifestyleLog";
import Alerts from "../PatientComponents/Alerts";
import WeightTrend from "../PatientComponents/WeightTrend";
import DietaryTracker from "../PatientComponents/DietaryTracker";
import ActiveDietPlan from "../PatientComponents/ActiveDietPlan";
import MedicalRecords from "../PatientComponents/MedicalRecords";
import Appointments from "../PatientComponents/Appointments";
import { patientData } from "../data/mockData";

export default function PatientsTab() {
  return (
    <div className="w-full p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      
      {/* Header */}
      <div className="mb-6">
        <DashboardHeader patient={patientData} />
      </div>

      {/* Full Width Grid */}
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-1
          xl:grid-cols-3
          gap-6
          w-full
        "
      >
        
        {/* LEFT */}
        <div className="flex flex-col gap-6">
          <PrakritiSnapshot/>
          <Alerts alerts={patientData.alerts} />
          <LifestyleLog log={patientData.lifestyleLog} />
        </div>

        {/* CENTER */}
        <div className="flex flex-col gap-6 md:col-span-2 xl:col-span-2">
          <WeightTrend data={patientData.weightTrend} />
          <DietaryTracker analysis={patientData.dietaryAnalysis} />
          <ActiveDietPlan plan={patientData.activeDietPlan} />
        </div>

      </div>
    </div>
  );
}
 