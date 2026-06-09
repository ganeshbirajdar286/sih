import React from "react";
import {  Menu } from "lucide-react";
import logo from "../../assets/logo.png"

const Header = ({  setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">

        {/* Left Branding */}
        <div className="flex items-center space-x-3 shrink-0">
          <div className="w-10 h-10 mr-2 rounded-full shadow-md overflow-hidden bg-green-700 flex items-center justify-center">
                      <img src={logo} alt="logo" className="w-full h-full object-cover" />
                    </div>
          <div className="hidden sm:block">
           <h1 className="text-xl md:text-2xl font-bold text-green-800">
            SWASTHYA
          </h1>
            <p className="text-xs sm:text-sm text-emerald-600 font-medium">
              Doctor Dashboard
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
