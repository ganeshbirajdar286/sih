import React from "react";
import { FaMapMarkerAlt, FaPhone } from "react-icons/fa";

// Mock data for hospitals
const hospitals = [
  { id: 1, name: "City Hospital", address: "123 Main Street", distance: "2.5 km", specialties: ["Cardiology", "Neurology", "Emergency"] },
  { id: 2, name: "Medicare Center", address: "456 Oak Avenue", distance: "5.1 km", specialties: ["Dermatology", "Pediatrics", "Dentistry"] },
  { id: 3, name: "Ayurvedic Wellness Center", address: "789 Yoga Road", distance: "3.7 km", specialties: ["Ayurveda", "Yoga Therapy", "Nutrition"] },
  { id: 4, name: "Bone & Joint Clinic", address: "321 Fitness Lane", distance: "4.2 km", specialties: ["Orthopedics", "Physiotherapy", "Sports Medicine"] },
];

export default function HospitalsTab() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Hospital Network</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {hospitals.map(hospital => (
          <div key={hospital.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <h3 className="font-semibold text-lg mb-2">{hospital.name}</h3>
              <div className="flex items-center text-gray-600 mb-3">
                <FaMapMarkerAlt className="mr-2 text-green-600" />
                <span>{hospital.address}</span>
                <span className="ml-4 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{hospital.distance} away</span>
              </div>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Specialties:</h4>
                <div className="flex flex-wrap gap-2">
                  {hospital.specialties.map((spec, idx) => (
                    <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{spec}</span>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <button className="flex items-center text-blue-600 hover:text-blue-800">
                  <FaPhone className="mr-1" /> Call
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
