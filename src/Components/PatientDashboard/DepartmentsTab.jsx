import React, { useState } from "react";
import {
  FaStethoscope,
  FaUserMd,
  FaSearch,
  FaFilter,
  FaArrowRight,
  FaClock,
  FaStar,
  FaPhone,
  FaCalendarAlt
} from "react-icons/fa";

// Department icons mapping
const departmentIcons = {
  Cardiology: "❤️",
  Dermatology: "🔬",
  Orthopedics: "🦴",
  Ayurveda: "🌿",
  Pediatrics: "🧸",
  Neurology: "🧠",
  Dentistry: "🦷",
  Ophthalmology: "👁️",
  Psychiatry: "🧠",
  Emergency: "🚑",
};


// Department colors mapping
const departmentColors = {
  Cardiology: {
    bg: "bg-red-600",
    text: "text-white",
  },
  Dermatology: {
    bg: "bg-purple-600",
    text: "text-white",
  },
  Orthopedics: {
    bg: "bg-blue-600",
    text: "text-white",
  },
  Ayurveda: {
    bg: "bg-green-600",
    text: "text-white",
  },
  Pediatrics: {
    bg: "bg-pink-600",
    text: "text-white",
  },
  Neurology: {
    bg: "bg-indigo-600",
    text: "text-white",
  },
  Dentistry: {
    bg: "bg-teal-600",
    text: "text-white",
  },
  Ophthalmology: {
    bg: "bg-cyan-600",
    text: "text-white",
  },
  Psychiatry: {
    bg: "bg-gray-600",
    text: "text-white",
  },
  Emergency: {
    bg: "bg-orange-600",
    text: "text-white",
  },
};


// Mock data
const departments = [
  {
    id: 1,
    name: "Cardiology",
    description:
      "Specializing in heart and cardiovascular health, our cardiology department offers comprehensive care for all cardiac conditions.",
    doctors: 12,
    rating: 4.8,
    waitTime: "15 mins",
    services: [
      "Echocardiogram",
      "Angioplasty",
      "Cardiac CT",
      "Stress Test",
      "Pacemaker Implantation",
    ],
  },
  {
    id: 2,
    name: "Dermatology",
    description:
      "Expert care for skin, hair, and nail conditions with advanced treatments and cosmetic procedures.",
    doctors: 8,
    rating: 4.5,
    waitTime: "10 mins",
    services: [
      "Acne Treatment",
      "Skin Cancer Screening",
      "Laser Therapy",
      "Psoriasis Treatment",
      "Cosmetic Dermatology",
    ],
  },
  {
    id: 3,
    name: "Orthopedics",
    description:
      "Comprehensive care for bones, joints, muscles, and sports injuries with surgical and non-surgical treatments.",
    doctors: 15,
    rating: 4.7,
    waitTime: "20 mins",
    services: [
      "Joint Replacement",
      "Arthroscopy",
      "Fracture Care",
      "Sports Medicine",
      "Spinal Surgery",
    ],
  },
  {
    id: 4,
    name: "Ayurveda",
    description:
      "Traditional holistic healing approaches combining ancient wisdom with modern healthcare practices.",
    doctors: 6,
    rating: 4.9,
    waitTime: "5 mins",
    services: [
      "Panchakarma",
      "Herbal Medicine",
      "Yoga Therapy",
      "Diet Consultation",
      "Detoxification",
    ],
  },
  {
    id: 5,
    name: "Pediatrics",
    description:
      "Specialized healthcare for children from newborns to adolescents with child-friendly approaches.",
    doctors: 10,
    rating: 4.6,
    waitTime: "25 mins",
    services: [
      "Vaccinations",
      "Growth Monitoring",
      "Child Nutrition",
      "Developmental Assessment",
      "Adolescent Care",
    ],
  },
  {
    id: 6,
    name: "Neurology",
    description:
      "Expert diagnosis and treatment for brain, spinal cord, and nervous system disorders.",
    doctors: 7,
    rating: 4.8,
    waitTime: "30 mins",
    services: [
      "EEG",
      "EMG",
      "Stroke Care",
      "Epilepsy Treatment",
      "Headache Management",
    ],
  },
  {
    id: 7,
    name: "Dentistry",
    description:
      "Complete dental care services from routine checkups to advanced surgical procedures.",
    doctors: 9,
    rating: 4.4,
    waitTime: "15 mins",
    services: [
      "Dental Implants",
      "Teeth Whitening",
      "Root Canal",
      "Orthodontics",
      "Oral Surgery",
    ],
  },
  {
    id: 8,
    name: "Ophthalmology",
    description:
      "Comprehensive eye care services including vision correction and treatment of eye diseases.",
    doctors: 5,
    rating: 4.7,
    waitTime: "10 mins",
    services: [
      "Cataract Surgery",
      "LASIK",
      "Glaucoma Treatment",
      "Retina Care",
      "Pediatric Ophthalmology",
    ],
  },
  {
    id: 9,
    name: "Emergency",
    description:
      "24/7 emergency care for urgent medical conditions with state-of-the-art trauma center.",
    doctors: 18,
    rating: 4.9,
    waitTime: "Immediate",
    services: [
      "Trauma Care",
      "Critical Care",
      "Emergency Surgery",
      "Toxicology",
      "Disaster Management",
    ],
  },
];

