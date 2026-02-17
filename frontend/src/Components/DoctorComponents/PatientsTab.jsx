import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { myPatient } from "../../feature/Doctor/doctor.thunk";
import {
  Calendar,
  Search,
  Eye,
  Edit3,
  Trash2,
  Phone,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Zap,
  Loader2,
} from "lucide-react";

const PatientTab = () => {
  const dispatch = useDispatch();
  const { appointment, loading, error } = useSelector((state) => state.doctor);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [expandedAppointment, setExpandedAppointment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(myPatient());
  }, [dispatch]);

  // ── Derived Stats ──
  const totalCount = appointment.length;
  const upcomingCount = appointment.filter(
    (a) => a.Status === "Confirmed" || a.Status === "Pending"
  ).length;
  const completedCount = appointment.filter(
    (a) => a.Status === "Completed"
  ).length;

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending":
        return <ClockIcon className="w-4 h-4 text-amber-500" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <ClockIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const toggleAppointment = (id) => {
    setExpandedAppointment(expandedAppointment === id ? null : id);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // ── Filter & Sort ──
  const filteredAppointments = appointment
    .filter((appt) => {
      const patient = appt.Patient_id;
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        [patient?.Name, appt.Condition, appt.Status, appt.Time_slot, patient?.Email]
          .join(" ")
          .toLowerCase()
          .includes(search);
      const matchesStatus =
        selectedStatus === "all" ||
        appt.Status?.toLowerCase() === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date")
        return new Date(a.Appointment_Date) - new Date(b.Appointment_Date);
      if (sortBy === "name")
        return (a.Patient_id?.Name || "").localeCompare(b.Patient_id?.Name || "");
      return 0;
    });

  // ── Loading State ──
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <span className="ml-3 text-gray-500 text-sm">Loading appointments...</span>
      </div>
    );
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <XCircle className="w-12 h-12 text-red-400 mb-3" />
        <p className="text-gray-700 font-medium">Failed to load appointments</p>
        <p className="text-gray-500 text-sm mt-1">{error}</p>
        <button
          onClick={() => dispatch(myPatient())}
          className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      {/* ── Header with Stats ── */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900">My Appointments</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage and schedule your medical appointments
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
          {/* Total */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>

          {/* Upcoming */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Upcoming</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">{upcomingCount}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <ClockIcon className="w-6 h-6 text-emerald-600" />
            </div>
          </div>

          {/* Completed */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Completed</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{completedCount}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, conditions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="cursor-pointer px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>

          {/* Status filter pills */}
          <div className="flex gap-2 flex-wrap">
            {["all", "confirmed", "pending", "cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStatus(s)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                  selectedStatus === s
                    ? "bg-emerald-600 text-white shadow"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>{filteredAppointments.length} appointments found</span>
        </div>
      </div>

      {/* ── Appointment Cards ── */}
      <div className="space-y-3">
        {filteredAppointments.map((appt) => {
          const patient = appt.Patient_id;
          return (
            <div
              key={appt._id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              {/* Card Row */}
              <div className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                  {/* Left: Patient Info */}
                  <div
                    className="flex items-start sm:items-center gap-3 cursor-pointer flex-1"
                    onClick={() => toggleAppointment(appt._id)}
                  >
                    {/* Avatar */}
                    {patient?.Image_url ? (
                      <img
                        src={patient.Image_url}
                        alt={patient.Name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-gray-100"
                      />
                    ) : (
                      <div className="p-2 bg-emerald-50 rounded-xl shrink-0">
                        <User className="w-5 h-5 text-emerald-600" />
                      </div>
                    )}

                    <div className="flex flex-col">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900 capitalize">
                          {patient?.Name || "Unknown"}
                        </h3>
                        <span className="text-sm text-gray-500">• {patient?.Age} yrs</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeStyle(appt.Status)}`}
                        >
                          {appt.Status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {appt.Time_slot}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(appt.Appointment_Date)}
                        </span>
                        {appt.Condition && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs">
                            {appt.Condition}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Action Buttons + Expand */}
                  <div className="flex items-center gap-2 shrink-0">

                    {/* Cancel Button */}
                    <button
                      className="flex items-center gap-1.5 border border-red-200 bg-white text-red-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        // dispatch(cancelAppointment(appt._id)) — wire when ready
                        alert(`Cancel appointment for ${patient?.Name}?`);
                      }}
                    >
                      <XCircle className="w-4 h-4" />
                      Cancel
                    </button>

                    {/* Call Button */}
                    <button
                      className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (patient?.PhoneNumber) {
                          window.location.href = `tel:${patient.PhoneNumber}`;
                        }
                      }}
                    >
                      <Phone className="w-4 h-4" />
                      Call
                    </button>

                    {/* Expand toggle */}
                    <div
                      className="cursor-pointer p-1"
                      onClick={() => toggleAppointment(appt._id)}
                    >
                      {expandedAppointment === appt._id ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Expanded Details ── */}
              {expandedAppointment === appt._id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Patient Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Patient Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Phone:</span>
                          <span className="font-medium">{patient?.PhoneNumber || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <span className="font-medium text-right break-all">{patient?.Email || "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Age:</span>
                          <span className="font-medium">{patient?.Age} yrs</span>
                        </div>
                      </div>
                    </div>

                    {/* Appointment Details */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Appointment Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Date:</span>
                          <span className="font-medium">{formatDate(appt.Appointment_Date)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Time Slot:</span>
                          <span className="font-medium">{appt.Time_slot}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status:</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeStyle(appt.Status)}`}>
                            {appt.Status}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Booked On:</span>
                          <span className="font-medium">{formatDate(appt.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
                      <div className="flex flex-wrap gap-2">
                        <button className="cursor-pointer flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                          <Eye className="w-4 h-4" /> View Profile
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Condition Notes */}
                  {appt.Condition && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-2">Condition / Notes</h4>
                      <p className="text-sm text-gray-600">{appt.Condition}</p>
                    </div>
                  )}

                  {/* Bottom Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex gap-3">
                      
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Empty State ── */}
      {filteredAppointments.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-600">
            {searchQuery
              ? `No appointments match "${searchQuery}". Try adjusting your search.`
              : "No appointments scheduled."}
          </p>
        </div>
      )}
    </div>
  );
};

export default PatientTab;