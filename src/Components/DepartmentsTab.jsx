import React from "react";
import { FaStethoscope } from "react-icons/fa";

// Mock data for departments
const departments = [
  { id: 1, name: "Cardiology", description: "Heart and cardiovascular health", doctors: 12 },
  { id: 2, name: "Dermatology", description: "Skin, hair, and nail conditions", doctors: 8 },
  { id: 3, name: "Orthopedics", description: "Bones, joints, and muscles", doctors: 15 },
  { id: 4, name: "Ayurveda", description: "Traditional holistic healing", doctors: 6 },
  { id: 5, name: "Pediatrics", description: "Healthcare for children", doctors: 10 },
  { id: 6, name: "Neurology", description: "Brain and nervous system", doctors: 7 },
];

export default function DepartmentsTab() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Medical Departments</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(dept => (
          <div key={dept.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FaStethoscope className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{dept.name}</h3>
                  <p className="text-gray-500 text-sm">{dept.doctors} doctors</p>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{dept.description}</p>
              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">
                View Department
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
