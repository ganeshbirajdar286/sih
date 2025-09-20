import React, { useState } from "react";

// Component Imports
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import PatientsTab from "../Components/PatientsTab";
import DoctorsTab from "../Components/DoctorsTab";
import HospitalsTab from "../Components/HospitalsTab";
import DepartmentsTab from "../Components/DepartmentsTab";

// --- Create Placeholder Components for your new tabs ---
const AppointmentsTab = () => <div className="p-8"> <h1 className="text-3xl font-bold">Appointments</h1> </div>;
const ReportsTab = () => <div className="p-8"> <h1 className="text-3xl font-bold">Reports</h1> </div>;
const HealthRecordsTab = () => <div className="p-8"> <h1 className="text-3xl font-bold">Health Records</h1> </div>;
const SettingsTab = () => <div className="p-8"> <h1 className="text-3xl font-bold">Settings</h1> </div>;


// This is your main dashboard page, which acts as the orchestrator.
export default function Dashboard() {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState("patients");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- DECLARATIVE CONTENT RENDERING ---
  // Using an object map is a clean way to handle conditional rendering.
  const contentMap = {
    // Main Tabs
    patients: <PatientsTab searchQuery={searchQuery} />,
    doctors: <DoctorsTab searchQuery={searchQuery} />,
    hospitals: <HospitalsTab searchQuery={searchQuery} />,
    departments: <DepartmentsTab searchQuery={searchQuery} />,
    
    // Other Tabs (Newly Added)
    appointments: <AppointmentsTab />,
    reports: <ReportsTab />,
    records: <HealthRecordsTab />,

    // Settings Tab (Newly Added)
    settings: <SettingsTab />,
  };
  
  // A fallback component for any unknown tab state.
  const defaultContent = <div>Welcome to the Dashboard</div>;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
    
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <div className="flex-1 overflow-y-auto p-6">
          {contentMap[activeTab] || defaultContent}
        </div>

      </main>
    </div>
  );
}