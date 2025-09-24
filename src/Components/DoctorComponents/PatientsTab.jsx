import React, { useState } from 'react';
import { Search, Plus, UserCheck, UserX, Edit, Trash2 } from 'lucide-react';

const MyPatients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState([
    { id: 1, name: 'Priya Sharma', age: 34, condition: 'Digestive Issues', dosha: 'Vata Imbalance', lastVisit: '2 days ago', status: 'active' },
    { id: 2, name: 'Rajesh Kumar', age: 45, condition: 'Weight Management', dosha: 'Kapha Excess', lastVisit: '1 week ago', status: 'active' },
    { id: 3, name: 'Anita Desai', age: 28, condition: 'Stress & Anxiety', dosha: 'Pitta Aggravation', lastVisit: '3 days ago', status: 'inactive' },
    { id: 4, name: 'Vikram Singh', age: 52, condition: 'Diabetes Management', dosha: 'Tri-Dosha', lastVisit: '5 days ago', status: 'active' },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-emerald-600 bg-emerald-100 border border-emerald-200';
      case 'inactive': return 'text-red-600 bg-red-100 border border-red-200';
      default: return 'text-gray-600 bg-gray-100 border border-gray-200';
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Patients</h1>
          <p className="text-gray-600 mt-1">Manage your patient records and consultations</p>
        </div>
        <button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-5 py-3 rounded-xl shadow-md transition-all duration-200">
          <Plus className="w-5 h-5" />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search patients by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 w-full border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-emerald-100">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-emerald-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Age</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Condition</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Dosha</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Last Visit</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-emerald-800">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-emerald-800">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPatients.map((patient) => (
              <tr key={patient.id} className="hover:bg-emerald-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                <td className="px-6 py-4 text-gray-700">{patient.age}</td>
                <td className="px-6 py-4 text-gray-700">{patient.condition}</td>
                <td className="px-6 py-4 text-gray-700">{patient.dosha}</td>
                <td className="px-6 py-4 text-gray-700">{patient.lastVisit}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right flex justify-end space-x-2">
                  <button className="p-2.5 text-emerald-600 hover:text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredPatients.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No patients found matching your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPatients;