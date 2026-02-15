import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaTimes, 
  FaCheck,
  FaUserMd,
  FaExclamationTriangle,
  FaArrowLeft,
  FaMapMarkerAlt
} from 'react-icons/fa';

import { RescheduleAppointment as RescheduleThunk, getappointmentschedule, Cancel_appointments } from '../../feature/Patient/patient.thunk';
import toast from 'react-hot-toast';

const RescheduleAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { getappointmentschedules, loading } = useSelector((state) => state.patient);


  console.log("URL Parameter ID:", id);
  console.log("All params:", useParams());

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [appointment, setAppointment] = useState(null);

  useEffect(() => {
    if (!getappointmentschedules || getappointmentschedules.length === 0) {
      dispatch(getappointmentschedule());
    }
  }, [dispatch, getappointmentschedules]);


  useEffect(() => {
    console.log("=== FINDING APPOINTMENT ===");
    console.log("ID to find:", id);
    console.log("All appointments:", getappointmentschedules);
    
    if (getappointmentschedules && id) {
      const foundAppointment = getappointmentschedules.find(
        (appt) => appt._id === id
      );
      
      console.log("Found appointment:", foundAppointment);
      
      if (foundAppointment) {
        setAppointment({
          id: foundAppointment._id,
          image: foundAppointment.Doctor_id?.User_id?.Image_url,
          doctor: foundAppointment.Doctor_id?.User_id?.Name || "Dr. Unknown",
          specialty: foundAppointment.Doctor_id?.Specialization || "General",
          date: foundAppointment.Appointment_Date,
          time: foundAppointment.Time_slot,
          status: foundAppointment.Status?.toLowerCase() || "pending",
          type: "In-person",
          location: "Clinic Visit",
        });
      } else {
        console.error("No appointment found with ID:", id);
      }
    }
  }, [getappointmentschedules, id]);

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      if (date.getDay() !== 0) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
          }),
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          fullDate: date
        });
      }
    }
    return dates;
  };

  const getTimeSlots = () => {
    const predefinedSlots = [
      "09:00-10:00",
      "10:15-11:15",
      "11:30-12:30",
      "14:00-15:00",
      "15:15-16:15",
      "16:30-17:30",
      "17:45-18:45",
      "19:00-20:00",
      "20:15-21:15"
    ];

    return predefinedSlots.map(slot => {
      const [startTime, endTime] = slot.split('-');
      const [startHour, startMinute] = startTime.split(':').map(Number);
      const [endHour, endMinute] = endTime.split(':').map(Number);
      
      const startPeriod = startHour >= 12 ? 'PM' : 'AM';
      const endPeriod = endHour >= 12 ? 'PM' : 'AM';
      
      const displayStartHour = startHour > 12 ? startHour - 12 : startHour === 0 ? 12 : startHour;
      const displayEndHour = endHour > 12 ? endHour - 12 : endHour === 0 ? 12 : endHour;
      
      const displayTime = startPeriod === endPeriod 
        ? `${displayStartHour}:${startMinute.toString().padStart(2, '0')}-${displayEndHour}:${endMinute.toString().padStart(2, '0')} ${endPeriod}`
        : `${displayStartHour}:${startMinute.toString().padStart(2, '0')} ${startPeriod}-${displayEndHour}:${endMinute.toString().padStart(2, '0')} ${endPeriod}`;
      
      return {
        value: slot,
        label: displayTime
      };
    });
  };

  const availableDates = getAvailableDates();
  const timeSlots = getTimeSlots();


  const handleCancelAppointment = async () => {
    if (!id) {
      toast.error('Appointment ID is missing');
      return;
    }
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await dispatch(Cancel_appointments(id)).unwrap();
        toast.success('Appointment cancelled successfully!');
        navigate('/appointments');
      } catch (error) {
        toast.error(error || 'Failed to cancel appointment');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("=== RESCHEDULE SUBMIT DEBUG ===");
    console.log("ID from useParams:", id);
    console.log("Selected Date:", selectedDate);
    console.log("Selected Time:", selectedTime);
    console.log("Reason:", reason);
    console.log("Appointment object:", appointment);

    if (!selectedDate) {
      toast.error('Please select a date');
      return;
    }

    if (!selectedTime) {
      toast.error('Please select a time');
      return;
    }

    if (!id) {
      toast.error('Appointment ID is missing');
      console.error("ERROR: No appointment ID found!");
      return;
    }

    try {
      console.log("Dispatching RescheduleThunk with:", {
        id: id,  
        Appointment_Date: selectedDate,
        Time_slot: selectedTime,
      });

      await dispatch(
        RescheduleThunk({
          id: id,  
          Appointment_Date: selectedDate,
          Time_slot: selectedTime,
        })
      ).unwrap();

      toast.success('Appointment rescheduled successfully!');
      navigate("/patient-dashboard");
    } catch (error) {
      console.error("Reschedule error:", error);
      toast.error(error?.message || 'Failed to reschedule appointment');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Date TBD';
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };


  if (loading && !appointment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-600 border-t-transparent absolute top-0 left-1/2 -translate-x-1/2"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading appointment...</p>
        </div>
      </div>
    );
  }


  if (!appointment && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white p-8 sm:p-12 rounded-2xl shadow-xl max-w-md w-full">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTimes className="text-4xl text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Appointment Not Found</h3>
          <p className="text-gray-600 mb-6">The appointment you're trying to reschedule doesn't exist.</p>
          <button 
            onClick={() => navigate('/appointments')}
            className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go to Appointments
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-gray-50 p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">

        <button
          onClick={() => navigate('/patient-dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors group  cursor-pointer"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium cursor-pointer">Back to dashboard</span>
        </button>

        
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden">
          
          <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 p-6 sm:p-8 md:p-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FaCalendarAlt className="text-3xl sm:text-4xl text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                  Reschedule Appointment
                </h1>
                <p className="text-green-100 text-sm sm:text-base">
                  Choose a new date and time for your appointment
                </p>
              </div>
            </div>
          </div>

          
          <div className="p-6 sm:p-8 md:p-10">
            
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 sm:p-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <FaExclamationTriangle className="text-amber-700 text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-4 text-base sm:text-lg">
                    Current Appointment Details
                  </h3>
                  
                 
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-amber-200">
                    <img
                      src={appointment.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
                      alt={appointment.doctor}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-white"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm sm:text-base">{appointment.doctor}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{appointment.specialty}</p>
                    </div>
                  </div>

                 
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
                      <FaCalendarAlt className="text-amber-600 text-lg flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Date</p>
                        <p className="text-sm font-semibold text-gray-900">{formatDate(appointment.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3">
                      <FaClock className="text-amber-600 text-lg flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Time</p>
                        <p className="text-sm font-semibold text-gray-900">{appointment.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/50 rounded-lg p-3 sm:col-span-2">
                      <FaMapMarkerAlt className="text-amber-600 text-lg flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Location</p>
                        <p className="text-sm font-semibold text-gray-900">{appointment.type}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

           
            <form onSubmit={handleSubmit} className="space-y-8">
           
              <div>
                <label className="block text-base sm:text-lg font-bold text-gray-900 mb-4">
                  Select New Date
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-3 bg-gray-50 rounded-2xl">
                  {availableDates.map((date) => (
                    <button
                      key={date.value}
                      type="button"
                      onClick={() => setSelectedDate(date.value)}
                      className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                        selectedDate === date.value
                          ? 'border-green-600 bg-green-50 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-green-300 bg-white hover:shadow-md'
                      }`}
                    >
                      <div className={`text-xs font-semibold mb-1 ${
                        selectedDate === date.value ? 'text-green-700' : 'text-gray-500'
                      }`}>
                        {date.dayName}
                      </div>
                      <div className={`text-sm font-bold ${
                        selectedDate === date.value ? 'text-green-900' : 'text-gray-900'
                      }`}>
                        {date.label.split(',')[0]}
                      </div>
                      {selectedDate === date.value && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <FaCheck className="text-white text-xs" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

         
              <div>
                <label className="block text-base sm:text-lg font-bold text-gray-900 mb-4">
                  Select Time Slot
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-64 overflow-y-auto p-3 bg-gray-50 rounded-2xl">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setSelectedTime(slot.value)}
                      className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all font-semibold text-xs sm:text-sm ${
                        selectedTime === slot.value
                          ? 'border-green-600 bg-green-50 text-green-900 shadow-lg scale-105'
                          : 'border-gray-200 hover:border-green-300 bg-white text-gray-700 hover:shadow-md'
                      }`}
                    >
                      {slot.label}
                      {selectedTime === slot.value && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-600 rounded-full flex items-center justify-center">
                          <FaCheck className="text-white text-xs" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            
              <div>
                <label className="block text-base sm:text-lg font-bold text-gray-900 mb-3">
                  Reason for Rescheduling <span className="text-gray-400 font-normal text-sm">(Optional)</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for rescheduling (optional)..."
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none resize-none text-sm sm:text-base transition-all"
                />
              </div>

              
              {(selectedDate || selectedTime) && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-5 sm:p-6">
                  <h4 className="font-bold text-green-900 mb-4 text-base sm:text-lg flex items-center gap-2">
                    <FaCheck className="text-green-600" />
                    New Appointment Summary
                  </h4>
                  <div className="space-y-3">
                    {selectedDate && (
                      <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                        <FaCalendarAlt className="text-green-600 text-lg" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">New Date</p>
                          <p className="font-semibold text-gray-900">{availableDates.find(d => d.value === selectedDate)?.label}</p>
                        </div>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3">
                        <FaClock className="text-green-600 text-lg" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">New Time</p>
                          <p className="font-semibold text-gray-900">{timeSlots.find(t => t.value === selectedTime)?.label}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              
              <div className="flex flex-col sm:flex-row gap-3 pt-6">
                <button
                  type="button"
                  onClick={handleCancelAppointment}
                  className="flex-1 px-6 py-4 border-2 border-red-300 text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FaTimes />
                  Cancel Appointment
                </button>
                <button
                  type="submit"
                  disabled={loading || !selectedDate || !selectedTime}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Rescheduling...
                    </>
                  ) : (
                    <>
                      <FaCheck />
                      Confirm Reschedule
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointment;