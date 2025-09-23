import React from "react";
import { Search, Stethoscope, Menu } from "lucide-react";

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">

        {/* Left Branding */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Stethoscope className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              AyurDiet Pro
            </h1>
            <p className="text-xs sm:text-sm text-emerald-600 font-medium">
              Doctor Dashboard
            </p>
          </div>
        </div>

        {/* Search Bar (always visible) */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="w-full pl-12 pr-4 py-2 rounded-xl border border-emerald-200 
                         focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 
                         bg-white text-gray-700 text-sm shadow-sm"
            />
          </div>
        </div>

        {/* Doctor Info */}
        <div className="hidden sm:flex items-center space-x-3 sm:space-x-4 pl-3 sm:pl-4 border-l border-emerald-100">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center shadow-sm">
            <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
          </div>
          <div className="hidden md:block">
            <p className="font-semibold text-gray-900 text-sm sm:text-base">
              Dr. Ayurveda Sharma
            </p>
            <p className="text-xs sm:text-sm text-emerald-600 font-medium">
              Ayurvedic Physician
            </p>
          </div>
        </div>

        {/* Mobile menu icon */}
        <div className="md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-emerald-600 rounded-xl transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
