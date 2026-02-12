// src/components/Appointments.jsx
import React from 'react';
import Card from './Card';
import { FaCalendarAlt, FaClock, FaUserMd, FaVideo, FaMapMarkerAlt } from 'react-icons/fa';

const Appointments = ({ list }) => {
    const getStatusStyle = (status) => {
        const styles = {
            upcoming: 'bg-green-100 text-green-700 border-green-200',
            completed: 'bg-gray-100 text-gray-700 border-gray-200',
            cancelled: 'bg-red-100 text-red-700 border-red-200'
        };
        return styles[status] || styles.upcoming;
    };

    const getTypeIcon = (type) => {
        return type === 'video' ? <FaVideo className="text-purple-600" /> : <FaMapMarkerAlt className="text-blue-600" />;
    };

    return (
        <Card title="Appointments" icon={FaCalendarAlt}>
            <div className="space-y-3 sm:space-y-4">
                {list.length === 0 ? (
                    <div className="text-center py-8">
                        <FaCalendarAlt className="mx-auto text-gray-300 w-12 h-12 mb-3" />
                        <p className="text-gray-500 text-sm mb-4">No appointments scheduled</p>
                        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                            Schedule Appointment
                        </button>
                    </div>
                ) : (
                    list.map((appointment, index) => (
                        <div 
                            key={index}
                            className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md hover:border-green-300 transition-all duration-300 group"
                        >
                            {/* Header */}
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-start flex-1 min-w-0 mr-3">
                                    <div className="bg-green-100 p-2 rounded-lg mr-3 flex-shrink-0 group-hover:bg-green-200 transition-colors duration-300">
                                        <FaUserMd className="text-green-600 w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                                            {appointment.doctor}
                                        </p>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                                            {appointment.specialty}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-xs font-semibold px-2 sm:px-3 py-1 rounded-full border whitespace-nowrap ${getStatusStyle(appointment.status)}`}>
                                    {appointment.status}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-2 pl-0 sm:pl-11">
                                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                    <FaCalendarAlt className="mr-2 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="truncate">{appointment.date}</span>
                                </div>
                                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                    <FaClock className="mr-2 flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="truncate">{appointment.time}</span>
                                </div>
                                {appointment.type && (
                                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                                        <span className="mr-2 flex-shrink-0">{getTypeIcon(appointment.type)}</span>
                                        <span className="truncate capitalize">{appointment.type} Consultation</span>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            {appointment.status === 'upcoming' && (
                                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
                                    <button className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-xs sm:text-sm">
                                        Join Now
                                    </button>
                                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-lg transition-colors duration-200 text-xs sm:text-sm">
                                        Reschedule
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {list.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center text-sm sm:text-base">
                        <FaCalendarAlt className="mr-2" />
                        Schedule New Appointment
                    </button>
                </div>
            )}
        </Card>
    );
};

export default Appointments;