import React, { useState } from 'react';
import { Search, Plus, UserCheck, Star, Calendar, Filter } from 'lucide-react';

const MyPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');



  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-emerald-50 to-amber-50 p-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-linear-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                My Patients
              </h1>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 px-5 py-3 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-linear-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Patient</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-linear-to-br from-white to-emerald-50 rounded-2xl p-6 shadow-sm border border-emerald-100">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <UserCheck className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-linear-to-br from-white to-amber-50 rounded-2xl p-6 shadow-sm border border-amber-100">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-amber-100 rounded-xl">
              <UserCheck className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-linear-to-br from-white to-red-50 rounded-2xl p-6 shadow-sm border border-red-100">
          <div className="flex items-center justify-between">

            <div className="p-3 bg-red-100 rounded-xl">
              <Star className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-linear-to-br from-white to-blue-50 rounded-2xl p-6 shadow-sm border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">2</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-lg">
          <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-400" />
          <input
            type="text"
            placeholder="Search patients by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-4 w-full border border-emerald-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-lg focus:shadow-xl transition-all duration-200"
          />
        </div>
      </div>

      {/* Enhanced Patients Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
        <div className="px-6 py-4 bg-linear-to-r from-emerald-50 to-green-50 border-b border-emerald-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-emerald-900">Patient Records</h3>
           
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-linear-to-r from-slate-50 to-gray-50">
              <tr>
                <th className="px-8 py-5 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Condition</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Dosha</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Last Visit</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Next Appointment</th>
                <th className="px-6 py-5 text-left text-sm font-semibold text-emerald-900 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-right text-sm font-semibold text-emerald-900 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
          </table>
        </div>
        
        
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-8 right-8 md:hidden">
        <button className="w-14 h-14 bg-linear-to-r from-emerald-500 to-green-600 rounded-2xl shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-200 transform hover:scale-110">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MyPatients;