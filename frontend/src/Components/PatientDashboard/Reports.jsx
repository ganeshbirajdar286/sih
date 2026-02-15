import React, { useState, useEffect } from "react";
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

import { useDispatch, useSelector } from "react-redux";
import { getReport } from "../../feature/Patient/patient.thunk";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const dispatch = useDispatch();

  const { medicalreport, loading } = useSelector((state) => state.patient);

  useEffect(() => {
    dispatch(getReport());
  }, [dispatch]);

  const medicalReports =
    medicalreport?.[0]?.Medical_records?.map((rep) => ({
      id: rep._id,
      type: rep.Category,
      title: rep.Title,
      date: rep.Report_date,

      // ✅ FIXED DOCTOR NAME
      doctor:
        rep.Doctor_id?.User_id?.Name ||
        rep.Doctor_id?.Specialization ||
        "Doctor",

      doctorImage: rep.Doctor_id?.User_id?.Image_url,

      status: "completed",
      description: rep.Title,
      tags: [rep.Category],
      fileType: "pdf",
      fileSize: "Report File",
      previewAvailable: true,
      fileUrl: rep.File_url,
    })) || [];

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
      count: medicalReports.filter((r) => r.type?.toLowerCase().includes("lab"))
        .length,
    },
    {
      id: "imaging",
      name: "Imaging",
      icon: <FaFileMedical />,
      count: medicalReports.filter((r) =>
        r.type?.toLowerCase().includes("imaging"),
      ).length,
    },
    {
      id: "diagnostic",
      name: "Diagnostic",
      icon: <FaChartLine />,
      count: medicalReports.filter((r) =>
        r.type?.toLowerCase().includes("diagnostic"),
      ).length,
    },
  ];

  const filteredReports = medicalReports
    .filter((report) => {
      if (activeTab === "all") return true;
      if (activeTab === "lab")
        return report.type?.toLowerCase().includes("lab");
      if (activeTab === "imaging")
        return report.type?.toLowerCase().includes("imaging");
      if (activeTab === "diagnostic")
        return report.type?.toLowerCase().includes("diagnostic");
      return true;
    })
    .filter(
      (report) =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );

  const getTypeIcon = (type) => {
    switch (type) {
      case "Lab Reports":
        return <FaFileMedical className="text-blue-500" />;
      case "Imaging":
        return <FaFileMedical className="text-purple-500" />;
      case "Diagnostic":
        return <FaChartLine className="text-yellow-500" />;
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



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Medical Reports
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Access and manage your medical test results and reports
            </p>
          </div>
        </div>

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

        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="flex space-x-6 overflow-x-auto pb-2 whitespace-nowrap">
              <button
                className={`pb-2 px-1 font-medium transition ${
                  activeTab === "all"
                    ? "text-green-700 border-b-2 border-green-700"
                    : "text-gray-500 hover:text-green-600"
                } cursor-pointer`}
                onClick={() => setActiveTab("all")}
              >
                All Reports
              </button>

              <button
                className={`pb-2 px-1 font-medium transition ${
                  activeTab === "lab"
                    ? "text-green-700 border-b-2 border-green-700"
                    : "text-gray-500 hover:text-green-600"
                } cursor-pointer`}
                onClick={() => setActiveTab("lab")}
              >
                Lab Reports
              </button>

              <button
                className={`pb-2 px-1 font-medium transition ${
                  activeTab === "imaging"
                    ? "text-green-700 border-b-2 border-green-700"
                    : "text-gray-500 hover:text-green-600"
                } cursor-pointer`}
                onClick={() => setActiveTab("imaging")}
              >
                Imaging
              </button>

              <button
                className={`pb-2 px-1 font-medium transition ${
                  activeTab === "diagnostic"
                    ? "text-green-700 border-b-2 border-green-700"
                    : "text-gray-500 hover:text-green-600"
                } cursor-pointer`}
                onClick={() => setActiveTab("diagnostic")}
              >
                Diagnostic
              </button>
            </div>

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
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 gap-6">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
              >
                <div className="p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-green-100 p-3 rounded-lg">
                      <div className="text-xl">{getTypeIcon(report.type)}</div>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {report.title}
                      </h3>

                      <div className="flex items-center text-gray-600 text-sm sm:text-base gap-2 mt-1">
                        <span>{report.type}</span>

                        <span>•</span>

                        <img
                          src={
                            report.doctorImage ||
                            "https://ui-avatars.com/api/?name=Doctor"
                          }
                          alt="doctor"
                          className="w-6 h-6 rounded-full object-cover"
                        />

                        <span>{report.doctor}</span>
                      </div>

                      <p className="text-gray-700 mt-1 text-sm">
                        context:{report.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {report.tags?.map((tag) => (
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

                  <div className="flex flex-col items-end gap-4 w-full sm:w-auto">
                    <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium capitalize">
                      {report.status}
                    </span>

                    <div className="flex items-center text-sm text-gray-500 gap-4 flex-wrap justify-end">
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-gray-400" />
                        {formatDate(report.date)}
                      </div>

                      <button
                        onClick={() => viewReport(report)}
                        className="hover:text-green-600 transition cursor-pointer"
                      >
                        <FaEye />
                      </button>

                      <a
                        href={report.fileUrl.replace(
                          "/upload/",
                          "/upload/fl_attachment/",
                        )}
                        className="hover:text-blue-600 transition"
                      >
                        <FaDownload />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12 bg-white rounded-xl shadow-sm">
              No reports found
            </div>
          )}
        </div>

       {selectedReport && (
  <div className="fixed inset-0 bg-black/40 flex items-start sm:items-center justify-center p-4 z-50 overflow-y-auto">

    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-full overflow-y-auto border border-green-100">

      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-green-100 sticky top-0 bg-white z-10 flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-green-700">
          {selectedReport.title}
        </h2>

        <button
          className="text-gray-500 hover:text-green-600 text-2xl"
          onClick={closeModal}
        >
          &times;
        </button>
      </div>

      {/* Body */}
      <div className="p-4 sm:p-6 space-y-6">

        {/* Top Info */}
        <div>
          <p className="text-gray-600 text-sm sm:text-base">
            {selectedReport.type} • {selectedReport.doctor}
          </p>

          <div className="flex items-center text-sm text-gray-500 mt-2">
            <FaCalendarAlt className="mr-2 text-green-600" />
            {formatDate(selectedReport.date)}
          </div>
        </div>

        {/* Report Details */}
        <div className="bg-green-50 p-4 rounded-lg border border-green-100">
          <h3 className="font-medium text-green-800 mb-3">
            Report Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base">

            <div>
              <span className="text-gray-600">File Type:</span>
              <span className="ml-2 font-medium text-green-700">
                PDF
              </span>
            </div>

            <div>
              <span className="text-gray-600">Status:</span>
              <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Completed
              </span>
            </div>

            <div>
              <span className="text-gray-600">Category:</span>
              <span className="ml-2 font-medium text-green-700">
                {selectedReport.type}
              </span>
            </div>

            <div>
              <span className="text-gray-600">Doctor:</span>
              <span className="ml-2 font-medium text-green-700">
                {selectedReport.doctor}
              </span>
            </div>

          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-lg text-center shadow-md">

          <div className="flex flex-col sm:flex-row justify-center items-center mb-4 gap-4">
            <FaFilePdf className="text-5xl text-white" />

            <div>
              <p className="font-medium text-lg">
                Report Preview
              </p>
              <p className="text-sm text-green-100">
                Click view to open full report
              </p>
            </div>
          </div>

          <a
            href={selectedReport.fileUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-white text-green-700 hover:bg-green-50 font-medium py-2 px-5 rounded-lg inline-flex items-center transition"
          >
            <FaEye className="mr-2" />
            View Report
          </a>

        </div>

      </div>

      {/* Footer */}
      <div className="p-4 sm:p-6 border-t border-green-100 flex flex-col sm:flex-row justify-end gap-3">

        <button
          className="px-4 py-2 border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition"
          onClick={closeModal}
        >
          Close
        </button>

        <a
          href={selectedReport.fileUrl.replace(
            "/upload/",
            "/upload/fl_attachment/"
          )}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center transition"
        >
          <FaDownload className="mr-2" />
          Download
        </a>

      </div>

    </div>
  </div>
)}

      </div>
    </div>
  );
};

export default Reports;
