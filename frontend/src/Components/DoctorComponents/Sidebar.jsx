import React from "react";
import { X, LogOut } from "lucide-react";
import { useSelector } from "react-redux";

const Sidebar = ({ sidebarItems, activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const { doctorProfile } = useSelector((s) => s.doctor);

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 flex flex-col w-64
          bg-white border-r border-gray-100 shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:relative md:shadow-none`}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-200">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">SWASTHYA</p>
              <p className="text-xs text-emerald-600 font-medium">Doctor Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Doctor Profile Mini */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-2xl">
            {doctorProfile?.Image_url ? (
              <img
                src={doctorProfile.Image_url}
                alt={doctorProfile.Name}
                className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                {doctorProfile?.Name?.[0] || "D"}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {doctorProfile?.Name || "Dr. Sharma"}
              </p>
              <p className="text-xs text-emerald-600 truncate">
                {doctorProfile?.Specialization || "Ayurvedic Physician"}
              </p>
            </div>
            {/* Online indicator */}
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-emerald-100 shrink-0" />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest px-2 mb-3">
            Main Menu
          </p>
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all duration-200 group
                      ${isActive
                        ? "bg-emerald-500 text-white shadow-md shadow-emerald-200"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <div className={`p-1.5 rounded-lg transition-colors
                      ${isActive
                        ? "bg-white/20"
                        : "bg-gray-100 group-hover:bg-emerald-100 group-hover:text-emerald-600"
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                    </div>

                    <span className="font-medium text-sm flex-1">{item.label}</span>

                    {item.badge && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold
                        ${isActive
                          ? "bg-white/20 text-white"
                          : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group">
            <div className="p-1.5 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-colors">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;