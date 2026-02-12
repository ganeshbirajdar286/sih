import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaVideo,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEllipsisV,
  FaPlus,
  FaChevronDown,
  FaSearch,
  FaFilter,
  FaTimes,
  FaCheckCircle,
  FaHourglassHalf,
} from "react-icons/fa";
// Import added below
import { getappointmentschedule, Cancel_appointments } from "../../feature/Patient/patient.thunk";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Appointments = () => {
  const dispatch = useDispatch();
  const  navigate=useNavigate();
  const { getappointmentschedules, loading, error } = useSelector(
    (state) => state.patient,
  );

  const [activeTab, setActiveTab] = useState("upcoming");
  const [sortBy, setSortBy] = useState("date");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  // State to trigger re-render for time checks every minute
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    dispatch(getappointmentschedule());
    
    // Timer to update status every minute without refresh
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [dispatch]);

  // Helper to parse "09:00-10:00" and compare with current time
  const getTimingStatus = (dateStr, slotStr) => {
    if (!dateStr || !slotStr) return "UPCOMING";
    
    const now = new Date();
    const [startTime, endTime] = slotStr.split("-");
    
    const start = new Date(dateStr);
    const [sH, sM] = startTime.split(":").map(Number);
    start.setHours(sH, sM, 0);

    const end = new Date(dateStr);
    const [eH, eM] = endTime.split(":").map(Number);
    end.setHours(eH, eM, 0);

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "LIVE";
    return "EXPIRED";
  };

  const appointments = (getappointmentschedules || []).map((appointment) => {
    return {
      id: appointment._id,
      image: appointment.Doctor_id?.User_id?.Image_url,
      doctor: appointment.Doctor_id?.User_id?.Name || "Dr. Unknown",
      specialty: appointment.Doctor_id?.Specialization || "General",
      date: appointment.Appointment_Date,
      time: appointment.Time_slot,
      status: appointment.Status?.toLowerCase() || "pending",
      type: "In-person",
      location: "Clinic Visit",
      // Map phone number from your user data structure
      phone: appointment.Doctor_id?.User_id?.Phone_number || "",
    };
  });


  const filteredAppointments = appointments
    ?.filter((app) => {
      const timing = getTimingStatus(app.date, app.time);
      
      if (activeTab === "upcoming") {
        const isStillUpcoming = ["confirmed", "pending", "accepted", "active"].includes(app.status);
        return isStillUpcoming && timing !== "EXPIRED";
      }
      
      if (activeTab === "past") {
        return app.status === "completed" || app.status === "rejected" || timing === "EXPIRED";
      }
      return true;
    })
    ?.filter(
      (app) =>
        app.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.specialty.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    ?.sort((a, b) => {
      if (sortBy === "date") return new Date(a.date) - new Date(b.date);
      if (sortBy === "doctor") return a.doctor.localeCompare(b.doctor);
      return 0;
    });

  const getStatusBadge = (status) => {
    const badges = {
      confirmed: {
        bg: "bg-gradient-to-r from-green-50 to-emerald-50",
        text: "text-green-700",
        icon: <FaCheckCircle className="w-3 h-3" />,
        border: "border-green-200",
      },
      accepted: {
        bg: "bg-gradient-to-r from-blue-50 to-indigo-50",
        text: "text-blue-700",
        icon: <FaCheckCircle className="w-3 h-3" />,
        border: "border-blue-200",
      },
      pending: {
        bg: "bg-gradient-to-r from-yellow-50 to-amber-50",
        text: "text-yellow-700",
        icon: <FaHourglassHalf className="w-3 h-3" />,
        border: "border-yellow-200",
      },
      completed: {
        bg: "bg-gradient-to-r from-blue-50 to-cyan-50",
        text: "text-blue-700",
        icon: <FaCheckCircle className="w-3 h-3" />,
        border: "border-blue-200",
      },
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD";
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const handleCancel = async (id) => {
    if (!id) {
      toast.error("Invalid Appointment ID");
      return;
    }
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await dispatch(Cancel_appointments(id)).unwrap();
        toast.success("Appointment cancelled successfully");
      } catch (err) {
        toast.error(err || "Failed to cancel appointment");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-600 border-t-transparent absolute top-0 left-1/2 -translate-x-1/2"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">
            Loading your appointments...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 sm:p-12 rounded-2xl shadow-xl max-w-md w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-4xl text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
          <button
            onClick={() => dispatch(getappointmentschedule())}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              My Appointments
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage and schedule your medical appointments
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Total
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {appointments.length}
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="text-blue-600 text-xl sm:text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Upcoming
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                  {
                    appointments.filter((app) => {
                      const timing = getTimingStatus(app.date, app.time);
                      const isUpcomingStatus = ["confirmed", "pending", "accepted", "active"].includes(app.status);
                      return isUpcomingStatus && timing !== "EXPIRED";
                    }).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                <FaClock className="text-green-600 text-xl sm:text-2xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">
                  Completed
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                  {
                    appointments.filter((app) => {
                      const timing = getTimingStatus(app.date, app.time);
                      return app.status === "completed" || app.status === "rejected" || timing === "EXPIRED";
                    }).length
                  }
                </p>
              </div>
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-purple-600 text-xl sm:text-2xl" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-5 lg:p-6 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
              {["upcoming", "past"].map((tab) => (
                <button
                  key={tab}
                  className={`flex-1 sm:flex-none px-4 sm:px-6 py-2.5 font-medium transition-all duration-200 rounded-md cursor-pointer ${
                    activeTab === tab
                      ? "bg-white text-green-700 shadow-sm"
                      : "text-gray-600 hover:text-green-600"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "upcoming" ? "Upcoming" : "Past"}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Search doctors or specialties..."
                  className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-gray-50 focus:bg-white transition-all text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <button
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-all text-sm font-medium"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter className="text-gray-400" />
                  <span>Sort by {sortBy === "date" ? "Date" : "Doctor"}</span>
                  <FaChevronDown
                    className={`text-gray-400 transition-transform ${showFilters ? "rotate-180" : ""}`}
                  />
                </button>

                {showFilters && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowFilters(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-20 border border-gray-100">
                      <button
                        className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors ${
                          sortBy === "date"
                            ? "bg-green-50 text-green-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSortBy("date");
                          setShowFilters(false);
                        }}
                      >
                        <FaCalendarAlt className="mr-3" />
                        By Date
                      </button>
                      <button
                        className={`flex items-center w-full px-4 py-2.5 text-sm transition-colors ${
                          sortBy === "doctor"
                            ? "bg-green-50 text-green-700 font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                        onClick={() => {
                          setSortBy("doctor");
                          setShowFilters(false);
                        }}
                      >
                        <FaUserMd className="mr-3" />
                        By Doctor
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {filteredAppointments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filteredAppointments.map((appointment) => {
              const statusBadge = getStatusBadge(appointment.status);
              const timing = getTimingStatus(appointment.date, appointment.time);
              const isLive = timing === "LIVE";

              return (
                <div
                  key={appointment.id}
                  className="bg-white rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-green-200 transform hover:-translate-y-1"
                >
                  <div className="p-5 sm:p-6 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-5">
                      <div className="relative flex-shrink-0">
                        <img
                          src={
                            appointment.image ||
                            "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                          }
                          alt={appointment.doctor}
                          className="w-14 h-14 sm:w-16 sm:h-16 rounded-full sm:rounded-2xl object-cover object-center ring-4 ring-gray-100"
                        />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate mb-1">
                          {appointment.doctor}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-2 truncate">
                          {appointment.specialty}
                        </p>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusBadge.bg} ${statusBadge.text} ${statusBadge.border}`}
                        >
                          {statusBadge.icon}
                          <span className="capitalize">
                            {appointment.status}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3 mb-5 flex-1">
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 px-3 py-2.5 rounded-lg">
                        <FaCalendarAlt className="text-green-600 flex-shrink-0" />
                        <span className="font-medium">
                          {formatDate(appointment.date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 px-3 py-2.5 rounded-lg">
                        <FaClock className="text-green-600 flex-shrink-0" />
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 px-3 py-2.5 rounded-lg">
                        {appointment.type === "In-person" ? (
                          <FaMapMarkerAlt className="text-green-600 flex-shrink-0" />
                        ) : (
                          <FaVideo className="text-green-600 flex-shrink-0" />
                        )}
                        <span className="font-medium">{appointment.type}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t border-gray-100">
                      {/* --- Added Call Doctor Button --- */}
                      {isLive && (
                        <button 
                          className="w-full mb-2 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2.5 rounded-lg hover:bg-blue-700 transition-all text-sm font-bold shadow-md cursor-pointer"
                          onClick={() => window.location.href = `tel:${appointment.phone || '0000000000'}`}
                        >
                          <FaPhoneAlt className="text-xs" />
                          Call Doctor
                        </button>
                      )}

                      {appointment.status !== "completed" && timing !== "EXPIRED" && (
                        <div className="grid grid-cols-2 gap-2">
                          {/* Reschedule logic: Hidden if appointment is 'accepted' */}
                          {appointment.status !== "accepted" && (
                            <button 
                              className="flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 px-3 py-2.5 rounded-lg hover:bg-green-50 transition-all text-xs sm:text-sm font-semibold cursor-pointer" 
                              onClick={() => {
                                if (!appointment.id) {
                                  console.error("WARNING: Appointment ID is undefined!");
                                }
                                navigate(`/RescheduleAppointment/${appointment.id}`);
                              }}
                            >
                              <FaClock className="text-xs" />
                              Reschedule
                            </button>
                          )}
                          <button 
                            className={`flex items-center justify-center gap-2 border-2 border-red-300 text-red-500 px-3 py-2.5 rounded-lg hover:bg-red-50 transition-all text-xs sm:text-sm font-semibold cursor-pointer ${appointment.status === "accepted" ? "col-span-2" : ""}`}
                            onClick={() => handleCancel(appointment.id)}
                          >
                            <FaTimes className="text-xs" />
                            Cancel
                          </button>
                        </div>
                      )}
                      
                      <button 
                        disabled={!isLive}
                        className={`w-full px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 shadow-md flex items-center justify-center gap-2 transform cursor-pointer ${
                          isLive 
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:scale-105" 
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isLive ? <FaCheckCircle /> : <FaPhoneAlt />}
                        <span>
                          {isLive ? "Accept & Join Call" : "View Details"}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 sm:py-16 lg:py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full mb-6">
              <FaCalendarAlt className="text-3xl sm:text-4xl text-green-600" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              No {activeTab} appointments found
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-8 max-w-md mx-auto px-4">
              You don't have any {activeTab} appointments scheduled at the
              moment.
            </p>
            {activeTab==="upcoming"? <button className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5" onClick={()=>navigate("/doctor")}>
              Schedule New Appointment
            </button>:""}
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;