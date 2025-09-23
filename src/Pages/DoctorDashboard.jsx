import React, { useState } from "react";

// Doctor-specific components
import Header from "../components/DoctorComponents/Header.jsx";
import Sidebar from "../components/DoctorComponents/Sidebar.jsx";
import StatCard from "../components/DoctorComponents/StatCard.jsx";

import {
  Users,
  Calendar,
  FileText,
  Settings,
  Stethoscope,
  BookOpen,
  ChefHat,
  Leaf,
  User,
  BarChart3,
  Printer,
  Target,
} from "lucide-react";

// Example doctor tabs (you can create actual components later)
import PatientsTab from "../components/DoctorComponents/PatientsTab.jsx";
import AppointmentsTab from "../components/DoctorComponents/AppointmentsTab.jsx";
import DietChartsTab from "../components/DoctorComponents/DietChartsTab.jsx";
import ConsultationsTab from "../components/DoctorComponents/ConsultationsTab.jsx";
import FoodDatabaseTab from "../components/DoctorComponents/FoodDatabaseTab.jsx";
import RecipeLibraryTab from "../components/DoctorComponents/RecipeLibraryTab.jsx";
import AyurvedaTab from "../components/DoctorComponents/AyurvedaTab.jsx";
import ReportsTab from "../components/DoctorComponents/ReportsTab.jsx";
import ProfileTab from "../components/DoctorComponents/ProfileTab.jsx";
import SettingsTab from "../components/DoctorComponents/SettingsTab.jsx";

// Sidebar items (same structure as patient dashboard)
const sidebarItems = [
  { id: "overview", icon: BarChart3, label: "Dashboard Overview" },
  { id: "patients", icon: Users, label: "My Patients" },
  { id: "appointments", icon: Calendar, label: "Appointments" },
  { id: "dietCharts", icon: FileText, label: "Diet Charts" },
  { id: "consultations", icon: Stethoscope, label: "Consultations" },
  { id: "foodDatabase", icon: BookOpen, label: "Food Database" },
  { id: "recipes", icon: ChefHat, label: "Recipe Library" },
  { id: "ayurveda", icon: Leaf, label: "Ayurvedic Analysis" },
  { id: "reports", icon: Printer, label: "Reports & Analytics" },
  { id: "profile", icon: User, label: "Doctor Profile" },
  { id: "settings", icon: Settings, label: "Settings" },
];

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 👇 Content map (same pattern as PatientDashboard)
  const contentMap = {
    overview: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Example stat cards */}
          <StatCard
            stat={{
              title: "Total Patients",
              value: "1,247",
              change: "+12%",
              icon: Users,
              color: "bg-emerald-500",
            }}
          />
          <StatCard
            stat={{
              title: "Today's Appointments",
              value: "18",
              change: "+3",
              icon: Calendar,
              color: "bg-emerald-600",
            }}
          />
          <StatCard
            stat={{
              title: "Diet Charts Created",
              value: "863",
              change: "+8%",
              icon: FileText,
              color: "bg-teal-500",
            }}
          />
          <StatCard
            stat={{
              title: "Success Rate",
              value: "94.2%",
              change: "+2.1%",
              icon: Target,
              color: "bg-green-600",
            }}
          />
        </div>
      </div>
    ),
    patients: <PatientsTab searchQuery={searchQuery} />,
    appointments: <AppointmentsTab searchQuery={searchQuery} />,
    dietCharts: <DietChartsTab />,
    consultations: <ConsultationsTab />,
    foodDatabase: <FoodDatabaseTab />,
    recipes: <RecipeLibraryTab />,
    ayurveda: <AyurvedaTab />,
    reports: <ReportsTab />,
    profile: <ProfileTab />,
    settings: <SettingsTab />,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        sidebarItems={sidebarItems}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 overflow-y-auto p-6 transition-all duration-300">
          {contentMap[activeTab]}
        </div>
      </main>
    </div>
  );
}
