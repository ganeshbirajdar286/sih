import React from 'react';
import { Search, Bell, MessageSquare, Stethoscope } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-emerald-100 sticky top-0 z-50">
      <div className="px-8 py-4 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AyurDiet Pro</h1>
            <p className="text-sm text-emerald-600 font-medium">Doctor Dashboard</p>
          </div>
        </div>

        {/* Search + Actions */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, appointments..."
              className="pl-12 pr-4 py-3 w-96 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm"
            />
          </div>

          <div className="flex items-center space-x-3">
            <button className="relative p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">3</span>
              </span>
            </button>
            <button className="p-2.5 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors">
              <MessageSquare className="w-6 h-6" />
            </button>
          </div>

          {/* Doctor Info */}
          <div className="flex items-center space-x-4 pl-4 border-l border-emerald-100">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center shadow-sm">
              <Stethoscope className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Dr. Ayurveda Sharma</p>
              <p className="text-sm text-emerald-600 font-medium">Ayurvedic Physician</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
