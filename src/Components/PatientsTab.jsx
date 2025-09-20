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

  const recentPatients = ["Rahul Kumar","Priya Singh","Amit Patel"];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Patient Management</h2>
        <button onClick={() => setShowPatientForm(!showPatientForm)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center">
          <FaPlus className="mr-2" /> New Patient
        </button>
      </div>
      {showPatientForm && (
        <form onSubmit={handleFormSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {["name","age","gender","bloodGroup","diseases","allergies","medications","emergencyContact"].map(field => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{field === "diseases" ? "Medical History / Issues" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
              {field === "gender" ? (
                <select name="gender" value={formData.gender} onChange={handleFormChange} className="w-full border p-2 rounded-lg" required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              ) : (
                <input type={field === "age" ? "number" : "text"} name={field} value={formData[field]} onChange={handleFormChange} className="w-full border p-2 rounded-lg" />
              )}
            </div>
          ))}
          <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
            <button type="button" onClick={() => setShowPatientForm(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">Save Patient</button>
          </div>
        </form>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-medium mb-4 text-gray-700">Recent Patients</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>{["Name","Age","Gender","Blood Group","Last Visit","Actions"].map(head => <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{head}</th>)}</tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recentPatients.map((p,i) => (
              <tr key={i}>
                <td className="px-6 py-4 whitespace-nowrap">{p}</td>
                <td className="px-6 py-4 whitespace-nowrap">{[42,35,28][i]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{["Male","Female","Male"][i]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{["B+","O+","A+"][i]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{["12 Oct 2023","10 Oct 2023","9 Oct 2023"][i]}</td>
                <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">View</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
