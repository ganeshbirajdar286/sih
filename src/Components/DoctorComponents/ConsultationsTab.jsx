import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Video,
  Phone,
  MessageSquare,
  Calendar,
  User,
  Clock,
  Star,
  MapPin,
  Stethoscope,
  Leaf,
  Zap,
  MoreVertical,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  FileText,
  Download,
  Share2,
  Edit3,
  Eye,
  Trash2,
  TrendingUp,
  Heart,
  Brain,
  Scale,
  Thermometer,
  ArrowUpRight,
  Users,
  BookOpen,
  Camera
} from "lucide-react";

const ConsultationsTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
const [selectedFilter, setSelectedFilter] = useState("all");
const [expandedConsultation, setExpandedConsultation] = useState(null);
const [selectedType, setSelectedType] = useState("all");   // ✅ added before
const [selectedMonth, setSelectedMonth] = useState("all"); // ✅ fix for your error


  // Sample consultations data
  const consultations = [
    {
      id: 1,
      patientName: "Priya Sharma",
      age: 32,
      gender: "Female",
      dosha: "Vata-Pitta",
      type: "Video Consultation",
      status: "completed",
      date: "2024-01-15",
      time: "09:30 AM",
      duration: "45 min",
      priority: "high",
      chiefComplaint: "Digestive issues & Sleep disorder",
      vitals: {
        bp: "120/80",
        weight: "65kg",
        bmi: "23.1",
        pulse: "72"
      },
      assessment: "Mild Vata imbalance with Pitta aggravation",
      prescription: ["Ashwagandha", "Triphala", "Brahmi"],
      followUp: "7 days",
      notes: "Patient showed good response to previous treatment. Recommended dietary changes.",
      satisfaction: 5,
      payment: "Paid ₹1,500"
    },
    {
      id: 2,
      patientName: "Rajesh Kumar",
      age: 45,
      gender: "Male",
      dosha: "Vata",
      type: "Clinic Visit",
      status: "upcoming",
      date: "2024-01-15",
      time: "10:45 AM",
      duration: "30 min",
      priority: "medium",
      chiefComplaint: "Arthritis pain management",
      vitals: {
        bp: "130/85",
        weight: "78kg",
        bmi: "26.4",
        pulse: "68"
      },
      assessment: "Vata-type arthritis with inflammation",
      prescription: ["Turmeric", "Ginger", "Boswellia"],
      followUp: "14 days",
      notes: "Need to assess pain level reduction from last visit.",
      satisfaction: null,
      payment: "Pending ₹1,200"
    },
    {
      id: 3,
      patientName: "Anita Desai",
      age: 28,
      gender: "Female",
      dosha: "Kapha",
      type: "Audio Call",
      status: "in-progress",
      date: "2024-01-15",
      time: "11:30 AM",
      duration: "60 min",
      priority: "high",
      chiefComplaint: "PCOS & Weight management",
      vitals: {
        bp: "118/78",
        weight: "72kg",
        bmi: "27.8",
        pulse: "75"
      },
      assessment: "Kapha imbalance with metabolic issues",
      prescription: ["Cinnamon", "Fenugreek", "Guggulu"],
      followUp: "10 days",
      notes: "Discuss lifestyle modifications and exercise routine.",
      satisfaction: null,
      payment: "Paid ₹2,000"
    },
    {
      id: 4,
      patientName: "Vikram Joshi",
      age: 52,
      gender: "Male",
      dosha: "Pitta",
      type: "Video Consultation",
      status: "cancelled",
      date: "2024-01-15",
      time: "02:15 PM",
      duration: "20 min",
      priority: "low",
      chiefComplaint: "Diabetes follow-up",
      vitals: {
        bp: "125/82",
        weight: "70kg",
        bmi: "24.2",
        pulse: "70"
      },
      assessment: "Pitta-type diabetes under control",
      prescription: ["Bitter melon", "Fenugreek", "Neem"],
      followUp: "30 days",
      notes: "Patient cancelled due to emergency.",
      satisfaction: null,
      payment: "Refunded ₹1,000"
    },
    {
      id: 5,
      patientName: "Neha Singh",
      age: 35,
      gender: "Female",
      dosha: "Vata",
      type: "Clinic Visit",
      status: "scheduled",
      date: "2024-01-16",
      time: "09:00 AM",
      duration: "45 min",
      priority: "medium",
      chiefComplaint: "Anxiety & Stress management",
      vitals: {
        bp: "122/79",
        weight: "58kg",
        bmi: "21.8",
        pulse: "80"
      },
      assessment: "Vata imbalance affecting nervous system",
      prescription: ["Brahmi", "Jatamansi", "Shankhpushpi"],
      followUp: "15 days",
      notes: "New patient - complete dosha analysis required.",
      satisfaction: null,
      payment: "Advance ₹800"
    }
  ];

  const filters = [
    { value: "all", label: "All Consultations", count: consultations.length, color: "bg-gray-500" },
    { value: "upcoming", label: "Upcoming", count: consultations.filter(c => c.status === "upcoming" || c.status === "scheduled").length, color: "bg-blue-500" },
    { value: "in-progress", label: "In Progress", count: consultations.filter(c => c.status === "in-progress").length, color: "bg-amber-500" },
    { value: "completed", label: "Completed", count: consultations.filter(c => c.status === "completed").length, color: "bg-green-500" },
    { value: "cancelled", label: "Cancelled", count: consultations.filter(c => c.status === "cancelled").length, color: "bg-red-500" }
  ];

  const consultationTypes = [
    { value: "all", label: "All Types", icon: Users },
    { value: "video", label: "Video", icon: Video },
    { value: "clinic", label: "Clinic", icon: MapPin },
    { value: "audio", label: "Audio", icon: Phone }
  ];

  const getStatusBadge = (status) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-800 border-blue-200",
      upcoming: "bg-blue-100 text-blue-800 border-blue-200",
      "in-progress": "bg-amber-100 text-amber-800 border-amber-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200"
    };
    return `px-3 py-1 rounded-full text-sm font-medium border ${styles[status]}`;
  };

  const getPriorityBadge = (priority) => {
    const styles = {
      high: "bg-red-100 text-red-800",
      medium: "bg-amber-100 text-amber-800",
      low: "bg-green-100 text-green-800"
    };
    return `px-2 py-1 rounded-full text-xs ${styles[priority]}`;
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Video Consultation": return <Video className="w-4 h-4 text-purple-600" />;
      case "Clinic Visit": return <MapPin className="w-4 h-4 text-green-600" />;
      case "Audio Call": return <Phone className="w-4 h-4 text-blue-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const toggleConsultation = (id) => {
    setExpandedConsultation(expandedConsultation === id ? null : id);
  };

  // ---- Filtering logic ----
  const filteredConsultations = consultations
    .filter((consultation) => {
      // Status filter
      if (selectedFilter !== "all") {
        if (
          selectedFilter === "upcoming" &&
          !(consultation.status === "upcoming" || consultation.status === "scheduled")
        ) return false;
        if (consultation.status !== selectedFilter && selectedFilter !== "all") return false;
      }

      // Type filter
      if (selectedType !== "all") {
        if (
          (selectedType === "video" && consultation.type !== "Video Consultation") ||
          (selectedType === "clinic" && consultation.type !== "Clinic Visit") ||
          (selectedType === "audio" && consultation.type !== "Audio Call")
        ) return false;
      }

      // Month filter
      if (selectedMonth !== "all") {
        const consultMonth = new Date(consultation.date).getMonth(); // 0-based
        const currentMonth = new Date().getMonth();
        if (selectedMonth === "today") {
          const today = new Date().toISOString().split("T")[0];
          if (consultation.date !== today) return false;
        } else if (selectedMonth === "thisMonth" && consultMonth !== currentMonth) {
          return false;
        }
      }

      // Search filter
      return (
        consultation.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.chiefComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
        consultation.dosha.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  return (
    <div className="p-6 grid gap-6">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Patient Consultations
          </h2>
          <p className="text-gray-600 mt-1">
            Manage your Ayurvedic consultations and patient interactions
          </p>
        </div>

        {/* Buttons aligned right on desktop */}
        <div className="grid grid-cols-1 gap-3 ">
          <button className="cursor-pointer flex items-center justify-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg">
            <Plus className="w-4 h-4" />
            New Consultation
          </button>
         
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {filters.map((filter) => (
          <div
            key={filter.value}
            className={`p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:scale-105 ${selectedFilter === filter.value
              ? "border-purple-300 bg-purple-50 shadow-lg"
              : "border-gray-100 bg-white shadow-sm"
              }`}
            onClick={() => setSelectedFilter(filter.value)}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-gray-900">{filter.count}</div>
                <div className="text-sm text-gray-600">{filter.label}</div>
              </div>
              <div className={`w-3 h-3 rounded-full ${filter.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">

          {/* Left Section - Search + Date */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative w-full sm:w-auto">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients, complaints, doshas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <select
              className="cursor-pointer px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="thisMonth">This Month</option>
            </select>

          </div>

          {/* Center Section - Type Filters */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {consultationTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}  // ✅ now works
                className={` cursor-pointer flex items-center gap-2 px-3 py-2 border rounded-xl text-sm transition-colors
        ${selectedType === type.value
                    ? "bg-purple-100 border-purple-300"
                    : "bg-white hover:bg-purple-50 border-gray-200"
                  }`}
              >
                <type.icon className="w-4 h-4" />
                <span>{type.label}</span>
              </button>
            ))}
          </div>



          {/* Right Section - Count */}
          <div className="flex items-center justify-end text-sm text-purple-700 font-medium">
            <Stethoscope className="w-4 h-4 mr-2" />
            {filteredConsultations.length} consultations
          </div>
        </div>
      </div>



      {/* Consultations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
        {filteredConsultations.map((consultation) => (
          <div
            key={consultation.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Consultation Header */}
            <div
              className="p-4 cursor-pointer"
              onClick={() => toggleConsultation(consultation.id)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                {/* Left Section */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg shrink-0">
                    <Stethoscope className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {consultation.patientName}
                      </h3>
                      <span className="text-sm text-gray-500">
                        • {consultation.age}yrs • {consultation.gender}
                      </span>
                      <span className={getPriorityBadge(consultation.priority)}>
                        {consultation.priority} priority
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        {getTypeIcon(consultation.type)}
                        {consultation.type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {consultation.time} • {consultation.duration}
                      </span>
                      <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                        {consultation.dosha} Dosha
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Section */}
                <div className="flex items-start justify-end gap-3">
                  <span className={getStatusBadge(consultation.status)}>
                    {consultation.status}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform ${expandedConsultation === consultation.id ? "rotate-180" : ""
                      }`}
                  />
                </div>
              </div>

              {/* Chief Complaint */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <span className="text-sm text-gray-600">Chief Complaint: </span>
                  <span className="text-sm font-medium text-gray-900">
                    {consultation.chiefComplaint}
                  </span>
                </div>
                <div className="text-sm text-gray-600">{consultation.payment}</div>
              </div>
            </div>


            {/* Expanded Details */}
            {expandedConsultation === consultation.id && (
              <div className="border-t border-gray-100 p-4 bg-gray-50">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">
                  {/* Vitals */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      Vital Signs
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {Object.entries(consultation.vitals).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-white p-2 rounded-lg text-center"
                        >
                          <div className="font-bold text-gray-900">{value}</div>
                          <div className="text-xs text-gray-600 capitalize">
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Assessment */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-500" />
                      Ayurvedic Assessment
                    </h4>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                      {consultation.assessment}
                    </p>
                  </div>

                  {/* Prescription */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500" />
                      Prescription
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {consultation.prescription.map((medicine, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                        >
                          {medicine}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes & Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Clinical Notes
                    </h4>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded-lg">
                      {consultation.notes}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Quick Actions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="cursor-pointer flex items-center gap-2 bg-purple-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-purple-600 transition-colors">
                        <Edit3 className="w-4 h-4" />
                        Add Notes
                      </button>
                      <button className="cursor-pointer flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        <FileText className="w-4 h-4" />
                        Prescription
                      </button>
                      <button className="cursor-pointer flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-200 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Follow-up in: {consultation.followUp}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 sm:gap-3">
                    {/* Rating */}
                    {consultation.satisfaction && (
                      <div className="flex items-center gap-1 text-amber-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm">{consultation.satisfaction}/5</span>
                      </div>
                    )}

                    {/* Complete button */}
                    <button className="cursor-pointer flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors">
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </button>

                    {/* Share button */}
                    <button className="cursor-pointer flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        ))}
      </div>



      {/* Empty State */}
      {filteredConsultations.length === 0 && (
        <div className="text-center py-12">
          <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No consultations found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery
              ? `No consultations match "${searchQuery}". Try adjusting your search.`
              : "Schedule your first consultation to get started."}
          </p>
          <button className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-xl font-medium mx-auto">
            <Plus className="w-4 h-4" />
            Schedule Consultation
          </button>
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-purple-600">₹24.5k</div>
            <div className="text-sm text-gray-600">Revenue Today</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">94%</div>
            <div className="text-sm text-gray-600">Satisfaction Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">18</div>
            <div className="text-sm text-gray-600">Consultations Today</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">2.3k</div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ConsultationsTab;