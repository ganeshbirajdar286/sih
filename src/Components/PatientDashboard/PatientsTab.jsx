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
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="mb-6">
        <DashboardHeader patient={patientData} />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
        
        {/* Column 1 */}
        <div className="grid gap-6">
          <PrakritiSnapshot
            prakriti={patientData.prakriti}
            vikriti={patientData.vikriti}
          />
          <Alerts alerts={patientData.alerts} />
          <LifestyleLog log={patientData.lifestyleLog} />
        </div>

        {/* Column 2 (main content, spans 2 cols on XL) */}
        <div className="grid gap-6 md:col-span-2 lg:col-span-1 xl:col-span-2">
          <WeightTrend data={patientData.weightTrend} />
          <DietaryTracker analysis={patientData.dietaryAnalysis} />
          <ActiveDietPlan plan={patientData.activeDietPlan} />
        </div>

        {/* Column 3 (Appointments + Medical Records) */}
        <div className="grid gap-6 md:col-span-1 lg:col-span-1">
          <Appointments list={patientData.appointments} />
          <MedicalRecords records={patientData.medicalRecords} />
        </div>
       
      </div>
    </div>
  );
}   