import React, { useState } from "react";

// Doctor-specific components
import Header from "../Components/DoctorComponents/Header.jsx";
import Sidebar from "../Components/DoctorComponents/Sidebar.jsx";
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
  TrendingUp,
  Clock,
  MessageSquare,
  Star,
  Heart,
  Brain,
  Scale,
  Thermometer,
  Activity,
} from "lucide-react";

// Example doctor tabs
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

// Sidebar items
const sidebarItems = [
  { id: "overview", icon: BarChart3, label: "Dashboard Overview", badge: "New" },
  { id: "patients", icon: Users, label: "My Patients", badge: "1.2k" },
  { id: "appointments", icon: Calendar, label: "Appointments", badge: "18" },
  { id: "dietCharts", icon: FileText, label: "Diet Charts", badge: "863" },
  { id: "consultations", icon: Stethoscope, label: "Consultations", badge: "24" },
  { id: "foodDatabase", icon: BookOpen, label: "Food Database", badge: "2.5k" },
  { id: "recipes", icon: ChefHat, label: "Recipe Library", badge: "500+" },
  { id: "ayurveda", icon: Leaf, label: "Ayurvedic Analysis", badge: "Pro" },
  { id: "reports", icon: Printer, label: "Reports & Analytics", badge: "📊" },
  { id: "profile", icon: User, label: "Doctor Profile", badge: "⭐" },
  { id: "settings", icon: Settings, label: "Settings", badge: "⚙️" },
];

// Quick stats data
const quickStats = [
  { label: "Active Patients", value: "247", change: "+12", icon: Users, color: "bg-emerald-500" },
  { label: "Pending Charts", value: "18", change: "-3", icon: FileText, color: "bg-amber-500" },
  { label: "Today's Consult", value: "8", change: "+2", icon: Stethoscope, color: "bg-blue-500" },
  { label: "Success Rate", value: "94.2%", change: "+2.1%", icon: TrendingUp, color: "bg-green-500" },
];

// Recent activities data
const recentActivities = [
  { time: "2 min ago", action: "New patient registration", patient: "Rahul Sharma", type: "success" },
  { time: "15 min ago", action: "Diet chart created", patient: "Priya Patel", type: "info" },
  { time: "1 hour ago", action: "Consultation completed", patient: "Amit Kumar", type: "success" },
  { time: "2 hours ago", action: "Follow-up scheduled", patient: "Neha Singh", type: "warning" },
  { time: "3 hours ago", action: "Lab results received", patient: "Vikram Joshi", type: "info" },
];

// Upcoming appointments
const upcomingAppointments = [
  { time: "09:30 AM", patient: "Anita Desai", type: "New Patient", status: "confirmed" },
  { time: "10:45 AM", patient: "Rajesh Mehta", type: "Follow-up", status: "confirmed" },
  { time: "11:30 AM", patient: "Sneha Reddy", type: "Consultation", status: "pending" },
  { time: "02:15 PM", patient: "Kiran Patil", type: "Diet Review", status: "confirmed" },
];

const healthMetrix = [
  { icon: Heart, label: "Avg. BP", value: "120/80", status: "normal" },
  { icon: Scale, label: "Avg. Weight", value: "68.2kg", status: "good" },
  { icon: Thermometer, label: "Avg. BMI", value: "23.1", status: "healthy" },
  { icon: Brain, label: "Mental Score", value: "8.2/10", status: "excellent" },
]

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Enhanced Overview Content
  const EnhancedOverview = () => (
    <>
      {/* Welcome Section */}
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-emerald-500/25">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 lg:gap-0">
            {/* Left Content */}
            <div className="flex-1 space-y-4">
              <h1 className="text-2xl sm:text-3xl font-bold">Welcome back, Dr. Sharma! 👋</h1>
              <p className="text-emerald-100 text-sm sm:text-lg">Here's what's happening with your practice today</p>
              {/* Info Chips */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mt-2 sm:mt-4">
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-full text-xs sm:text-sm">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Last login: Today, 08:45 AM</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-full text-xs sm:text-sm">
                  <Activity className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>System: All services operational</span>
                </div>
              </div>
            </div>

            {/* Right Stats */}
            <div className="flex-shrink-0 text-right">
              <div className="text-4xl sm:text-5xl font-bold mb-1 sm:mb-2">18</div>
              <div className="text-emerald-100 text-sm sm:text-base">Appointments Today</div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>


        {/* Main Stats + Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Health Metrics Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Health Metrics Overview</h3>
                <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Live</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {healthMetrix.map((metric, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 rounded-xl">
                    <metric.icon
                      className={`w-8 h-8 mx-auto mb-2 ${metric.status === "excellent"
                          ? "text-green-600"
                          : metric.status === "good"
                            ? "text-blue-600"
                            : metric.status === "normal"
                              ? "text-emerald-600"
                              : "text-amber-600"
                        }`}
                    />
                    <div className="font-semibold text-gray-900">{metric.value}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recent Activities */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Activities</h3>
                <MessageSquare className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 hover:bg-emerald-50 rounded-xl transition-colors duration-200"
                  >
                    <div
                      className={`w-2 h-2 mt-2 rounded-full ${activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "warning"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                        }`}
                    ></div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{activity.action}</div>
                      <div className="text-sm text-gray-600">{activity.patient}</div>
                      <div className="text-xs text-gray-400">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Appointments */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-emerald-100/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Upcoming Appointments</h3>
                <Clock className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-emerald-50 rounded-xl transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-3 h-3 rounded-full ${appointment.status === "confirmed" ? "bg-green-500" : "bg-amber-500"
                          }`}
                      ></div>
                      <div>
                        <div className="font-semibold text-gray-900">{appointment.time}</div>
                        <div className="text-sm text-gray-600">{appointment.patient}</div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${appointment.type === "New Patient"
                          ? "bg-blue-100 text-blue-800"
                          : appointment.type === "Follow-up"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                    >
                      {appointment.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ayurvedic Insights */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold mb-2">Ayurvedic Insights</h3>
              <p className="text-amber-100">
                Latest analysis shows improved patient outcomes with traditional treatments
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">87%</div>
              <div className="text-amber-100">Effectiveness Rate</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  const contentMap = {
    overview: <EnhancedOverview />,
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
    <div className="flex h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarItems={sidebarItems}
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
        <div className="flex-1 overflow-y-auto p-8 transition-all duration-300">
          <div className="max-w-7xl mx-auto">{contentMap[activeTab]}</div>
        </div>
      </main>
    </div>
  );
}