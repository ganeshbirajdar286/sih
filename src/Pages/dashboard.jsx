import React, { useState } from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import PatientsTab from "../Components/PatientsTab";
import DoctorsTab from "../Components/DoctorsTab";
import HospitalsTab from "../Components/HospitalsTab";
import DepartmentsTab from "../Components/DepartmentsTab";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("patients");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const renderContent = () => {
    switch (activeTab) {
      case "patients": return <PatientsTab />;
      case "doctors": return <DoctorsTab searchQuery={searchQuery} />;
      case "hospitals": return <HospitalsTab />;
      case "departments": return <DepartmentsTab />;
      default: return <div>Welcome to the Dashboard</div>;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <main className="flex-1 md:ml-0 transition-all duration-300">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <div className="p-6">{renderContent()}</div>
      </main>
    </div>
  );
}
