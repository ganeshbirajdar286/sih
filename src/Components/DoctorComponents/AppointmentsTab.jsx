import React, { useState } from "react";
import {
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Phone,
  Video,
  MapPin,
  Clock,
  User,
  Star,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Mail,
  MessageSquare,
  Download,
  Share2,
  Zap
} from "lucide-react";

const AppointmentsTab = ({ searchQuery }) => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedAppointment, setExpandedAppointment] = useState(null);

  // Sample appointments data
  const appointments = [
    {
      id: 1,
      patientName: "Priya Sharma",
      age: 32,
      gender: "Female",
      time: "09:30 AM",
      date: "2024-01-15",
      duration: "45 min",
      type: "New Consultation",
      status: "confirmed",
      priority: "high",
      contact: "+91 98765 43210",
      email: "priya.sharma@email.com",
      symptoms: ["Digestive issues", "Sleep disorder", "Stress"],
      lastVisit: "2023-12-10",
      notes: "Follow-up for Panchakarma treatment",
      dosha: "Vata-Pitta"
    },
    {
      id: 2,
      patientName: "Rajesh Kumar",
      age: 45,
      gender: "Male",
      time: "10:45 AM",
      date: "2024-01-15",
      duration: "30 min",
      type: "Follow-up",
      status: "confirmed",
      priority: "medium",
      contact: "+91 87654 32109",
      email: "rajesh.kumar@email.com",
      symptoms: ["Joint pain", "Arthritis"],
      lastVisit: "2024-01-08",
      notes: "Ayurvedic massage therapy review",
      dosha: "Vata"
    },
    {
      id: 3,
      patientName: "Anita Desai",
      age: 28,
      gender: "Female",
      time: "11:30 AM",
      date: "2024-01-15",
      duration: "60 min",
      type: "Diet Consultation",
      status: "pending",
      priority: "high",
      contact: "+91 76543 21098",
      email: "anita.desai@email.com",
      symptoms: ["Weight management", "PCOS"],
      lastVisit: "First visit",
      notes: "New patient - requires complete assessment",
      dosha: "Kapha"
    },
    {
      id: 4,
      patientName: "Vikram Joshi",
      age: 52,
      gender: "Male",
      time: "02:15 PM",
      date: "2024-01-15",
      duration: "20 min",
      type: "Medicine Review",
      status: "confirmed",
      priority: "low",
      contact: "+91 65432 10987",
      email: "vikram.joshi@email.com",
      symptoms: ["Blood pressure", "Diabetes"],
      lastVisit: "2024-01-05",
      notes: "Routine medicine adjustment",
      dosha: "Pitta"
    },
    {
      id: 5,
      patientName: "Neha Singh",
      age: 35,
      gender: "Female",
      time: "03:30 PM",
      date: "2024-01-15",
      duration: "45 min",
      type: "Therapy Session",
      status: "cancelled",
      priority: "medium",
      contact: "+91 54321 09876",
      email: "neha.singh@email.com",
      symptoms: ["Anxiety", "Migraine"],
      lastVisit: "2024-01-12",
      notes: "Shirodhara therapy scheduled",
      dosha: "Vata"
    }
  ];

  const statusFilters = [
    { value: "all", label: "All Appointments", count: appointments.length, color: "bg-gray-500" },
    { value: "confirmed", label: "Confirmed", count: appointments.filter(a => a.status === "confirmed").length, color: "bg-green-500" },
    { value: "pending", label: "Pending", count: appointments.filter(a => a.status === "pending").length, color: "bg-amber-500" },
    { value: "cancelled", label: "Cancelled", count: appointments.filter(a => a.status === "cancelled").length, color: "bg-red-500" }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending": return <ClockIcon className="w-4 h-4 text-amber-500" />;
      case "cancelled": return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <ClockIcon className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-800 border-red-200",
      medium: "bg-amber-100 text-amber-800 border-amber-200",
      low: "bg-green-100 text-green-800 border-green-200"
    };
    return `px-2 py-1 rounded-full text-xs font-medium border ${styles[priority]}`;
  };

  const toggleAppointment = (id) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = searchQuery
      ? appointment.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appointment.dosha.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesStatus = selectedStatus === "all" || appointment.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Appointments Management
          </h2>
          <p className="text-gray-600 mt-1">
            {searchQuery ? `Searching for "${searchQuery}" • ` : ""}
            Manage your patient appointments efficiently
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg">
            <Calendar className="w-4 h-4" />
            New Appointment
          </button>
          <button className="flex items-center gap-2 border border-emerald-200 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-xl font-medium transition-all duration-200">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statusFilters.map((filter) => (
          <div
            key={filter.value}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${selectedStatus === filter.value
              ? 'border-emerald-300 bg-emerald-50 shadow-lg'
              : 'border-gray-100 bg-white shadow-sm'
              }`}
            onClick={() => setSelectedStatus(filter.value)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{filter.count}</div>
                <div className="text-sm text-gray-600">{filter.label}</div>
              </div>
              <div className={`w-3 h-3 rounded-full ${filter.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, types, doshas..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="priority">Sort by Priority</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{filteredAppointments.length} appointments found</span>
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Appointment Header */}
            <div
              className="p-4 cursor-pointer border-b hover:bg-gray-50 transition"
              onClick={() => toggleAppointment(appointment.id)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Left Side - Patient Info */}
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg shrink-0">
                    <User className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div className="flex flex-col">
                    {/* Patient Name, Age, Priority */}
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{appointment.patientName}</h3>
                      <span className="text-sm text-gray-500">
                        • {appointment.age} yrs • {appointment.gender}
                      </span>
                      <span className={`${getPriorityBadge(appointment.priority)} text-xs`}>
                        {appointment.priority} priority
                      </span>
                    </div>

                    {/* Time, Type, Dosha */}
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {appointment.time} • {appointment.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(appointment.status)}
                        {appointment.type}
                      </span>
                      <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                        {appointment.dosha} Dosha
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side - Date & Expand Icon */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                  <div className="text-left sm:text-right">
                    <div className="font-medium text-gray-900">{appointment.date}</div>
                    <div className="text-sm text-gray-500">Last visit: {appointment.lastVisit}</div>
                  </div>
                  {expandedAppointment === appointment.id ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>


            {/* Expanded Details */}
            {expandedAppointment === appointment.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Patient Details */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Patient Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact:</span>
                        <span className="font-medium">{appointment.contact}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{appointment.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Dosha Type:</span>
                        <span className="font-medium text-purple-600">{appointment.dosha}</span>
                      </div>
                    </div>
                  </div>

                  {/* Symptoms */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Symptoms & Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {appointment.symptoms.map((symptom, index) => (
                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {symptom}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                      <button className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        <Edit3 className="w-4 h-4" />
                        Reschedule
                      </button>
                      <button className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        Send Reminder
                      </button>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Clinical Notes</h4>
                  <p className="text-sm text-gray-600">{appointment.notes}</p>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Confirm */}
                    <button className="flex items-center justify-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      Confirm
                    </button>

                    {/* Call */}
                    <button className="flex items-center justify-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-amber-600 transition-colors">
                      <Phone className="w-4 h-4" />
                      Call
                    </button>

                    {/* Share */}
                    <button className="flex items-center justify-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>

                    {/* Cancel */}
                    <button className="flex items-center justify-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      <Trash2 className="w-4 h-4 text-red-500" />
                      Cancel
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredAppointments.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600">
            {searchQuery ? `No appointments match "${searchQuery}". Try adjusting your search.` : "No appointments scheduled for today."}
          </p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTab;