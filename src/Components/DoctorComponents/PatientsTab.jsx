import React, { useState } from 'react';
import { Search, Plus, UserCheck, UserX, Edit, Trash2, Star, Calendar, Filter, MoreVertical, Phone, Mail, MapPin } from 'lucide-react';

const MyPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

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
      nextAppointment: 'Tomorrow, 10:00 AM',
      email: 'priya.sharma@email.com',
      phone: '+91 98765 43210',
      location: 'Mumbai'
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
      nextAppointment: 'Sep 28, 2:30 PM',
      email: 'rajesh.kumar@email.com',
      phone: '+91 87654 32109',
      location: 'Delhi'
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
      nextAppointment: 'Not scheduled',
      email: 'anita.desai@email.com',
      phone: '+91 76543 21098',
      location: 'Bangalore'
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
      nextAppointment: 'Today, 4:00 PM',
      email: 'vikram.singh@email.com',
      phone: '+91 65432 10987',
      location: 'Chennai'
    },
  ]);

  const getStatusColor = (status) => ({
    active: 'text-green-600 bg-green-50 border-green-200',
    inactive: 'text-orange-600 bg-orange-50 border-orange-200',
  }[status] || 'text-gray-600 bg-gray-100 border-gray-200');

  const getPriorityColor = (priority) => ({
    high: 'bg-gradient-to-br from-red-500 to-red-600',
    medium: 'bg-gradient-to-br from-amber-400 to-amber-500',
    low: 'bg-gradient-to-br from-green-400 to-green-500',
  }[priority] || 'bg-gradient-to-br from-gray-300 to-gray-400');

  const getPriorityBadge = (priority) => ({
    high: 'bg-red-100 text-red-800 border border-red-200',
    medium: 'bg-amber-100 text-amber-800 border border-amber-200',
    low: 'bg-green-100 text-green-800 border border-green-200',
  }[priority] || 'bg-gray-100 text-gray-800');

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || p.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: patients.length,
    active: patients.filter(p => p.status === 'active').length,
    highPriority: patients.filter(p => p.priority === 'high').length,
    appointmentsToday: patients.filter(p => p.nextAppointment.includes('Today')).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-600 mt-1">Manage and track your patient care journey</p>
        </div>
        <button className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200">
          <Plus className="w-5 h-5" />
          Add New Patient
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Patients', value: stats.total, icon: UserCheck, color: 'from-blue-500 to-cyan-500' },
          { label: 'Active', value: stats.active, icon: UserCheck, color: 'from-green-500 to-emerald-500' },
          { label: 'High Priority', value: stats.highPriority, icon: Star, color: 'from-red-500 to-orange-500' },
          { label: 'Appointments Today', value: stats.appointmentsToday, icon: Calendar, color: 'from-purple-500 to-pink-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients by name or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-xl font-medium transition-all ${
                  activeFilter === filter
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-600 hover:bg-gray-100 border border-transparent'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
            <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div key={patient.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* Header with Priority Indicator */}
            <div className={`h-2 ${getPriorityColor(patient.priority)}`}></div>
            
            <div className="p-6">
              {/* Patient Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${getPriorityColor(patient.priority)}`}>
                    {patient.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{patient.name}</h3>
                    <p className="text-sm text-gray-600">{patient.age} years • {patient.location}</p>
                  </div>
                </div>
                
                {/* Priority Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(patient.priority)}`}>
                  {patient.priority} priority
                </span>
              </div>

              {/* Contact Info */}
              <div className="flex gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <span>{patient.phone}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{patient.email}</span>
                </div>
              </div>

              {/* Medical Info */}
              <div className="space-y-3 mb-6">
                <div>
                  <span className="text-xs font-medium text-gray-500">Condition</span>
                  <p className="font-medium text-gray-900">{patient.condition}</p>
                </div>
                <div className="flex gap-4">
                  <div>
                    <span className="text-xs font-medium text-gray-500">Dosha</span>
                    <p className="font-medium text-amber-700">{patient.dosha}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-gray-500">Last Visit</span>
                    <p className="font-medium text-gray-900">{patient.lastVisit}</p>
                  </div>
                </div>
              </div>

              {/* Status and Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(patient.status)}`}>
                    {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                  </span>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className={patient.nextAppointment.includes('Today') ? 'text-green-600 font-medium' : 'text-gray-700'}>
                      {patient.nextAppointment}
                    </span>
                  </div>
                </div>

                {/* Actions Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(dropdownOpen === patient.id ? null : patient.id)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                  </button>

                  {dropdownOpen === patient.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-2">
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm">
                        <Edit className="w-4 h-4 text-blue-600"/> 
                        Edit Patient
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm">
                        <Calendar className="w-4 h-4 text-green-600"/> 
                        Schedule Visit
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-purple-600"/> 
                        Contact Patient
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-sm text-red-600">
                        <Trash2 className="w-4 h-4"/> 
                        Delete Patient
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <UserX className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
          <button 
            onClick={() => { setSearchTerm(''); setActiveFilter('all'); }}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default MyPatients;