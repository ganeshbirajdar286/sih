import React from "react";
import { FaUserMd, FaHospital, FaChartLine, FaStar, FaSearch, FaFilter } from "react-icons/fa";

// Mock data for doctors
const doctors = [
  { id: 1, name: "Dr. Sharma", specialty: "Cardiology", rating: 4.8, experience: "12 years", hospital: "City Hospital", available: true },
  { id: 2, name: "Dr. Mehta", specialty: "Dermatology", rating: 4.5, experience: "8 years", hospital: "Skin Care Center", available: true },
  { id: 3, name: "Dr. Reddy", specialty: "Orthopedic", rating: 4.7, experience: "15 years", hospital: "Bone & Joint Clinic", available: false },
  { id: 4, name: "Dr. Kapoor", specialty: "Ayurveda", rating: 4.9, experience: "20 years", hospital: "Ayurvedic Wellness Center", available: true },
  { id: 5, name: "Dr. Patel", specialty: "Pediatrics", rating: 4.6, experience: "10 years", hospital: "Children's Hospital", available: true },
  { id: 6, name: "Dr. Singh", specialty: "Neurology", rating: 4.8, experience: "14 years", hospital: "Neuro Care Institute", available: true },
];

export default function DoctorsTab({ searchQuery }) {
  const filteredDoctors = searchQuery
    ? doctors.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()))
    : doctors;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Doctors Directory</h2>
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-64">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search doctors..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={searchQuery}
            readOnly
          />
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">
          <FaFilter className="mr-2" /> Filter
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map(doc => (
          <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <FaUserMd className="text-green-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{doc.name}</h3>
                  <p className="text-green-600">{doc.specialty}</p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < Math.floor(doc.rating) ? "text-yellow-400" : "text-gray-300"} />
                    ))}
                    <span className="ml-2 text-gray-500">{doc.rating}</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <p className="flex items-center"><FaHospital className="mr-2" /> {doc.hospital}</p>
                <p className="flex items-center mt-2"><FaChartLine className="mr-2" /> {doc.experience} experience</p>
              </div>
              <div className={`mt-4 text-sm font-medium ${doc.available ? 'text-green-600' : 'text-red-600'}`}>
                {doc.available ? 'Available Today' : 'Not Available'}
              </div>
              <button className={`mt-4 w-full py-2 rounded-lg ${doc.available ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`} disabled={!doc.available}>
                {doc.available ? 'Book Appointment' : 'Not Available'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
