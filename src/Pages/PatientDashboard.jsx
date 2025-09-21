import React, { useState } from "react";

// Patient-specific components
import Sidebar from "../Components/PatientDashboard/Sidebar";
import Header from "../Components/PatientDashboard/Header";
import DoctorsTab from "../Components/PatientComponents/DoctorsTab";
import HospitalsTab from "../Components/PatientDashboard/HospitalsTab";
import DepartmentsTab from "../Components/PatientDashboard/DepartmentsTab";
import Appointments from "../Components/PatientDashboard/Appointment";
import HealthRecords from "../Components/PatientDashboard/HealthRecord";
import Reports from "../Components/PatientDashboard/Reports";
import PatientsTab from "../Components/PatientDashboard/PatientsTab.jsx";

export default function PatientDashboard() {
  // 👇 default tab set to "patients"
  const [activeTab, setActiveTab] = useState("patients");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const contentMap = {
    patients: <PatientsTab searchQuery={searchQuery} />,
    doctors: <DoctorsTab searchQuery={searchQuery} />,
    hospitals: <HospitalsTab searchQuery={searchQuery} />,
    departments: <DepartmentsTab searchQuery={searchQuery} />,
    appointments: <Appointments />,
    reports: <Reports />,
    records: <HealthRecords />,
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 transition-all duration-300">
          {contentMap[activeTab]}
        </div>
      </main>
    </div>
  );
}