const allDepartments = departments.map((dept) => dept.name);

export default function DepartmentsTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [showFilters, setShowFilters] = useState(false);

  const filteredDepartments = departments.filter((dept) => {
    const matchesSearch =
      searchQuery === "" ||
      dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dept.services.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesDepartment =
      selectedDepartment === "All Departments" ||
      dept.name === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Medical Departments
      </h2>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search departments by name or services..."
            className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="grid">
          <button
            className="flex cursor-pointer items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="mr-2 " />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
            <button
              onClick={() => setSelectedDepartment("All Departments")}
              className={`px-3 cursor-pointer py-1 rounded-full text-sm ${selectedDepartment === "All Departments"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              All Departments
            </button>
            {allDepartments.map((dept) => (
              <button
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className={`px-3 py-1 cursor-pointer rounded-full text-sm transition ${selectedDepartment === dept
                    ? `${departmentColors[dept]?.bg || "bg-gray-600"} ${departmentColors[dept]?.text || "text-white"}`
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {dept}
              </button>
            ))}

          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 grid">
        <p className="text-gray-600">
          {filteredDepartments.length} department
          {filteredDepartments.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Departments Grid */}
      {filteredDepartments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDepartments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-6 grid gap-4">
                {/* Header */}
                <div className="grid grid-cols-[auto,1fr] gap-4 items-center">
                  <div
                    className={`w-12 h-12 bg-${departmentColors[dept.name]}-100 rounded-lg flex items-center justify-center`}
                  >
                    <span className="text-xl">
                      {departmentIcons[dept.name]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {dept.name}
                    </h3>
                    <div className="grid grid-cols-[auto,1fr] gap-1 items-center">
                      <FaUserMd className="text-gray-500" size={12} />
                      <span className="text-gray-500 text-sm">
                        {dept.doctors} doctors
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm">{dept.description}</p>

                {/* Rating & Wait Time */}
                <div className="grid grid-cols-2 items-center text-sm">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={
                          i < Math.floor(dept.rating)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }
                        size={12}
                      />
                    ))}
                    <span className="ml-2 text-gray-500">{dept.rating}</span>
                  </div>
                  <div className="flex items-center justify-end text-gray-500">
                    <FaClock className="mr-1" size={12} />
                    <span>~{dept.waitTime}</span>
                  </div>
                </div>

                {/* Services */}
                <div className="grid gap-2">
                  <h4 className="text-sm font-medium text-gray-700">Key Services:</h4>
                  <div className="flex flex-wrap gap-2">
                    {dept.services.slice(0, 3).map((service, idx) => (
                      <span
                        key={idx}
                        className={`inline-flex items-center whitespace-nowrap bg-${departmentColors[dept.name]}-100 text-${departmentColors[dept.name]}-800 text-xs px-3 py-1 rounded-full`}
                      >
                        {service}
                      </span>
                    ))}
                    {dept.services.length > 3 && (
                      <span className="inline-flex items-center whitespace-nowrap bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                        +{dept.services.length - 3} more
                      </span>
                    )}
                  </div>
                </div>


                {/* Buttons */}
                {/* Buttons */}
                <div className="flex items-center gap-2">
                  {/* Main button takes remaining space */}
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                    View Department <FaArrowRight className="ml-2" size={12} />
                  </button>

                  {/* Icon buttons - fixed width */}
                  <button className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                    <FaPhone size={14} />
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
                    <FaCalendarAlt size={14} />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
          <FaStethoscope className="mx-auto text-gray-400 text-4xl mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No departments found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filters to find what you're looking
            for.
          </p>
        </div>
      )}
    </div>
  );
}
