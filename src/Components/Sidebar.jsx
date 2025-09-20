import React, { useEffect } from "react";
import { 
  FaClinicMedical, FaUserInjured, FaUserMd, FaHospital, 
  FaStethoscope, FaCalendarAlt, FaChartLine, FaNotesMedical, 
  FaBars, FaTimes, FaSignOutAlt, FaCog, FaChevronDown 
} from "react-icons/fa";

export default function Sidebar({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) {
  const mainTabs = [
    { key: "patients", label: "Patients", icon: <FaUserInjured className="text-lg" /> },
    { key: "doctors", label: "Doctors", icon: <FaUserMd className="text-lg" /> },
    { key: "hospitals", label: "Hospitals", icon: <FaHospital className="text-lg" /> },
    { key: "departments", label: "Departments", icon: <FaStethoscope className="text-lg" /> },
  ];

  const otherTabs = [
    { key: "appointments", label: "Appointments", icon: <FaCalendarAlt className="text-lg" /> },
    { key: "reports", label: "Reports", icon: <FaChartLine className="text-lg" /> },
    { key: "records", label: "Health Records", icon: <FaNotesMedical className="text-lg" /> },
  ];

  const settingsTabs = [
    { key: "settings", label: "Settings", icon: <FaCog className="text-lg" /> },
    { key: "logout", label: "Logout", icon: <FaSignOutAlt className="text-lg" /> },
  ];

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && !event.target.closest('.sidebar') && !event.target.closest('.sidebar-toggle')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [sidebarOpen, setSidebarOpen]);

  // Prevent body scrolling when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [sidebarOpen]);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      
      {/* Sidebar */}
      <aside className={`sidebar w-64 bg-gradient-to-b from-green-800 to-green-900 text-white flex flex-col shadow-xl fixed md:relative h-full z-40 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Header */}
        <div className="p-5 text-xl font-bold border-b border-green-700 flex items-center justify-between">
          <div className="flex items-center">
            <FaClinicMedical className="mr-3 text-green-300" /> 
            <span className="truncate">AyurDietCare</span>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="md:hidden text-green-200 hover:text-white"
          >
            <FaTimes />
          </button>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-4 pt-2 pb-2 text-xs font-semibold text-green-400 uppercase tracking-wider">Main</p>
          {mainTabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${activeTab === key ? "bg-green-700 shadow-md" : "hover:bg-green-700 hover:bg-opacity-50"}`}
            >
              {icon} 
              <span className="ml-3">{label}</span>
            </button>
          ))}
          
          <p className="px-4 pt-6 pb-2 text-xs font-semibold text-green-400 uppercase tracking-wider">Other</p>
          {otherTabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { setActiveTab(key); setSidebarOpen(false); }}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${activeTab === key ? "bg-green-700 shadow-md" : "hover:bg-green-700 hover:bg-opacity-50"}`}
            >
              {icon} 
              <span className="ml-3">{label}</span>
            </button>
          ))}
          
          <p className="px-4 pt-6 pb-2 text-xs font-semibold text-green-400 uppercase tracking-wider">Settings</p>
          {settingsTabs.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => { 
                if (key === 'logout') {
                  // Handle logout logic
                  console.log('Logout clicked');
                } else {
                  setActiveTab(key); 
                }
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full px-4 py-3 rounded-lg transition-all ${activeTab === key ? "bg-green-700 shadow-md" : "hover:bg-green-700 hover:bg-opacity-50"}`}
            >
              {icon} 
              <span className="ml-3">{label}</span>
            </button>
          ))}
        </nav>
        
        {/* User profile */}
        <div className="p-4 border-t border-green-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center shadow-md">
              <FaUserMd className="text-green-200" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">Dr. Smith</p>
              <p className="text-xs text-green-300 truncate">Administrator</p>
            </div>
            <button className="text-green-400 hover:text-white">
              <FaChevronDown className="text-sm" />
            </button>
          </div>
        </div>
      </aside>
      
      {/* Mobile menu button */}
      <button 
        onClick={() => setSidebarOpen(!sidebarOpen)} 
        className="sidebar-toggle fixed bottom-4 right-4 bg-green-700 text-white p-3 rounded-full shadow-lg z-50 md:hidden"
      >
        {sidebarOpen ? <FaTimes /> : <FaBars />}
      </button>
    </>
  );
}