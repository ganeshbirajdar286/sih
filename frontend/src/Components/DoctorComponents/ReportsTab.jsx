import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  myPatient,
  getReports,
  deleteReports,
  createReport,
} from "../../feature/Doctor/doctor.thunk";
import toast from "react-hot-toast";
import {
  FileText,
  UploadCloud,
  Search,
  Filter,
  Download,
  Eye,
  User,
  Calendar,
  Loader2,
  X,
  File,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Activity,
  Layers,
  FolderOpen,
  Trash2,
  AlertTriangle,
} from "lucide-react";

export default function ReportsTab() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { appointment = [], reports = [], loading } = useSelector((state) => state.doctor);

  // Exact categories specified by user
  const categories = ["All Reports", "Lab Reports", "Imaging", "Diagnostic"];
  const formCategories = ["Lab Reports", "Imaging", "Diagnostic"];

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Reports");
  const [selectedPatientFilter, setSelectedPatientFilter] = useState("all");

  // Form Fields State
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const [reportCategory, setReportCategory] = useState("Lab Reports");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Preview Modal State
  const [previewReport, setPreviewReport] = useState(null);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, report: null });
  const [isDeletingId, setIsDeletingId] = useState(null);

  // Initial Fetch: get doctor patients and all medical reports
  useEffect(() => {
    dispatch(myPatient());
    dispatch(getReports());
  }, [dispatch]);

  // Extract list of unique patients from accepted appointments
  const acceptedAppointments = appointment.filter((a) => a.Patient_id);
  const uniquePatientsMap = useMemo(() => {
    const map = new Map();
    acceptedAppointments.forEach((apt) => {
      if (apt.Patient_id && apt.Patient_id._id) {
        map.set(apt.Patient_id._id, apt.Patient_id);
      }
    });
    return map;
  }, [acceptedAppointments]);

  const patientsList = useMemo(() => Array.from(uniquePatientsMap.values()), [uniquePatientsMap]);

  // Set default selected patient if not set
  useEffect(() => {
    if (patientsList.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patientsList[0]._id);
    }
  }, [patientsList, selectedPatientId]);

  // Aggregate medical reports from getReports API & nested patient medical records
  const allMedicalRecords = useMemo(() => {
    const recordList = [];
    const seenIds = new Set();

    // 1. Process reports from getReports thunk (state.doctor.reports)
    if (Array.isArray(reports)) {
      reports.forEach((rep) => {
        if (!rep) return;
        const recId = rep._id || rep.id;
        if (recId) seenIds.add(recId);

        let patientObj = null;
        if (rep.Patient_id && typeof rep.Patient_id === "object") {
          patientObj = rep.Patient_id;
        } else if (rep.Patient_id && uniquePatientsMap.has(rep.Patient_id)) {
          patientObj = uniquePatientsMap.get(rep.Patient_id);
        } else if (rep.patient && typeof rep.patient === "object") {
          patientObj = rep.patient;
        }

        recordList.push({
          _id: recId,
          Title: rep.Title || rep.title || "Medical Report",
          Category: rep.Category || rep.category || rep.type || "Lab Reports",
          File_url: rep.File_url || rep.fileUrl || rep.file,
          Report_date: rep.Report_date || rep.createdAt || rep.date,
          patientName: patientObj?.Name || rep.patientName || "Patient",
          patientEmail: patientObj?.Email || rep.patientEmail || "",
          patientImage: patientObj?.Image_url || rep.patientImage || "",
          patientId: patientObj?._id || rep.patientId || (typeof rep.Patient_id === "string" ? rep.Patient_id : ""),
          patientAge: patientObj?.Age || rep.patientAge,
          patientGender: patientObj?.Gender || rep.patientGender,
          raw: rep,
        });
      });
    }

    // 2. Aggregate additional records from patient.Medical_records
    patientsList.forEach((patient) => {
      if (patient.Medical_records && Array.isArray(patient.Medical_records)) {
        patient.Medical_records.forEach((record) => {
          const recId = record._id || record.id;
          if (recId && seenIds.has(recId)) return;
          if (recId) seenIds.add(recId);

          recordList.push({
            ...record,
            _id: recId,
            Title: record.Title || record.title || "Medical Report",
            Category: record.Category || record.category || "Lab Reports",
            File_url: record.File_url || record.fileUrl || record.file,
            Report_date: record.Report_date || record.createdAt,
            patientName: patient.Name || "Patient",
            patientEmail: patient.Email,
            patientImage: patient.Image_url,
            patientId: patient._id,
            patientAge: patient.Age,
            patientGender: patient.Gender,
            raw: record,
          });
        });
      }
    });

    return recordList;
  }, [reports, patientsList, uniquePatientsMap]);

  // Handle Drag and Drop for Upload
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // Upload Report Handler
  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (!selectedPatientId) {
      toast.error("Please select a patient");
      return;
    }
    if (!reportTitle.trim()) {
      toast.error("Please enter a report title");
      return;
    }
    if (!selectedFile) {
      toast.error("Please select a report file to upload");
      return;
    }

    try {
      setIsUploading(true);
      await dispatch(
        createReport({
          id: selectedPatientId,
          Title: reportTitle.trim(),
          Category: reportCategory,
          file: selectedFile,
        })
      ).unwrap();

      toast.success("Medical report uploaded successfully!");

      // Reset Form
      setReportTitle("");
      setReportCategory("Lab Reports");
      setSelectedFile(null);

      // Refresh reports and patient data
      dispatch(getReports());
      dispatch(myPatient());
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(typeof err === "string" ? err : "Failed to upload report");
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Report Handler
  const handleDeleteReport = async (report) => {
    const reportId = report._id || report.id;
    if (!reportId) {
      toast.error("Unable to delete: Report ID is missing.");
      return;
    }

    try {
      setIsDeletingId(reportId);
      await dispatch(deleteReports({ id: reportId })).unwrap();
      toast.success("Medical report deleted successfully!");

      // Close modals if deleting previewed/selected report
      setDeleteModal({ isOpen: false, report: null });
      if (previewReport && (previewReport._id === reportId || previewReport.id === reportId)) {
        setPreviewReport(null);
      }

      // Re-sync reports list and patients
      dispatch(getReports());
      dispatch(myPatient());
    } catch (err) {
      console.error("Delete error:", err);
      toast.error(typeof err === "string" ? err : "Failed to delete medical report");
    } finally {
      setIsDeletingId(null);
    }
  };

  // Filtering records
  const filteredRecords = allMedicalRecords.filter((record) => {
    const titleMatch = (record.Title || "").toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = (record.Category || "").toLowerCase().includes(searchQuery.toLowerCase());
    const patientMatch = (record.patientName || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSearch = !searchQuery || titleMatch || categoryMatch || patientMatch;

    const matchesCategory =
      activeCategory === "All Reports" ||
      (record.Category || "").toLowerCase() === activeCategory.toLowerCase();

    const matchesPatient =
      selectedPatientFilter === "all" || record.patientId === selectedPatientFilter;

    return matchesSearch && matchesCategory && matchesPatient;
  });

  // Calculate Metrics
  const totalReportsCount = allMedicalRecords.length;
  const patientsWithReportsCount = new Set(allMedicalRecords.map((r) => r.patientId).filter(Boolean)).size;
  const labReportsCount = allMedicalRecords.filter((r) =>
    (r.Category || "").toLowerCase().includes("lab")
  ).length;
  const imagingReportsCount = allMedicalRecords.filter(
    (r) =>
      (r.Category || "").toLowerCase().includes("imaging") ||
      (r.Category || "").toLowerCase().includes("x-ray") ||
      (r.Category || "").toLowerCase().includes("mri")
  ).length;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .rt-container { font-family: 'DM Sans', sans-serif; }
        .rt-title { font-family: 'Playfair Display', serif; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .rt-animate { animation: fadeIn 0.4s ease forwards; }
      `}</style>

      <div className="rt-container space-y-6 pb-12">
        {/* Top Banner Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-600/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-20 translate-x-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-white/5 rounded-full -translate-x-16 translate-y-16 pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-white/20 text-emerald-100 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5 backdrop-blur-md">
                  <FileText className="w-3.5 h-3.5" /> Doctor Medical Reports
                </span>
              </div>
              <h1 className="rt-title text-2xl sm:text-3xl font-bold">Upload & Manage Patient Medical Reports</h1>
              <p className="text-emerald-100 text-sm mt-1 max-w-xl">
                Upload diagnostic test results, lab reports, and imaging scans. Only doctors can upload and delete reports.
              </p>
            </div>
          </div>
        </div>

        {/* ALWAYS VISIBLE UPLOAD MEDICAL REPORT SECTION */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-lg rt-animate">
          <div className="flex items-center gap-2.5 pb-4 border-b border-emerald-100 mb-5">
            <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Upload Medical Report</h2>
              <p className="text-xs text-gray-500">Select patient, title, category, and attach the report document</p>
            </div>
          </div>

          <form onSubmit={handleUploadSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Column: Select Patient & Details */}
            <div className="space-y-4 lg:col-span-1">
              {/* Select Patient */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Select Patient <span className="text-red-500">*</span>
                </label>
                {patientsList.length > 0 ? (
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="" disabled>
                      -- Select Patient --
                    </option>
                    {patientsList.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.Name} ({p.Email || p.Gender || "Patient"})
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder="Enter Patient ID"
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                )}
              </div>

              {/* Report Title */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Report Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Blood Test Report, Chest X-Ray"
                  value={reportTitle}
                  onChange={(e) => setReportTitle(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Report Category (Lab Reports, Imaging, Diagnostic) */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Report Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={reportCategory}
                  onChange={(e) => setReportCategory(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
                >
                  {formCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column: File Dropzone & Submit Button */}
            <div className="space-y-4 lg:col-span-2 flex flex-col justify-between">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Upload File (PDF / Images / Docs) <span className="text-red-500">*</span>
                </label>

                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer flex flex-col items-center justify-center min-h-[140px] ${
                    dragActive
                      ? "border-emerald-500 bg-emerald-50"
                      : selectedFile
                      ? "border-emerald-400 bg-emerald-50/40"
                      : "border-emerald-200 bg-gray-50 hover:bg-emerald-50/30"
                  }`}
                  onClick={() => document.getElementById("doctor-report-file-input").click()}
                >
                  <input
                    id="doctor-report-file-input"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                  />

                  {selectedFile ? (
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-200 shadow-sm w-full max-w-md">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <File className="w-6 h-6 text-emerald-600 shrink-0" />
                        <div className="min-w-0 text-left">
                          <p className="text-xs font-bold text-gray-800 truncate">{selectedFile.name}</p>
                          <p className="text-[11px] text-gray-400">
                            {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 rounded-lg transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div>
                      <UploadCloud className="w-10 h-10 text-emerald-500 mx-auto mb-2 animate-bounce" />
                      <p className="text-xs font-semibold text-gray-700">
                        Click or drag & drop report file to upload
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Supports PDF, PNG, JPG, JPEG, DOCX up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Uploading Report...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      Upload Report
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Metrics Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Reports</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{totalReportsCount}</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Across all patients
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100/80 rounded-xl flex items-center justify-center text-emerald-700">
              <FolderOpen className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Patients Covered</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{patientsWithReportsCount}</h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">With uploaded records</p>
            </div>
            <div className="w-12 h-12 bg-teal-100/80 rounded-xl flex items-center justify-center text-teal-700">
              <User className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lab Reports</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{labReportsCount}</h3>
              <p className="text-xs text-blue-600 mt-1 font-medium">Blood & pathology</p>
            </div>
            <div className="w-12 h-12 bg-blue-100/80 rounded-xl flex items-center justify-center text-blue-700">
              <Activity className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex items-center justify-between hover:shadow-md transition">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Imaging & Scans</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{imagingReportsCount}</h3>
              <p className="text-xs text-purple-600 mt-1 font-medium">X-Ray, MRI & Scans</p>
            </div>
            <div className="w-12 h-12 bg-purple-100/80 rounded-xl flex items-center justify-center text-purple-700">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl p-4 border border-emerald-100 shadow-sm space-y-3">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports by title, category, patient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
              />
            </div>

            {/* Patient Filter */}
            <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-gray-600">Patient:</span>
              </div>
              <select
                value={selectedPatientFilter}
                onChange={(e) => setSelectedPatientFilter(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 cursor-pointer"
              >
                <option value="all">All Patients ({patientsList.length})</option>
                {patientsList.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.Name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exact Categories Tabs: ["All Reports", "Lab Reports", "Imaging", "Diagnostic"] */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-gray-100">
            {categories.map((cat) => {
              const count =
                cat === "All Reports"
                  ? allMedicalRecords.length
                  : allMedicalRecords.filter(
                      (r) => (r.Category || "").toLowerCase() === cat.toLowerCase()
                    ).length;

              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    activeCategory === cat
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {cat} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Reports List Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-emerald-100">
            <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-3" />
            <p className="text-gray-500 text-sm font-medium">Loading medical reports...</p>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRecords.map((record, index) => {
              const isThisDeleting = isDeletingId === record._id;

              return (
                <div
                  key={record._id || index}
                  className="bg-white rounded-2xl border border-emerald-100/80 p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group rt-animate relative"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-700 group-hover:scale-105 transition-transform">
                        <FileText className="w-5 h-5" />
                      </div>

                      <span className="px-2.5 py-1 bg-emerald-100/70 text-emerald-800 rounded-full text-xs font-semibold border border-emerald-200">
                        {record.Category || "Lab Reports"}
                      </span>
                    </div>

                    <h3 className="font-semibold text-gray-900 text-base line-clamp-1 mb-1" title={record.Title}>
                      {record.Title}
                    </h3>

                    {/* Patient Info */}
                    <div className="flex items-center gap-2.5 my-3 p-2.5 bg-gray-50/80 rounded-xl border border-gray-100">
                      {record.patientImage ? (
                        <img
                          src={record.patientImage}
                          alt={record.patientName}
                          className="w-8 h-8 rounded-full object-cover border border-emerald-200"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold">
                          {record.patientName?.charAt(0) || "P"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-800 truncate">{record.patientName}</p>
                        <p className="text-[11px] text-gray-500">
                          {record.patientAge ? `${record.patientAge} yrs` : "Patient"} • {record.patientGender || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Uploaded: {formatDate(record.Report_date || record.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions Row: Preview, View/Download, Delete */}
                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewReport(record)}
                      className="px-2.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Preview
                    </button>

                    <a
                      href={record.File_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      View
                    </a>

                    {/* Prominent Red Delete Button */}
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, report: record })}
                      disabled={isThisDeleting}
                      title="Delete Medical Report"
                      className="px-2.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isThisDeleting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-emerald-100 p-12 text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No medical reports found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-md mx-auto">
              {searchQuery || activeCategory !== "All Reports" || selectedPatientFilter !== "all"
                ? "No uploaded medical reports match your selected search or filter criteria."
                : "No patient reports have been uploaded yet. Fill out the form above to upload your first medical report."}
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && deleteModal.report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-rose-100 relative">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="p-3 bg-rose-100 rounded-xl">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Delete Medical Report</h3>
                <p className="text-xs text-gray-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 my-4 bg-gray-50 p-3 rounded-xl border border-gray-100">
              Are you sure you want to permanently delete <strong className="text-gray-900">"{deleteModal.report.Title}"</strong> for patient <span className="font-semibold text-emerald-700">{deleteModal.report.patientName}</span>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false, report: null })}
                disabled={isDeletingId !== null}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteReport(deleteModal.report)}
                disabled={isDeletingId !== null}
                className="bg-rose-600 hover:bg-rose-700 text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-md transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeletingId === deleteModal.report._id ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Delete Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Report Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{previewReport.Title}</h3>
                  <p className="text-xs text-emerald-600 font-semibold">{previewReport.Category}</p>
                </div>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-5 space-y-4">
              {/* Patient Details */}
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {previewReport.patientImage ? (
                    <img
                      src={previewReport.patientImage}
                      alt={previewReport.patientName}
                      className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                      {previewReport.patientName?.charAt(0) || "P"}
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{previewReport.patientName}</h4>
                    <p className="text-xs text-gray-500">{previewReport.patientEmail || "Patient Record"}</p>
                  </div>
                </div>

                {previewReport.patientId && (
                  <button
                    onClick={() => {
                      setPreviewReport(null);
                      navigate(`/doctor/patient/${previewReport.patientId}`);
                    }}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shadow-sm"
                  >
                    View Profile <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Report Metadata */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block font-medium mb-0.5">Upload Date</span>
                  <span className="font-semibold text-gray-800">{formatDate(previewReport.Report_date || previewReport.createdAt)}</span>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-400 block font-medium mb-0.5">Category</span>
                  <span className="font-semibold text-emerald-700">{previewReport.Category}</span>
                </div>
              </div>

              {/* View/Embed Preview Banner */}
              <div className="p-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl text-white text-center shadow-md">
                <FileText className="w-12 h-12 mx-auto mb-2 text-emerald-100" />
                <h4 className="font-bold text-base">Medical Report Document</h4>
                <p className="text-xs text-emerald-100 mt-1 mb-4">Click to open or download the complete report file</p>
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={previewReport.File_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded-xl text-xs font-semibold transition inline-flex items-center gap-2 shadow cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" /> Open Full Document
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <button
                onClick={() => {
                  const toDelete = previewReport;
                  setPreviewReport(null);
                  setDeleteModal({ isOpen: true, report: toDelete });
                }}
                className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Report
              </button>

              <button
                onClick={() => setPreviewReport(null)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}