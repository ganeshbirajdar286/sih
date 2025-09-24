import React, { useState } from 'react';
import { 
  FaUserMd, FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt, 
  FaPhoneAlt, FaEllipsisV, FaPlus, FaChevronDown, FaSearch, FaFilter 
} from 'react-icons/fa';

const Appointments = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      doctor: 'Dr. Sarah Johnson', 
      specialty: 'Cardiology', 
      date: '2023-06-15', 
      time: '10:30 AM', 
      status: 'confirmed', 
      type: 'In-person',
      location: 'Medical Center, Floor 3, Room 302',
      doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
    },
    { 
      id: 2, 
      doctor: 'Dr. Michael Chen', 
      specialty: 'Dermatology', 
      date: '2023-06-20', 
      time: '2:15 PM', 
      status: 'confirmed', 
      type: 'Telemedicine',
      location: 'Video Consultation',
      doctorImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
    },
    { 
      id: 3, 
      doctor: 'Dr. Emily Rodriguez', 
      specialty: 'Pediatrics', 
      date: '2023-05-30', 
      time: '9:00 AM', 
      status: 'completed', 
      type: 'In-person',
      location: 'Children\'s Wing, Floor 1, Room 105',
      doctorImage: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
    },
    { 
      id: 4, 
      doctor: 'Dr. James Wilson', 
      specialty: 'Orthopedics', 
      date: '2023-07-05', 
      time: '11:45 AM', 
      status: 'pending', 
      type: 'In-person',
      location: 'Orthopedic Center, Floor 2, Room 210',
      doctorImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80'
    }
  ]);
  const filteredAppointments = appointments
    .filter(app => {
      if (activeTab === 'upcoming') return app.status === 'confirmed' || app.status === 'pending';
      if (activeTab === 'past') return app.status === 'completed';
      return true;
    })
    .filter(app => 
      app.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'date') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'doctor') return a.doctor.localeCompare(b.doctor);
      return 0;
    });

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✅';
      case 'pending': return '⏳';
      case 'completed': return '✅';
      default: return '';
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
            <p className="text-gray-600 mt-2">Manage and schedule your medical appointments</p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg flex items-center transition mt-4 md:mt-0 shadow-md hover:shadow-lg">
            <FaPlus className="mr-2" />
            Schedule Appointment
          </button>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            {/* Tabs */}
            <div className="flex space-x-4 mb-4 md:mb-0">
              {['upcoming', 'past'].map(tab => (
                <button
                  key={tab}
                  className={`pb-2 px-1 font-medium transition ${
                    activeTab === tab
                      ? 'text-green-700 border-b-2 border-green-700'
                      : 'text-gray-500 hover:text-green-600'
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'upcoming' ? 'Upcoming' : 'Past'}
                </button>
              ))}
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search doctors or specialties..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="relative">
                <button 
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full md:w-auto"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter className="text-gray-400 mr-2" />
                  Sort
                  <FaChevronDown className="text-gray-400 ml-2" />
                </button>
                
                {showFilters && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'date' ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                      onClick={() => {
                        setSortBy('date');
                        setShowFilters(false);
                      }}
                    >
                      By Date
                    </button>
                    <button
                      className={`block px-4 py-2 text-sm w-full text-left ${sortBy === 'doctor' ? 'bg-green-50 text-green-700' : 'text-gray-700'}`}
                      onClick={() => {
                        setSortBy('doctor');
                        setShowFilters(false);
                      }}
                    >
                      By Doctor
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Appointments Grid */}
        {filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map(appointment => (
              <div key={appointment.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden">
                <div className="p-6 flex flex-col h-full">
                  {/* Doctor Info */}
                  <div className="flex items-start mb-4">
                    <img 
                      src={appointment.doctorImage} 
                      alt={appointment.doctor}
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{appointment.doctor}</h3>
                      <p className="text-gray-600 text-sm">{appointment.specialty}</p>
                      <span className={`inline-flex mt-2 items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {getStatusIcon(appointment.status)} {appointment.status}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4 flex-1">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-green-600 mr-2" />
                      {formatDate(appointment.date)}
                    </div>
                    <div className="flex items-center">
                      <FaClock className="text-green-600 mr-2" />
                      {appointment.time}
                    </div>
                    <div className="flex items-center">
                      {appointment.type === 'In-person' ? (
                        <FaMapMarkerAlt className="text-green-600 mr-2" />
                      ) : (
                        <FaVideo className="text-green-600 mr-2" />
                      )}
                      {appointment.type}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <FaMapMarkerAlt className="mr-2" />
                      {appointment.location}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-1 gap-3 mt-4">
                    {appointment.status !== 'completed' && (
                      <>
                        <button className="flex items-center justify-center border border-green-500 text-green-600 px-3 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm sm:text-base">
                          Reschedule
                        </button>
                        <button className="flex items-center justify-center border border-red-300  px-3 py-2 rounded-lg hover:bg-green-50 transition-colors text-sm sm:text-base text-red-500">
                          Cancel
                        </button>
                      </>
                    )}
                    <button className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition flex items-center justify-center">
                      <FaPhoneAlt className="mr-2" />
                      {appointment.type === 'Telemedicine' ? 'Join Call' : 'View Details'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <FaCalendarAlt className="text-3xl text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-600">No {activeTab} appointments found</h3>
            <p className="text-gray-500 mt-2">You don't have any {activeTab} appointments scheduled.</p>
            <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
              Schedule Appointment
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
