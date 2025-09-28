import React, { useState } from 'react';
import { FaFileMedical, FaNotesMedical, FaPrescription, FaAllergies, FaProcedures, FaHeartbeat, FaDownload, FaEye, FaShare, FaFilter, FaSearch } from 'react-icons/fa';

const HealthRecords = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const healthRecords = [
    {
      id: 1,
      type: 'Lab Results',
      title: 'Blood Test Report',
      date: '2023-06-10',
      doctor: 'Dr. Sarah Johnson',
      status: 'completed',
      description: 'Complete blood count and metabolic panel',
      tags: ['Lab', 'Blood Work'],
    },
    {
      id: 2,
      type: 'Prescription',
      title: 'Medication - Amoxicillin',
      date: '2023-06-05',
      doctor: 'Dr. Michael Chen',
      status: 'active',
      description: '500mg twice daily for 7 days',
      tags: ['Medication', 'Antibiotic'],
    },
    {
      id: 3,
      type: 'Imaging',
      title: 'X-Ray - Right Arm',
      date: '2023-05-22',
      doctor: 'Dr. Emily Rodriguez',
      status: 'completed',
      description: 'No fracture detected, minor sprain',
      tags: ['X-Ray', 'Orthopedic'],
    },
    {
      id: 4,
      type: 'Vaccination',
      title: 'Flu Vaccination Record',
      date: '2023-05-15',
      doctor: 'Dr. James Wilson',
      status: 'completed',
      description: 'Annual influenza vaccine',
      tags: ['Vaccine', 'Preventive'],
    },
    {
      id: 5,
      type: 'Allergy',
      title: 'Allergy Test Results',
      date: '2023-04-30',
      doctor: 'Dr. Michael Chen',
      status: 'active',
      description: 'Seasonal allergies identified',
      tags: ['Allergy', 'Test'],
    },
    {
      id: 6,
      type: 'Surgery',
      title: 'Appendectomy Report',
      date: '2022-11-12',
      doctor: 'Dr. Robert Brown',
      status: 'completed',
      description: 'Laparoscopic appendectomy procedure',
      tags: ['Surgery', 'Procedure'],
    },
  ];

  const recordTypes = [
    { id: 'all', name: 'All Records', icon: <FaFileMedical />, count: healthRecords.length },
    { id: 'lab', name: 'Lab Results', icon: <FaHeartbeat />, count: healthRecords.filter(r => r.type === 'Lab Results').length },
    { id: 'prescription', name: 'Prescriptions', icon: <FaPrescription />, count: healthRecords.filter(r => r.type === 'Prescription').length },
    { id: 'imaging', name: 'Imaging', icon: <FaProcedures />, count: healthRecords.filter(r => r.type === 'Imaging').length },
    { id: 'vaccination', name: 'Vaccinations', icon: <FaAllergies />, count: healthRecords.filter(r => r.type === 'Vaccination').length },
  ];

  const filteredRecords = healthRecords.filter(record => {
    if (activeTab === 'all') return true;
    if (activeTab === 'lab') return record.type === 'Lab Results';
    if (activeTab === 'prescription') return record.type === 'Prescription';
    if (activeTab === 'imaging') return record.type === 'Imaging';
    if (activeTab === 'vaccination') return record.type === 'Vaccination';
    return true;
  }).filter(record =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Lab Results': return <FaHeartbeat className="text-blue-500" />;
      case 'Prescription': return <FaPrescription className="text-purple-500" />;
      case 'Imaging': return <FaProcedures className="text-yellow-500" />;
      case 'Vaccination': return <FaAllergies className="text-green-500" />;
      case 'Allergy': return <FaAllergies className="text-red-500" />;
      case 'Surgery': return <FaNotesMedical className="text-indigo-500" />;
      default: return <FaFileMedical className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Health Records</h1>
            <p className="text-gray-600 mt-2">Access and manage your medical history</p>
          </div>
          <button className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg flex items-center transition mt-4 md:mt-0 shadow-md hover:shadow-lg">
            <FaFileMedical className="mr-2" />
            Upload Record
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {recordTypes.map(type => (
            <div
              key={type.id}
              className={`bg-white p-4 rounded-xl shadow-sm cursor-pointer transition hover:shadow-md ${activeTab === type.id ? 'border-l-4 border-green-500' : ''}`}
              onClick={() => setActiveTab(type.id)}
            >
              <div className="flex justify-between items-center">
                <div className="text-2xl">{type.icon}</div>
                <div className="text-2xl font-bold text-gray-800">{type.count}</div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mt-2">{type.name}</h3>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Tabs */}
            <div className="flex space-x-4 overflow-x-auto pb-2 whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {recordTypes.map((type) => (
                <button
                  key={type.id}
                  className={` cursor-pointer whitespace-nowrap pb-2 px-1 font-medium transition ${activeTab === type.id
                      ? "text-green-700 border-b-2 border-green-700"
                      : "text-gray-500 hover:text-green-600"
                    }`}
                  onClick={() => setActiveTab(type.id)}
                >
                  {type.name}
                </button>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 w-full">
              {/* Search */}
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>


        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length > 0 ? (
            filteredRecords.map(record => (
              <div key={record.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="p-6 md:flex md:justify-between">
                  {/* Left Section */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg mr-4">
                      <div className="text-xl">
                        {getTypeIcon(record.type)}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{record.title}</h3>
                      <p className="text-gray-600">{record.type} • {record.doctor}</p>
                      <p className="text-gray-700 mt-2">{record.description}</p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {record.tags.map(tag => (
                          <span key={tag} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Section */}
                  <div className="mt-4 md:mt-0 flex flex-col items-end">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>

                    <div className="mt-4 text-sm text-gray-500">
                      {formatDate(record.date)}
                    </div>

                    <div className="flex mt-4 space-x-2">
                      <button className="cursor-pointer p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-green-50 transition">
                        <FaEye className="text-lg" />
                      </button>
                      <button className="cursor-pointer p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition">
                        <FaDownload className="text-lg" />
                      </button>
                      <button className="cursor-pointer p-2 text-gray-500 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition">
                        <FaShare className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <FaFileMedical className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-600">No health records found</h3>
              <p className="text-gray-500 mt-2">No records match your current filters.</p>
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                onClick={() => {
                  setActiveTab('all');
                  setSearchTerm('');
                }}
              >
                View All Records
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthRecords;