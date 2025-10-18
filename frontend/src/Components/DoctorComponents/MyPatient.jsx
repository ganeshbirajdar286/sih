import React, { useState } from 'react';
import { Search, Plus, UserCheck, UserX, Edit, Trash2, Star, Calendar, Filter, MoreVertical } from 'lucide-react';

const MyPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([
    { 
      id: 1, 
      name: 'Priya Sharma', 
      age: 34, 
      condition: 'Digestive Issues', 
      dosha: 'Vata Imbalance', 
      lastVisit: '2 days ago', 
      status: 'active',
      priority: 'high',
      nextAppointment: 'Tomorrow, 10:00 AM'
    },
    { 
      id: 2, 
      name: 'Rajesh Kumar', 
      age: 45, 
      condition: 'Weight Management', 
      dosha: 'Kapha Excess', 
      lastVisit: '1 week ago', 
      status: 'active',
      priority: 'medium',
      nextAppointment: 'Sep 28, 2:30 PM'
    },
    { 
      id: 3, 
      name: 'Anita Desai', 
      age: 28, 
      condition: 'Stress & Anxiety', 
      dosha: 'Pitta Aggravation', 
      lastVisit: '3 days ago', 
      status: 'inactive',
      priority: 'low',
      nextAppointment: 'Not scheduled'
    },
    { 
      id: 4, 
      name: 'Vikram Singh', 
      age: 52, 
      condition: 'Diabetes Management', 
      dosha: 'Tri-Dosha', 
      lastVisit: '5 days ago', 
      status: 'active',
      priority: 'high',
      nextAppointment: 'Today, 4:00 PM'
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-emerald-600 bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200';
      case 'inactive': return 'text-amber-600 bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200';
      default: return 'text-gray-600 bg-gray-100 border border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-gradient-to-r from-red-500 to-pink-600';
      case 'medium': return 'bg-gradient-to-r from-amber-500 to-orange-500';
      case 'low': return 'bg-gradient-to-r from-emerald-500 to-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-amber-50 p-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg">
              <UserCheck className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-700 bg-clip-text text-transparent">
                My Patients
              </h1>
              <p className="text-gray-600 mt-1 flex items-center space-x-1">
                <span>Manage your patient records and consultations</span>
                <span className="text-emerald-500">•</span>
                <span className="font-medium">{patients.length} patients</span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 px-5 py-3 rounded-xl shadow-sm transition-all duration-200 hover:shadow-md">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add New Patient</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl p-6 shadow-sm border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{patients.length}</p>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl">
              <UserCheck className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl p-6 shadow-sm border border-amber-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {patients.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-amber-100 rounded-xl">
              <UserCheck className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl p-6 shadow-sm border border-red-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {patients.filter(p => p.priority === 'high').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-xl">
              <Star className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl p-6 shadow-sm border border-blue-100">
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
        <div className="px-6 py-4 bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-emerald-900">Patient Records</h3>
            <span className="text-sm text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              {filteredPatients.length} patients found
            </span>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gradient-to-r from-slate-50 to-gray-50">
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
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gradient-to-r from-emerald-50/50 to-green-50/50 transition-all duration-200 group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${getPriorityColor(patient.priority)}`}></div>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                          {patient.priority === 'high' && <Star className="w-4 h-4 text-red-500 fill-current" />}
                        </div>
                        <p className="text-sm text-gray-600">{patient.age} years</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-medium text-gray-900">{patient.condition}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-800 border border-amber-200">
                      {patient.dosha}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-gray-700">{patient.lastVisit}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-emerald-500" />
                      <span className={`font-medium ${patient.nextAppointment.includes('Today') ? 'text-emerald-600' : 'text-gray-700'}`}>
                        {patient.nextAppointment}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(patient.status)} shadow-sm`}>
                      {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="p-3 text-emerald-600 hover:text-emerald-700 rounded-xl hover:bg-emerald-100 transition-all duration-200 shadow-sm hover:shadow-md">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-3 text-amber-600 hover:text-amber-700 rounded-xl hover:bg-amber-100 transition-all duration-200 shadow-sm hover:shadow-md">
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button className="p-3 text-red-600 hover:text-red-700 rounded-xl hover:bg-red-50 transition-all duration-200 shadow-sm hover:shadow-md">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-3 text-gray-600 hover:text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPatients.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
              <UserX className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No patients found</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              No patients match your search criteria. Try adjusting your search terms or add a new patient.
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button for Mobile */}
      <div className="fixed bottom-8 right-8 md:hidden">
        <button className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl shadow-2xl flex items-center justify-center text-white hover:shadow-3xl transition-all duration-200 transform hover:scale-110">
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default MyPatients;