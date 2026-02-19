import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCalendarAlt,
  FaClock,
  FaNotesMedical,
  FaUserMd,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaUser,
} from "react-icons/fa";
import { 
  BookingAppointments, 
  getDoctorBookedSlots 
} from "../../feature/Patient/patient.thunk";

export default function BookAppointment() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, bookedSlot } = useSelector((state) => state.patient);

  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const [formData, setFormData] = useState({
    Appointment_Date: "",
    Time_slot: "",
    Condition: "",
  });

  // All possible time slots
  const allTimeSlots = [
    "09:00-10:00",
    "10:15-11:15",
    "11:30-12:30",
    "14:00-15:00",
    "15:15-16:15",
    "16:30-17:30",
    "17:45-18:45",
    "19:00-20:00",
    "20:15-21:15",
  ];

 
  useEffect(() => {
    if (id) {
      dispatch(getDoctorBookedSlots(id));
    }
  }, [id, dispatch]);


  const transformedAppointments = bookedSlot.map((apt) => ({
    date: new Date(apt.Appointment_Date).toISOString().split('T')[0],
    timeSlot: apt.Time_slot,
    patientName: apt.Patient_id?.Name || "Patient",
    status: apt.Status,
  }));

  const getBookedSlotsForDate = (date) => {
    return transformedAppointments
      .filter((apt) => apt.date === date)
      .map((apt) => apt.timeSlot);
  };

 
  const getAvailableSlots = (date) => {
    const bookedSlots = getBookedSlotsForDate(date);
    return allTimeSlots.filter((slot) => !bookedSlots.includes(slot));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

  
    if (name === "Appointment_Date") {
      setSelectedDate(value);
      setFormData(prev => ({ ...prev, Time_slot: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      BookingAppointments({
        id,
        data: formData,
      })
    ).then((result) => {
      if (result.meta.requestStatus === 'fulfilled') {
        dispatch(getDoctorBookedSlots(id));
        setShowBookingForm(false);
        setFormData({
          Appointment_Date: "",
          Time_slot: "",
          Condition: "",
        });
        setSelectedDate("");
      }
    });
  };


  const groupedAppointments = transformedAppointments.reduce((acc, apt) => {
    if (!acc[apt.date]) {
      acc[apt.date] = [];
    }
    acc[apt.date].push(apt);
    return acc;
  }, {});

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-4 px-2 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
    
        <button
          onClick={() => navigate("/patient-dashboard")}
          className="mb-4 flex items-center text-green-700 hover:text-green-900 transition-colors cursor-pointer"
        >
          <FaArrowLeft className="mr-2" />
          <span className="text-sm sm:text-base">Back to Dashboard</span>
        </button>

        {!showBookingForm ? (
      
          <div className="space-y-4 sm:space-y-6">
        
            <div className="bg-white/90 backdrop-blur-lg shadow-xl rounded-xl sm:rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4 sm:p-6 text-white text-center">
                <FaUserMd className="text-3xl sm:text-4xl mx-auto mb-2" />
                <h2 className="text-xl sm:text-2xl font-bold">
                  Doctor's Appointment Schedule
                </h2>
                <p className="text-xs sm:text-sm opacity-90 mt-1">
                  View availability and book your appointment
                </p>
              </div>

  
              <div className="p-4 sm:p-6">
                {loading ? (
                  <div className="text-center py-8 sm:py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="text-gray-500 mt-4 text-sm sm:text-base">Loading appointments...</p>
                  </div>
                ) : Object.keys(groupedAppointments).length > 0 ? (
                  <div className="space-y-4">
                    {Object.entries(groupedAppointments)
                      .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
                      .map(([date, appointments]) => (
                        <div
                          key={date}
                          className="border border-gray-200 rounded-lg overflow-hidden"
                        >
                        
                          <div className="bg-green-50 px-3 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
                            <div className="flex items-center">
                              <FaCalendarAlt className="text-green-600 mr-2 text-sm sm:text-base " />
                              <span className="font-semibold text-gray-800 text-sm sm:text-base">
                                {new Date(date + 'T00:00:00').toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </span>
                            </div>
                            <span className="text-xs sm:text-sm text-green-700 font-medium">
                              {appointments.length} booked
                            </span>
                          </div>

                      
                          <div className="divide-y divide-gray-100">
                            {appointments.map((apt, idx) => (
                              <div
                                key={idx}
                                className="px-3 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between hover:bg-gray-50 transition-colors gap-2"
                              >
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  <FaClock className="text-green-600 text-sm sm:text-base flex-shrink-0" />
                                  <span className="font-medium text-gray-700 text-sm sm:text-base">
                                    {apt.timeSlot}
                                  </span>
                                  <span className="text-xs text-gray-400 hidden sm:inline">•</span>
                                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                    <FaUser className="mr-1 text-xs" />
                                    {apt.patientName}
                                  </div>
                                </div>
                                <div className="flex items-center ml-6 sm:ml-0">
                                  <span className={`text-xs px-2 py-1 rounded-full ${
                                    apt.status === 'Pending' 
                                      ? 'bg-yellow-100 text-yellow-700' 
                                      : apt.status === 'Confirmed'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {apt.status}
                                  </span>
                                  <FaTimesCircle className="text-red-500 text-sm sm:text-base flex-shrink-0 ml-2" />
                                </div>
                              </div>
                            ))}
                          </div>

                          
                          {getAvailableSlots(date).length > 0 && (
                            <div className="bg-emerald-50 px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-200">
                              <p className="text-xs sm:text-sm text-emerald-700 font-medium mb-2">
                                Available Slots ({getAvailableSlots(date).length}):
                              </p>
                              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                                {getAvailableSlots(date).map((slot) => (
                                  <span
                                    key={slot}
                                    className="inline-flex items-center bg-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-emerald-700 border border-emerald-200"
                                  >
                                    <FaCheckCircle className="mr-1 text-xs" />
                                    {slot}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 sm:py-12">
                    <FaCalendarAlt className="text-4xl sm:text-5xl text-gray-300 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-500 text-sm sm:text-base">
                      No appointments scheduled yet
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">
                      All time slots are available
                    </p>
                  </div>
                )}

                
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full mt-4 sm:mt-6 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-3 sm:py-4 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-sm sm:text-base cursor-pointer"
                >
                  Book New Appointment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-lg shadow-2xl rounded-xl sm:rounded-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-4 sm:p-6 text-white text-center">
              <FaUserMd className="text-3xl sm:text-4xl mx-auto mb-2" />
              <h2 className="text-xl sm:text-2xl font-bold">Book Appointment</h2>
              <p className="text-xs sm:text-sm opacity-90 mt-1">
                Schedule your visit with the doctor
              </p>
            </div>

          
            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
              <div>
                <label className="font-medium text-gray-700 flex items-center mb-2 text-sm sm:text-base">
                  <FaCalendarAlt className="mr-2 text-green-600 text-sm sm:text-base " />
                  Appointment Date
                </label>

                <input
                  type="date"
                  name="Appointment_Date"
                  value={formData.Appointment_Date}
                  onChange={handleChange}
                  min={today}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 focus:ring-2 focus:ring-green-500 outline-none text-sm sm:text-base cursor-pointer"
                  required
                />
              </div>

              {/* Time Slot */}
              <div>
                <label className="font-medium text-gray-700 flex items-center mb-2 text-sm sm:text-base">
                  <FaClock className="mr-2 text-green-600 text-sm sm:text-base" />
                  Time Slot
                </label>

                <select
                  name="Time_slot"
                  value={formData.Time_slot}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 focus:ring-2 focus:ring-green-500 outline-none text-sm sm:text-base cursor-pointer"
                  required
                  disabled={!selectedDate}
                >
                  <option value="">
                    {selectedDate
                      ? "Select Available Time Slot"
                      : "Please select a date first"}
                  </option>
                  {selectedDate &&
                    getAvailableSlots(selectedDate).map((slot) => (
                      <option key={slot} value={slot}>
                        {slot} ✓ Available
                      </option>
                    ))}
                  {selectedDate &&
                    getBookedSlotsForDate(selectedDate).map((slot) => (
                      <option key={slot} value={slot} disabled>
                        {slot} ✗ Booked
                      </option>
                    ))}
                </select>

                {selectedDate && getAvailableSlots(selectedDate).length === 0 && (
                  <p className="text-xs sm:text-sm text-red-600 mt-2 flex items-center">
                    <FaTimesCircle className="mr-1" />
                    No available slots for this date. Please choose another date.
                  </p>
                )}
                
                {selectedDate && getAvailableSlots(selectedDate).length > 0 && (
                  <p className="text-xs sm:text-sm text-emerald-600 mt-2 flex items-center">
                    <FaCheckCircle className="mr-1" />
                    {getAvailableSlots(selectedDate).length} slot(s) available
                  </p>
                )}
              </div>

              {/* Condition */}
              <div>
                <label className="font-medium text-gray-700 flex items-center mb-2 text-sm sm:text-base">
                  <FaNotesMedical className="mr-2 text-green-600 text-sm sm:text-base" />
                  Medical Condition
                </label>

                <textarea
                  name="Condition"
                  value={formData.Condition}
                  onChange={handleChange}
                  placeholder="Describe your symptoms or reason for visit..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg p-2 sm:p-2.5 focus:ring-2 focus:ring-green-500 outline-none resize-none text-sm sm:text-base"
                  required
                />
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingForm(false);
                    setFormData({
                      Appointment_Date: "",
                      Time_slot: "",
                      Condition: "",
                    });
                    setSelectedDate("");
                  }}
                  className="w-full sm:w-1/3 border-2 border-gray-300 text-gray-700 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || (selectedDate && getAvailableSlots(selectedDate).length === 0)}
                  className="w-full sm:w-2/3 bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 text-sm sm:text-base cursor-pointer"
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}