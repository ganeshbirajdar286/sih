import React, { useState } from "react";
import {
  FaFilePdf,
  FaFileMedical,
  FaDownload,
  FaEye,
  FaShare,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaChartLine,
  FaPrint,
} from "react-icons/fa";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const medicalReports = [
    {
      id: 1,
      type: "Lab Report",
      title: "Complete Blood Count (CBC)",
      date: "2023-06-15",
      doctor: "Dr. Sarah Johnson",
      status: "completed",
      description: "Complete blood count with differential",
      tags: ["Lab", "Blood Work", "Routine"],
      fileType: "pdf",
      fileSize: "2.4 MB",
      previewAvailable: true,
    },
    {
      id: 2,
      type: "Imaging Report",
      title: "Chest X-Ray Results",
      date: "2023-06-10",
      doctor: "Dr. Michael Chen",
      status: "completed",
      description: "X-ray of chest PA and lateral views",
      tags: ["X-Ray", "Radiology"],
      fileType: "pdf",
      fileSize: "3.1 MB",
      previewAvailable: true,
    },
    {
      id: 3,
      type: "Pathology Report",
      title: "Biopsy Results - Skin Lesion",
      date: "2023-05-28",
      doctor: "Dr. Emily Rodriguez",
      status: "completed",
      description: "Pathology report for skin lesion biopsy",
      tags: ["Biopsy", "Dermatology"],
      fileType: "pdf",
      fileSize: "1.8 MB",
      previewAvailable: true,
    },
    {
      id: 4,
      type: "Diagnostic Report",
      title: "ECG Interpretation",
      date: "2023-05-20",
      doctor: "Dr. James Wilson",
      status: "completed",
      description: "Electrocardiogram report and analysis",
      tags: ["Cardiology", "ECG"],
      fileType: "pdf",
      fileSize: "1.2 MB",
      previewAvailable: false,
    },
    {
      id: 5,
      type: "Annual Physical",
      title: "Annual Health Checkup Summary",
      date: "2023-05-05",
      doctor: "Dr. Robert Brown",
      status: "completed",
      description: "Comprehensive annual physical exam results",
      tags: ["Preventive", "Checkup"],
      fileType: "pdf",
      fileSize: "4.2 MB",
      previewAvailable: true,
    },
    {
      id: 6,
      type: "Specialist Report",
      title: "Orthopedic Consultation",
      date: "2023-04-22",
      doctor: "Dr. Lisa Anderson",
      status: "completed",
      description: "Orthopedic evaluation for knee pain",
      tags: ["Orthopedics", "Consultation"],
      fileType: "pdf",
      fileSize: "2.7 MB",
      previewAvailable: true,
    },
  ];

  const reportTypes = [
    {
      id: "all",
      name: "All Reports",
      icon: <FaFileMedical />,
      count: medicalReports.length,
    },
    {
      id: "lab",
      name: "Lab Reports",
      icon: <FaFileMedical />,
      count: medicalReports.filter((r) => r.type === "Lab Report").length,
    },
    {
      id: "imaging",
      name: "Imaging",
      icon: <FaFileMedical />,
      count: medicalReports.filter((r) => r.type === "Imaging Report").length,
    },
    {
      id: "diagnostic",
      name: "Diagnostic",
      icon: <FaChartLine />,
      count: medicalReports.filter((r) => r.type === "Diagnostic Report")
        .length,
    },
  ];

  const filteredReports = medicalReports
    .filter((report) => {
      if (activeTab === "all") return true;
      if (activeTab === "lab") return report.type === "Lab Report";
      if (activeTab === "imaging") return report.type === "Imaging Report";
      if (activeTab === "diagnostic")
        return report.type === "Diagnostic Report";
      return true;
    })
    .filter(
      (report) =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

  const getTypeIcon = (type) => {
    switch (type) {
      case "Lab Report":
        return <FaFileMedical className="text-blue-500" />;
      case "Imaging Report":
        return <FaFileMedical className="text-purple-500" />;
      case "Pathology Report":
        return <FaFileMedical className="text-red-500" />;
      case "Diagnostic Report":
        return <FaChartLine className="text-yellow-500" />;
      case "Annual Physical":
        return <FaFileMedical className="text-green-500" />;
      case "Specialist Report":
        return <FaFileMedical className="text-indigo-500" />;
      default:
        return <FaFileMedical className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const viewReport = (report) => setSelectedReport(report);
  const closeModal = () => setSelectedReport(null);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Medical Reports
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Access and manage your medical test results and reports
            </p>
          </div>
          <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 sm:py-3 px-3 sm:px-5 rounded-lg flex items-center justify-center sm:justify-start transition shadow-md hover:shadow-lg w-full sm:w-auto">
            <FaFileMedical className="mr-2" /> Request Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4 mb-8">
          {reportTypes.map((type) => (
            <div
              key={type.id}
              className={`bg-white p-5 rounded-xl shadow-sm cursor-pointer transition hover:shadow-md ${
                activeTab === type.id ? "border-l-4 border-green-500" : ""
              }`}
              onClick={() => setActiveTab(type.id)}
            >
              <div className="flex justify-between items-center">
                <div className="text-2xl">{type.icon}</div>
                <div className="text-2xl font-bold text-gray-800">
                  {type.count}
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mt-2">
                {type.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Controls */}
       <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  {/* Tabs */}
                  <div className="flex space-x-4 overflow-x-auto pb-2 whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                    {reportTypes.map((type) => (
                      <button
                        key={type.id}
                        className={`whitespace-nowrap pb-2 px-1 font-medium transition ${activeTab === type.id
                            ? "text-green-700 border-b-2 border-green-700"
                            : "text-gray-500 hover:text-green-600"
                          }`}
                        onClick={() => setActiveTab(type.id)}
                      >
                        {type.name}
                      </button>
                    ))}
                  </div>
      
                  {/* Search and Filter */}
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 w-full">
                    {/* Search */}
                    <div className="relative w-full">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search reports..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
      
                    {/* Filter */}
                    <button
                      className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 w-full sm:w-auto justify-center sm:justify-start"
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <FaFilter className="text-gray-400 mr-2" /> Filter
                    </button>
                  </div>
                </div>
              </div>
      

        {/* Reports List */}
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-6">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                      <div className="text-xl">{getTypeIcon(report.type)}</div>
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {report.title}
                      </h3>
                      <p className="text-gray-600 text-sm sm:text-base">
                        {report.type} • {report.doctor}
                      </p>
                      <p className="text-gray-700 mt-2 text-xs sm:text-sm">
                        {report.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {report.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 sm:mt-0 flex flex-col justify-between items-end gap-2 sm:gap-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        report.status
                      )}`}
                    >
                      {report.status.charAt(0).toUpperCase() +
                        report.status.slice(1)}
                    </span>
                    <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="mr-2" />{" "}
                        {formatDate(report.date)}
                        <span className="mx-2">•</span>
                        <FaFilePdf className="mr-1 text-red-500" />{" "}
                        {report.fileSize}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          className="p-2 text-gray-500 hover:text-green-600 rounded-lg hover:bg-green-50 transition"
                          onClick={() => viewReport(report)}
                        >
                          <FaEye />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition">
                          <FaDownload />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-purple-600 rounded-lg hover:bg-purple-50 transition">
                          <FaShare />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition">
                          <FaPrint />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <FaFileMedical className="text-3xl text-green-600" />
              </div>
              <h3 className="text-xl font-medium text-gray-600">
                No reports found
              </h3>
              <p className="text-gray-500 mt-2">
                No reports match your current filters.
              </p>
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                onClick={() => {
                  setActiveTab("all");
                  setSearchTerm("");
                }}
              >
                View All Reports
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-full overflow-y-auto">
            {/* Sticky Header */}
            <div className="p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-xl sm:text-2xl font-bold">
                {selectedReport.title}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 text-2xl"
                onClick={closeModal}
              >
                &times;
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
              <p className="text-gray-600 text-sm sm:text-base">
                {selectedReport.type} • {selectedReport.doctor}
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedReport.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Report Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
                  <div>
                    <span className="text-gray-600">Date:</span>{" "}
                    <span className="ml-2">
                      {formatDate(selectedReport.date)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">File Type:</span>{" "}
                    <span className="ml-2">
                      {selectedReport.fileType.toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">File Size:</span>{" "}
                    <span className="ml-2">{selectedReport.fileSize}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>{" "}
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        selectedReport.status
                      )}`}
                    >
                      {selectedReport.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Report Description
                </h3>
                <p className="text-gray-700">{selectedReport.description}</p>
              </div>

              <div className="bg-gray-800 text-white p-4 rounded-lg text-center">
                <div className="flex flex-col sm:flex-row justify-center items-center mb-4 gap-4">
                  <FaFilePdf className="text-4xl text-red-500" />
                  <div>
                    <p className="font-medium">
                      This is a preview of your report
                    </p>
                    <p className="text-sm text-gray-300">
                      The full report is available for download
                    </p>
                  </div>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg inline-flex items-center">
                  <FaDownload className="mr-2" /> Download Full Report
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={closeModal}
              >
                Close
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center">
                <FaDownload className="mr-2" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;