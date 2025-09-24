import React from "react";
import DashboardHeader from "../PatientComponents/DashboardHeader";
import PrakritiSnapshot from "../PatientComponents/PrakritiSnapshot";
import LifestyleLog from "../PatientComponents/LifestyleLog";
import Alerts from "../PatientComponents/Alerts";
import HerbalRecommendations from "../PatientComponents/HerbalRecommendations";
import WeightTrend from "../PatientComponents/WeightTrend";
import DietaryTracker from "../PatientComponents/DietaryTracker";
import ActiveDietPlan from "../PatientComponents/ActiveDietPlan";
import MedicalRecords from "../PatientComponents/MedicalRecords";
import Appointments from "../PatientComponents/Appointments"; // ✅ Fixed import
import { patientData } from "../data/mockData";

export default function PatientsTab() {
  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <DashboardHeader patient={patientData} />

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:col-span-3 xl:grid-cols-4 gap-8">
        {/* Column 1 */}
        <div className="grid gap-8 lg:col-span-3">
          <PrakritiSnapshot
            prakriti={patientData.prakriti}
            vikriti={patientData.vikriti}
          />
          <Alerts alerts={patientData.alerts} />
          <HerbalRecommendations
            recommendations={patientData.herbalRecommendations}
          />
        </div>

        {/* Column 2 (spans 2 cols on large screens) */}
        <div className="grid gap-8 lg:col-span-3">
          <WeightTrend data={patientData.weightTrend} />
          <DietaryTracker analysis={patientData.dietaryAnalysis} />
          <ActiveDietPlan plan={patientData.activeDietPlan} />
        </div>

        {/* Column 3 */}
        <div className="grid gap-8 lg:order-first xl:order-last">
          <LifestyleLog log={patientData.lifestyleLog} />
          <Appointments list={patientData.appointments} />
          <MedicalRecords records={patientData.medicalRecords} />
        </div>
      </div>
    </div>
  );
}
