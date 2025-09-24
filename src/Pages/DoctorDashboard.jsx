import React, { useState, useEffect } from "react";

// Doctor-specific components
import Header from "../Components/DoctorComponents/Header.jsx";
import Sidebar from "../Components/DoctorComponents/Sidebar.jsx";
import StatCard from "../Components/DoctorComponents/StatCard.jsx";

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
  Heart,
  Brain,
  Scale,
  Thermometer,
  Activity,
  Shield,
  Smartphone,
  Plus,
  ArrowRight,
} from "lucide-react";

// Tabs
import PatientsTab from "../Components/DoctorComponents/PatientsTab.jsx";
import AppointmentsTab from "../Components/DoctorComponents/AppointmentsTab.jsx";
import DietChartsTab from "../Components/DoctorComponents/DietChartsTab.jsx";
import ConsultationsTab from "../Components/DoctorComponents/ConsultationsTab.jsx";
import AyurvedaTab from "../Components/DoctorComponents/AyurvedaTab.jsx";
import ReportsTab from "../Components/DoctorComponents/ReportsTab.jsx";
import ProfileTab from "../Components/DoctorComponents/ProfileTab.jsx";

// Sidebar items
const sidebarItems = [
  { id: "overview", icon: BarChart3, label: "Dashboard Overview", badge: "New" },
  { id: "patients", icon: Users, label: "My Patients", badge: "1.2k" },
  { id: "appointments", icon: Calendar, label: "Appointments", badge: "18" },
  { id: "dietCharts", icon: FileText, label: "Diet Charts", badge: "863" },
  { id: "consultations", icon: Stethoscope, label: "Consultations", badge: "24" },
  { id: "ayurveda", icon: Leaf, label: "Ayurvedic Analysis", badge: "Pro" },
  { id: "reports", icon: Printer, label: "Reports & Analytics", badge: "📊" },
  { id: "profile", icon: User, label: "Doctor Profile", badge: "⭐" },
];

// Quick stats
const quickStats = [
  { label: "Active Patients", value: "247", change: "+12", icon: Users, color: "bg-emerald-500", trend: "up" },
  { label: "Pending Charts", value: "18", change: "-3", icon: FileText, color: "bg-amber-500", trend: "down" },
  { label: "Today's Consult", value: "8", change: "+2", icon: Stethoscope, color: "bg-blue-500", trend: "up" },
  { label: "Success Rate", value: "94.2%", change: "+2.1%", icon: TrendingUp, color: "bg-green-500", trend: "up" },
  { label: "Ayurvedic Plans", value: "156", change: "+8", icon: Leaf, color: "bg-orange-500", trend: "up" },
  { label: "Recipes Used", value: "89", change: "+15", icon: ChefHat, color: "bg-purple-500", trend: "up" },
];

// Recent activities
const recentActivities = [
  { time: "2 min ago", action: "New patient registration", patient: "Rahul Sharma", type: "success", icon: Users },
  { time: "15 min ago", action: "Diet chart created", patient: "Priya Patel", type: "info", icon: FileText },
  { time: "1 hour ago", action: "Consultation completed", patient: "Amit Kumar", type: "success", icon: Stethoscope },
  { time: "2 hours ago", action: "Follow-up scheduled", patient: "Neha Singh", type: "warning", icon: Calendar },
  { time: "3 hours ago", action: "Lab results received", patient: "Vikram Joshi", type: "info", icon: Activity },
];

// Health metrics
const healthMetrics = [
  { icon: Heart, label: "Avg. BP", value: "120/80", status: "normal", trend: "stable" },
  { icon: Scale, label: "Avg. Weight", value: "68.2kg", status: "good", trend: "down" },
  { icon: Thermometer, label: "Avg. BMI", value: "23.1", status: "healthy", trend: "stable" },
  { icon: Brain, label: "Mental Score", value: "8.2/10", status: "excellent", trend: "up" },
];

// Dosha distribution
const doshaDistribution = [
  { dosha: "Vata", percentage: 35, color: "bg-blue-500", patients: 86 },
  { dosha: "Pitta", percentage: 45, color: "bg-red-500", patients: 111 },
  { dosha: "Kapha", percentage: 20, color: "bg-yellow-500", patients: 50 },
];

