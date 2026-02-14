import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaUserMd,
  FaHospital,
  FaChartLine,
  FaStar,
  FaSearch,
  FaFilter,
  FaCertificate,
  FaCalendarAlt,
  FaClock,
  FaSpinner,
  FaTimes,
} from "react-icons/fa";
import { doctor } from "../../feature/Patient/patient.thunk";
import { useNavigate } from "react-router-dom";

const specialties = [
  "All Specialties",
  "Oncologist",
  "Cardiologist",
  "Endocrinologist",
  "Gastroenterologist",
  "Neurologist",
  "Obstetrics and Gynaecology",
  "Ophthalmologist",
  "Family doctor",
  "Psychiatrist",
  "Pediatrician",
  "Allergist",
  "Geriatrician",
  "Internal medicine",
  "Nephrologist",
  "Orthopedics",
  "Anesthesiologist",
  "Dermatologist",
];

export default function DoctorsTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    doctor: doctors,
    loading,
    error,
  } = useSelector((state) => state.patient);

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");
  const [sortBy, setSortBy] = useState("experience");

  useEffect(() => {
    dispatch(doctor());
  }, [dispatch]);

  const filteredDoctors = useMemo(() => {
    if (!doctors || doctors.length === 0) return [];

    let result = [...doctors];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (doc) =>
          doc.User_id?.Name?.toLowerCase().includes(query) ||
          doc.Specialization?.toLowerCase().includes(query),
      );
    }

    if (selectedSpecialty !== "All Specialties") {
      result = result.filter((doc) => doc.Specialization === selectedSpecialty);
    }

    if (sortBy === "experience") {
      result.sort((a, b) => b.Experience - a.Experience);
    } else if (sortBy === "name") {
      result.sort(
        (a, b) => a.User_id?.Name?.localeCompare(b.User_id?.Name || "") || 0,
      );
    } else if (sortBy === "specialization") {
      result.sort(
        (a, b) => a.Specialization?.localeCompare(b.Specialization || "") || 0,
      );
    }

    return result;
  }, [doctors, searchQuery, selectedSpecialty, sortBy]);

  const toggleFilters = () => setShowFilters(!showFilters);

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-green-600 text-4xl sm:text-5xl mx-auto mb-4" />
          <p className="text-gray-600 text-base sm:text-lg">
            Loading doctors...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-red-200 mx-4">
          <div className="text-red-500 text-4xl sm:text-5xl mb-4">⚠️</div>
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            Error Loading Doctors
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => dispatch(doctor())}
            className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">
        Find Your Doctor
      </h2>

      <div className="mb-4 sm:mb-6 space-y-3">
        {/* Search Bar */}
        <div className="relative w-full">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search by name or specialty..."
            className="pl-10 pr-4 py-2.5 sm:py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3 w-full">
          <button
            className="flex items-center justify-center cursor-pointer px-3 sm:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors flex-1 sm:flex-none text-sm sm:text-base"
            onClick={toggleFilters}
          >
            <FaFilter className="mr-2 text-sm" />
            <span className="hidden xs:inline">
              {showFilters ? "Hide" : "Filters"}
            </span>
            <span className="xs:hidden">Filter</span>
          </button>

          <select
            className="px-3 sm:px-4 py-2 cursor-pointer rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 flex-1 sm:flex-none text-sm sm:text-base"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="experience">Experience</option>
            <option value="name">Name</option>
            <option value="specialization">Specialty</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="mb-4 sm:mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="font-semibold text-gray-700 text-sm sm:text-base">
              Filters
            </h3>
            <button
              onClick={() => {
                setSelectedSpecialty("All Specialties");
              }}
              className="text-xs sm:text-sm text-green-600 hover:text-green-800 cursor-pointer font-medium"
            >
              Clear All
            </button>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Specialty
            </label>
            <select
              className="w-full px-3 cursor-pointer py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm sm:text-base max-h-48 overflow-y-auto"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              size="1"
            >
              {specialties.map((spec) => (
                <option key={spec} value={spec} className="py-2">
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="mb-3 sm:mb-4 flex items-center justify-between">
        <p className="text-gray-600 text-sm sm:text-base">
          {filteredDoctors.length} doctor
          {filteredDoctors.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {filteredDoctors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-4 sm:p-6">
                <div className="flex items-start">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold mr-3 sm:mr-4 flex-shrink-0">
                    {doc.User_id?.Image_url!==null?(<img src={doc.User_id?.Image_url} alt="profile"
    className="w-full h-full object-cover rounded-2xl"/>):(doc.User_id?.Name?.charAt(0).toUpperCase() || "D")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base sm:text-lg truncate">
                      Dr. {doc.User_id?.Name || "Unknown"}
                    </h3>
                    <p className="text-green-600 font-medium text-xs sm:text-sm truncate">
                      {doc.Specialization}
                    </p>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                  <p className="flex items-center">
                    <FaChartLine className="mr-2 text-green-500 flex-shrink-0 text-sm" />
                    <span>
                      {doc.Experience} year{doc.Experience !== 1 ? "s" : ""}{" "}
                      experience
                    </span>
                  </p>

                  {doc.Certificates && (
                    <p className="flex items-center">
                      <FaCertificate className="mr-2 text-green-500 flex-shrink-0 text-sm" />
                      <a
                        href={doc.Certificates}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:underline truncate"
                      >
                        View Certificate
                      </a>
                    </p>
                  )}

                  <p className="flex items-center text-xs text-gray-400">
                    <FaClock className="mr-2 flex-shrink-0" />
                    <span>
                      Joined: {new Date(doc.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/book-appointment/${doc._id}`)}
                  className="mt-6 w-full py-3 bg-green-600 text-white rounded-lg"
                >
                  Book Appointment
                </button>

                <button
                  onClick={() => navigate(`/doctor/${doc._id}`)}
                  className="mt-2 w-full cursor-pointer py-2 rounded-lg border border-green-600 text-green-600 font-medium hover:bg-green-50 transition-colors text-sm sm:text-base"
                >
                  <FaCalendarAlt className="inline mr-2 text-sm" /> View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 sm:py-12 bg-white rounded-xl shadow-sm border border-gray-100 mx-4">
          <FaUserMd className="mx-auto text-gray-400 text-3xl sm:text-4xl mb-3 sm:mb-4" />
          <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
            No doctors found
          </h3>
          <p className="text-sm sm:text-base text-gray-500 px-4">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      )}
    </div>
  );
}
