import React, { useState, useEffect } from "react";


import Header from "../Components/DoctorComponents/Header.jsx";
import Sidebar from "../Components/DoctorComponents/Sidebar.jsx";
import DoshaDistributionCard from "../Components/DoctorComponents/DoshaDistributionCard.jsx";

import {
  Users,
  Calendar,
  FileText,
  Stethoscope,
  Leaf,
  User,
  BarChart3,
  Plus,
  ArrowRight,
} from "lucide-react";


import PatientsTab from "../Components/DoctorComponents/PatientsTab.jsx";
import AppointmentsTab from "../Components/DoctorComponents/AppointmentsTab.jsx";
import DietChartsTab from "../Components/DoctorComponents/DietChartsTab.jsx";
import ProfileTab from "../Components/DoctorComponents/ProfileTab.jsx";
import AppointmentCount from "../Components/DoctorComponents/AppointmentCount.jsx";
import { AllPatientsDosha } from "../feature/Doctor/doctor.thunk.js";
import { useDispatch } from "react-redux";

const sidebarItems = [
  { id: "overview", icon: BarChart3, label: "Dashboard Overview", badge: "New" },
  { id: "patients", icon: Users, label: "My Patients", badge: "1.2k" },
  { id: "appointments", icon: Calendar, label: "Appointments", badge: "18" },
  { id: "dietCharts", icon: FileText, label: "Diet Charts", badge: "863" },
  { id: "profile", icon: User, label: "Doctor Profile", badge: "⭐" },
];








const quickActions = [
  { icon: Plus, label: "New Patient", description: "Add new patient record", color: "bg-emerald-500", link: "patients" },
  { icon: FileText, label: "Create Diet Chart", description: "Generate Ayurvedic diet plan", color: "bg-blue-500", link: "dietCharts" },
  { icon: Calendar, label: "Schedule Consult", description: "Book patient consultation", color: "bg-purple-500", link: "appointments" },  
  { icon: Stethoscope, label: "New Consultation", description: "Start a new consultation", color: "bg-green-500", link: "consultations" },
];


const EnhancedOverview = ({ currentTime, setActiveTab }) => (
  <div className="space-y-6">
    {/* Welcome Section */}
    <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-700 rounded-2xl p-6 text-white shadow-2xl shadow-emerald-500/25 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-12 translate-y-12"></div>
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-emerald-100 bg-white/20 px-2 py-0.5 rounded-full text-xs">Ayurvedic Practitioner</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">Welcome back, Dr. Sharma! 👋</h1>
          <p className="text-emerald-100 text-sm">Here's what's happening with your Ayurvedic practice today</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="text-lg font-mono font-bold">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-emerald-100 text-sm">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 text-right space-y-1">
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">18</div>
          <div className="text-emerald-100 text-sm">Appointments Today</div>
        </div>
      </div>
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickActions.map((action, index) => (
        <div 
          key={index}
          className="bg-white rounded-xl p-4 shadow-md border border-emerald-100/50 hover:shadow-lg transition-all duration-200 hover:translate-y-0.5 cursor-pointer group"
          onClick={() => setActiveTab(action.link)}
        >
          <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200`}>
            <action.icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-1">{action.label}</h3>
          <p className="text-gray-600 text-xs">{action.description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">Click to open</span>
            <ArrowRight className="w-3 h-3 text-gray-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all duration-200" />
          </div>
        </div>
      ))}
    </div>

    {/* Main Dashboard */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <AppointmentCount/>

        <DoshaDistributionCard />

      </div>
    </div>
  </div>
);

export default function DoctorDashboard({callPatient}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(()=>{
   dispatch(AllPatientsDosha())
  },[])
  const contentMap = {
    overview: <EnhancedOverview currentTime={currentTime} setActiveTab={setActiveTab} />,
    patients: <PatientsTab searchQuery={searchQuery} callPatient={callPatient} />,
    appointments: <AppointmentsTab searchQuery={searchQuery} />,
    dietCharts: <DietChartsTab />,
    profile: <ProfileTab />,
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarItems={sidebarItems}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
        <div className="flex-1 overflow-y-auto p-4 transition-all duration-300">
          <div className="w-full mx-auto">
            <div className="flex items-center gap-1 text-xs text-gray-600 mb-4">
              <span className="text-emerald-600">Dashboard</span>
              <ArrowRight className="w-3 h-3" />
              <span className="font-medium text-gray-900 capitalize">{activeTab}</span>
            </div>
            {contentMap[activeTab]}
          </div>
        </div>
      </main>
    </div>
  );
}