// Quick actions
const quickActions = [
  { icon: Plus, label: "New Patient", description: "Add new patient record", color: "bg-emerald-500", link: "patients" },
  { icon: FileText, label: "Create Diet Chart", description: "Generate Ayurvedic diet plan", color: "bg-blue-500", link: "dietCharts" },
  { icon: Calendar, label: "Schedule Consult", description: "Book patient consultation", color: "bg-purple-500", link: "appointments" },  
  { icon: Stethoscope, label: "New Consultation", description: "Start a new consultation", color: "bg-green-500", link: "consultations" },
];

// Enhanced Overview Component
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
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full text-xs">
              <Clock className="w-3 h-3" />
              <span>Last login: 08:45 AM</span>
            </div>
            <div className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded-full text-xs">
              <Shield className="w-3 h-3" />
              <span>HIPAA Compliant</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 text-right space-y-1">
          <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">18</div>
          <div className="text-emerald-100 text-sm">Appointments Today</div>
          <div className="flex items-center justify-end gap-1 text-emerald-100 text-xs">
            <Smartphone className="w-3 h-3" />
            <span>Mobile Ready</span>
          </div>
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

    {/* Quick Stats */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {quickStats.map((stat, index) => (
        <div key={index} className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <span className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
              {stat.change}
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">{stat.value}</div>
          <div className="text-xs text-gray-600 truncate">{stat.label}</div>
        </div>
      ))}
    </div>

    {/* Main Dashboard */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        {/* Health Metrics */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Patient Health Metrics</h3>
            <div className="flex items-center gap-1">
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Live</span>
              <Activity className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                <metric.icon className={`w-6 h-6 mx-auto mb-1 ${
                  metric.status === "excellent" ? "text-green-600" :
                  metric.status === "good" ? "text-blue-600" :
                  metric.status === "normal" ? "text-emerald-600" : "text-amber-600"
                }`} />
                <div className="font-bold text-gray-900 text-sm">{metric.value}</div>
                <div className="text-xs text-gray-600">{metric.label}</div>
                <div className={`text-xs mt-0.5 ${
                  metric.trend === "up" ? "text-green-600" :
                  metric.trend === "down" ? "text-red-600" : "text-gray-500"
                }`}>
                  {metric.trend === "up" ? "↗ Improving" : metric.trend === "down" ? "↘ Attention" : "→ Stable"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Dosha Distribution */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Dosha Distribution</h3>
            <Leaf className="w-4 h-4 text-orange-500" />
          </div>
          <div className="space-y-3">
            {doshaDistribution.map((dosha, index) => (
              <div key={index} className="flex items-center justify-between p-2 hover:bg-orange-50 rounded-lg transition-colors duration-150">
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${dosha.color}`}></div>
                  <span className="font-medium text-gray-900 text-sm">{dosha.dosha}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-gray-600">{dosha.patients} patients</span>
                  <div className="w-24 bg-gray-200 rounded-full h-1.5">
                    <div 
                      className={`h-1.5 rounded-full ${dosha.color} transition-all duration-800 ease-out`}
                      style={{ width: `${dosha.percentage}%` }}
                    ></div>
                  </div>
                  <span className="font-bold text-gray-900 text-xs w-6 text-right">{dosha.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Recent Activities */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
            <div className="flex items-center gap-1">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Live</span>
            </div>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 hover:bg-emerald-50 rounded-lg transition-all duration-150 group">
                <div className={`p-1.5 rounded-md ${
                  activity.type === "success" ? "bg-green-100 text-green-600" :
                  activity.type === "warning" ? "bg-amber-100 text-amber-600" : "bg-blue-100 text-blue-600"
                }`}>
                  <activity.icon className="w-3 h-3" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 text-sm group-hover:text-emerald-700 truncate">{activity.action}</div>
                  <div className="text-xs text-gray-600 truncate">{activity.patient}</div>
                  <div className="text-xs text-gray-400 flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder for Upcoming Appointments */}
        <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Upcoming Appointments</h3>
          <p className="text-xs text-gray-500">No upcoming appointments</p>
        </div>
      </div>
    </div>
  </div>
);

export default function DoctorDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const contentMap = {
    overview: <EnhancedOverview currentTime={currentTime} setActiveTab={setActiveTab} />,
    patients: <PatientsTab searchQuery={searchQuery} />,
    appointments: <AppointmentsTab searchQuery={searchQuery} />,
    dietCharts: <DietChartsTab />,
    consultations: <ConsultationsTab />,
    ayurveda: <AyurvedaTab />,
    reports: <ReportsTab />,
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
