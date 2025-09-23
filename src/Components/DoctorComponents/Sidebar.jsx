import React from "react";

const Sidebar = ({ sidebarItems, activeTab, setActiveTab }) => {
  return (
    <aside className="w-80 bg-gradient-to-b from-white/95 to-emerald-50/80 backdrop-blur-xl min-h-screen border-r border-emerald-200/60 flex flex-col shadow-lg shadow-emerald-900/5">
      {/* Logo Section */}
      {/* Navigation */}
      <nav className="p-6 flex-1">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-emerald-900/60 uppercase tracking-wider px-4 mb-3">
            Main Menu
          </h3>
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl text-left font-medium transition-all duration-300 group relative overflow-hidden ${
                    activeTab === item.id
                      ? "bg-gradient-to-r from-emerald-500/10 to-green-600/10 text-emerald-700 shadow-md border border-emerald-200/50"
                      : "text-gray-600 hover:bg-white/80 hover:text-emerald-700 hover:shadow-md hover:border hover:border-emerald-100/50"
                  }`}
                >
                  {/* Active indicator */}
                  {activeTab === item.id && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-emerald-500 to-green-600 rounded-r-full"></div>
                  )}
                  
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    activeTab === item.id 
                      ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md" 
                      : "bg-emerald-100/50 text-emerald-600 group-hover:bg-emerald-500/20 group-hover:text-emerald-700"
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Footer CTA */}
      <div className="p-6 border-t border-emerald-200/40 bg-white/40 backdrop-blur-sm">
        <button className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300">
          + New Appointment
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
