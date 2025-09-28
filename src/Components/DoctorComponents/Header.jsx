import React from "react";
import { Stethoscope, Menu } from "lucide-react";
import logo from "../../assets/logo.png"

const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header className="bg-white shadow-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">

        {/* Left Branding */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="w-15 h-15 mr-2 rounded-full shadow-md overflow-hidden bg-green-700 flex items-center justify-center">
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


        {/* Doctor Info */}
        <div className="flex items-center space-x-3 sm:space-x-4 pl-3 sm:pl-4 border-l border-emerald-100">
          <div className="w-15 h-15 mr-2 rounded-full shadow-md overflow-hidden bg-green-700 flex items-center justify-center">
                      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVXRMrZHp2Vv7XePQtwJZrf0FmbXoUWw53iQ&s" alt="logo" className="w-full h-full object-cover " />
                    </div>
          <div className="block">
            <p className="font-semibold text-gray-900 text-sm sm:text-base">
              Dr.  Sharma
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
