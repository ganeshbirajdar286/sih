import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";

export default function PatientsTab() {
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "", age: "", gender: "", bloodGroup: "", diseases: "", allergies: "", medications: "", emergencyContact: ""
  });

  const handleFormChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert("Patient data saved!");
    setFormData({ name: "", age: "", gender: "", bloodGroup: "", diseases: "", allergies: "", medications: "", emergencyContact: "" });
    setShowPatientForm(false);
  };

  const recentPatients = ["Rahul Kumar", "Priya Singh", "Amit Patel"];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Patient Management</h2>
        <button
          onClick={() => setShowPatientForm(!showPatientForm)}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition duration-200 flex items-center space-x-2"
        >
          <FaPlus />
          <span>New Patient</span>
        </button>
      </div>

      {showPatientForm && (
        <form
          onSubmit={handleFormSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
        >
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Patient Details</h3>
          </div>
          {["name", "age", "gender", "bloodGroup", "diseases", "allergies", "medications", "emergencyContact"].map(field => (
            <div key={field} className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">{field === "diseases" ? "Medical History / Issues" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {field === "gender" ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <input
                  type={field === "age" ? "number" : "text"}
                  name={field}
                  value={formData[field]}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
              )}
            </div>
          ))}
          <div className="md:col-span-2 flex justify-end space-x-4 mt-4">
            <button
              type="button"
              onClick={() => setShowPatientForm(false)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition"
            >
              Save Patient
            </button>
          </div>
        </form>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
        <h3 className="text-xl font-semibold mb-6 text-gray-700">Recent Patients</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Age", "Gender", "Blood Group", "Last Visit", "Actions"].map(head => (
                  <th key={head} className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentPatients.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{[42, 35, 28][i]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{["Male", "Female", "Male"][i]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{["B+", "O+", "A+"][i]}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{["12 Oct 2023", "10 Oct 2023", "9 Oct 2023"][i]}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium transition duration-150">View Details</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}