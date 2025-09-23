import React from "react";
import { X } from "lucide-react";

const Sidebar = ({ sidebarItems, activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-white/95 to-emerald-50/80 backdrop-blur-xl border-r border-emerald-200/60 flex flex-col shadow-lg shadow-emerald-900/5 z-50 transform transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:w-64 w-64`}
      >
        {/* Close button (mobile only) */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition"
          >
            <X className="w-6 h-6 text-emerald-700" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto  sidebar-scroll">
          {/* Navigation */}
          <nav className="p-4 sm:p-6">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-emerald-900/60 uppercase tracking-wider px-2 sm:px-4 mb-3">
                Main Menu
              </h3>
              <ul className="space-y-1">
                {sidebarItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        setActiveTab(item.id);
                        setSidebarOpen(false); // close on mobile
                      }}
                      className={`w-full flex items-center space-x-3 sm:space-x-4 px-3 sm:px-5 py-3 sm:py-4 rounded-2xl text-left font-medium transition-all duration-300 group relative overflow-hidden ${
                        activeTab === item.id
                          ? "bg-gradient-to-r from-emerald-500/10 to-green-600/10 text-emerald-700 shadow-md border border-emerald-200/50"
                          : "text-gray-600 hover:bg-white/80 hover:text-emerald-700 hover:shadow-md hover:border hover:border-emerald-100/50"
                      }`}
                    >
                      {activeTab === item.id && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-r-full"></div>
                      )}

                      <div
                        className={`p-2 rounded-xl transition-all duration-300 ${
                          activeTab === item.id
                            ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md"
                            : "bg-emerald-100/50 text-emerald-600 group-hover:bg-emerald-500/20 group-hover:text-emerald-700"
                        }`}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-semibold text-sm sm:text-base">{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
