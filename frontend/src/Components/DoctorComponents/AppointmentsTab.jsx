import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  myPatient,
  Cancel_appointments,
  conformationappointment,
} from "../../feature/Doctor/doctor.thunk";
import toast from "react-hot-toast";

import {
  Calendar,
  Search,
  Eye,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Stethoscope,
  Loader2,
  Zap,
  SlidersHorizontal,
  Trash2,
  Ban,
} from "lucide-react";

/* ─────────────────────────────────────────────
   Helpers  (all defined BEFORE the component)
───────────────────────────────────────────── */

const formatDate = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const statusMeta = {
  Pending: {
    icon: <AlertCircle size={14} />,
    color: "#f59e0b",
    bg: "#fffbeb",
    border: "#fde68a",
    label: "Pending",
  },
  Accepted: {
    icon: <CheckCircle size={14} />,
    color: "#10b981",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    label: "Accepted",
  },
  Rejected: {
    icon: <Ban size={14} />,
    color: "#dc2626",
    bg: "#fef2f2",
    border: "#fecaca",
    label: "Rejected",
  },
  Cancelled: {
    icon: <XCircle size={14} />,
    color: "#ef4444",
    bg: "#fef2f2",
    border: "#fecaca",
    label: "Cancelled",
  },
};

const getMeta = (status) => {
  if (!status) return statusMeta.Pending;
  const formatted =
    status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  // "accepted" → "Accepted", "rejected" → "Rejected", etc.
  return (
    statusMeta[formatted] ||
    statusMeta[status] || {
      icon: <Clock size={14} />,
      color: "#6b7280",
      bg: "#f9fafb",
      border: "#e5e7eb",
      label: formatted,
    }
  );
};

/* Maps a raw DB status to which filter pill it belongs to */
const statusToPill = (status) => {
  if (!status) return "pending";
  const s = status.toLowerCase();
  if (s === "pending") return "pending";
  if (s === "accepted") return "confirmed"; // Accepted → Confirmed pill
  if (s === "rejected") return "cancelled"; // Rejected → Cancelled pill
  if (s === "cancelled") return "cancelled";
  return s;
};

/* ─────────────────────────────────────────────
   Status Badge
───────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const m = getMeta(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: "3px 10px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        color: m.color,
        background: m.bg,
        border: `1px solid ${m.border}`,
      }}
    >
      {m.icon}
      {m.label}
    </span>
  );
};

/* ─────────────────────────────────────────────
   Small sub-component
───────────────────────────────────────────── */
const DetailRow = ({ label, value }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "5px 0",
      borderBottom: "1px solid #f0fdf4",
    }}
  >
    <span style={{ fontSize: 12, color: "#6b7280", fontWeight: 500 }}>
      {label}
    </span>
    <span style={{ fontSize: 13, color: "#064e3b", fontWeight: 600 }}>
      {value ?? "—"}
    </span>
  </div>
);

/* ─────────────────────────────────────────────
   Main Component
───────────────────────────────────────────── */
const AppointmentsTab = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    appointment: appointments = [],
    loading,
    error,
  } = useSelector((state) => state.doctor);

  const [localAppointments, setLocalAppointments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [confirmingId, setConfirmingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    dispatch(myPatient());
  }, [dispatch]);

  useEffect(() => {
    setLocalAppointments(appointments);
  }, [appointments]);

  const handleStatusUpdate = async (id, Status) => {
    const oldData = [...localAppointments];
    setLocalAppointments((prev) =>
      prev.map((apt) => (apt._id === id ? { ...apt, Status } : apt)),
    );
    try {
      setConfirmingId(id + Status);
      await dispatch(conformationappointment({ id, Status })).unwrap();
    } catch (err) {
      console.error("Failed → reverting", err);
      setLocalAppointments(oldData);
    } finally {
      setConfirmingId(null);
      toast.success("status updated");
    }
  };

  const handleDelete = async (id) => {
    const oldData = [...localAppointments];

    // 1️⃣ Remove instantly from UI
    setLocalAppointments((prev) => prev.filter((apt) => apt._id !== id));

    try {
      setDeletingId(id);

      // 2️⃣ Call backend delete
      await dispatch(Cancel_appointments(id)).unwrap();

      toast.success("Appointment deleted");
    } catch (err) {
      console.error("Delete failed → reverting");

      // 3️⃣ Revert if API fails
      setLocalAppointments(oldData);
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };


  const pillOptions = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "confirmed", label: "Confirmed" },
    { key: "cancelled", label: "Cancelled" },
  ];

  const pillMeta = {
    all: {
      color: "#6b7280",
      bg: "#f9fafb",
      border: "#e5e7eb",
      activeColor: "#059669",
      activeBg: "#ecfdf5",
      activeBorder: "#a7f3d0",
    },
    pending: {
      color: "#f59e0b",
      bg: "#fffbeb",
      border: "#fde68a",
      activeColor: "#f59e0b",
      activeBg: "#fffbeb",
      activeBorder: "#fde68a",
    },
    confirmed: {
      color: "#10b981",
      bg: "#ecfdf5",
      border: "#a7f3d0",
      activeColor: "#10b981",
      activeBg: "#ecfdf5",
      activeBorder: "#a7f3d0",
    },
    cancelled: {
      color: "#dc2626",
      bg: "#fef2f2",
      border: "#fecaca",
      activeColor: "#dc2626",
      activeBg: "#fef2f2",
      activeBorder: "#fecaca",
    },
  };

  const getPillCount = (pillKey) => {
    if (pillKey === "all") return localAppointments.length;
    return localAppointments.filter((a) => statusToPill(a.Status) === pillKey)
      .length;
  };


  const filtered = localAppointments
    .filter((apt) => {
      const patient = apt.Patient_id;
      const haystack = [
        patient?.Name,
        patient?.Email,
        apt.Status,
        apt.Condition,
        apt.Time_slot,
      ]
        .join(" ")
        .toLowerCase();

      const matchSearch =
        !searchQuery || haystack.includes(searchQuery.toLowerCase());

      const matchStatus =
        selectedStatus === "all" || statusToPill(apt.Status) === selectedStatus;

      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      if (sortBy === "date")
        return new Date(a.Appointment_Date) - new Date(b.Appointment_Date);
      if (sortBy === "name")
        return (a.Patient_id?.Name || "").localeCompare(
          b.Patient_id?.Name || "",
        );
      return 0;
    });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .at-page  { font-family: 'DM Sans', sans-serif; }
        .at-card  { animation: fadeUp 0.45s ease both; }

        .at-appt-row { transition: box-shadow 0.2s ease, transform 0.18s ease; }
        .at-appt-row:hover { box-shadow: 0 8px 28px rgba(16,185,129,0.13); transform: translateY(-1px); }

        .at-pill { transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease; }

        .at-expand-btn { transition: background 0.15s ease; }
        .at-expand-btn:hover { background: #f0fdf4; }

        .at-action-btn { transition: background 0.15s ease, transform 0.12s ease; }
        .at-action-btn:hover { background: #ecfdf5; transform: scale(1.03); }

        .at-confirm-btn { transition: background 0.15s ease; }
        .at-confirm-btn:hover { background: #059669 !important; }

        .at-reject-btn { transition: background 0.15s ease; }
        .at-reject-btn:hover { background: #b91c1c !important; }

        .at-delete-btn { transition: background 0.15s ease, border-color 0.15s ease; }
        .at-delete-btn:hover { background: #fef2f2 !important; border-color: #fca5a5 !important; }

        .at-input:focus { outline: none; box-shadow: 0 0 0 3px rgba(16,185,129,0.2); border-color: #10b981; }
        .at-select:focus { outline: none; box-shadow: 0 0 0 3px rgba(16,185,129,0.2); border-color: #10b981; }
      `}</style>

      <div className="at-page" style={styles.page}>
        <div style={styles.topStrip} />

        <div style={styles.container}>
         
          <div className="at-card" style={styles.header}>
            <div>
              <div style={styles.headerEyebrow}>
                <Stethoscope size={16} style={{ color: "#10b981" }} />
                <span>Doctor Dashboard</span>
              </div>
              <h1 style={styles.title}>Appointments</h1>
              <p style={styles.subtitle}>
                {localAppointments.length} total appointment
                {localAppointments.length !== 1 ? "s" : ""} · {filtered.length}{" "}
                shown
              </p>
            </div>
          </div>

          
          <div
            className="at-card"
            style={{ ...styles.toolbar, animationDelay: "0.06s" }}
          >
            <div style={styles.searchWrap}>
              <Search size={15} style={styles.searchIcon} />
              <input
                className="at-input"
                style={styles.searchInput}
                type="text"
                placeholder="Search by name, condition, status…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <SlidersHorizontal size={15} style={{ color: "#10b981" }} />
              <select
                className="at-select"
                style={styles.select}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="date">Sort: Date</option>
                <option value="name">Sort: Name</option>
              </select>
            </div>

            <div style={styles.countPill}>
              <Zap size={13} style={{ color: "#f59e0b" }} />
              <span>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

        
          <div
            className="at-card"
            style={{ ...styles.pillRow, animationDelay: "0.1s" }}
          >
            {pillOptions.map(({ key, label }) => {
              const count = getPillCount(key);
              const active = selectedStatus === key;
              const m = pillMeta[key];
              return (
                <button
                  key={key}
                  className="at-pill"
                  onClick={() => setSelectedStatus(key)}
                  style={{
                    ...styles.pill,
                    background: active ? m.activeBg : "#fff",
                    color: active ? m.activeColor : "#6b7280",
                    borderColor: active ? m.activeBorder : "#e5e7eb",
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {label}
                  <span
                    style={{
                      ...styles.pillCount,
                      background: active ? m.activeColor : "#e5e7eb",
                      color: active ? "#fff" : "#6b7280",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {loading && (
            <div style={styles.loadingBox}>
              <Loader2
                size={28}
                style={{
                  color: "#10b981",
                  animation: "spin 1s linear infinite",
                }}
              />
              <p
                style={{
                  color: "#6b7280",
                  fontFamily: "'DM Sans', sans-serif",
                  margin: 0,
                }}
              >
                Loading appointments…
              </p>
            </div>
          )}

          
          {error && !loading && (
            <div style={styles.errorBox}>
              <XCircle size={20} style={{ color: "#ef4444" }} />
              <p style={{ color: "#dc2626", margin: 0, fontWeight: 500 }}>
                {typeof error === "string"
                  ? error
                  : "Failed to load appointments"}
              </p>
            </div>
          )}

     
          {!loading && !error && (
            <div style={styles.list}>
              {filtered.map((apt, idx) => {
                const patient = apt.Patient_id;
                const isOpen = expandedId === apt._id;
                const m = getMeta(apt.Status);

                return (
                  <div
                    key={apt._id}
                    className="at-appt-row at-card"
                    style={{
                      ...styles.apptCard,
                      animationDelay: `${0.12 + idx * 0.06}s`,
                      borderLeft: `4px solid ${m.color}`,
                    }}
                  >
                   
                    <div
                      className="at-expand-btn"
                      style={styles.apptRow}
                      onClick={() => setExpandedId(isOpen ? null : apt._id)}
                    >
                      
                      <div style={styles.avatarWrap}>
                        {patient?.Image_url ? (
                          <img
                            src={patient.Image_url}
                            alt={patient?.Name}
                            style={styles.avatarImg}
                          />
                        ) : (
                          <div
                            style={{
                              ...styles.avatarImg,
                              ...styles.avatarFallback,
                            }}
                          >
                            <User size={20} color="#fff" />
                          </div>
                        )}
                      </div>

                    
                      <div style={styles.apptMain}>
                        <div style={styles.apptNameRow}>
                          <span style={styles.apptName}>
                            {patient?.Name ?? "Unknown"}
                          </span>
                          <span style={styles.apptAge}>
                            {patient?.Age ? `${patient.Age} yrs` : ""}
                          </span>
                          <StatusBadge status={apt.Status} />
                        </div>
                        <div style={styles.apptMeta}>
                          <span style={styles.metaItem}>
                            <Calendar size={12} style={{ color: "#10b981" }} />
                            {formatDate(apt.Appointment_Date)}
                          </span>
                          <span style={styles.metaDot}>·</span>
                          <span style={styles.metaItem}>
                            <Clock size={12} style={{ color: "#10b981" }} />
                            {apt.Time_slot ?? "—"}
                          </span>
                          {patient?.PhoneNumber && (
                            <>
                              <span style={styles.metaDot}>·</span>
                              <span style={styles.metaItem}>
                                <Phone size={12} style={{ color: "#10b981" }} />
                                {patient.PhoneNumber}
                              </span>
                            </>
                          )}
                        </div>
                        {apt.Condition && (
                          <p style={styles.conditionText}>
                            <span style={styles.conditionLabel}>
                              Condition:
                            </span>{" "}
                            {apt.Condition}
                          </p>
                        )}
                      </div>

                     
                      <div style={styles.chevron}>
                        {isOpen ? (
                          <ChevronUp size={18} style={{ color: "#10b981" }} />
                        ) : (
                          <ChevronDown size={18} style={{ color: "#9ca3af" }} />
                        )}
                      </div>
                    </div>

                   
                    {isOpen && (
                      <div style={styles.expanded}>
                        <div style={styles.expandedGrid}>
                         
                          <div style={styles.expandSection}>
                            <h4 style={styles.expandHeading}>Patient Info</h4>
                            <div style={styles.detailList}>
                              <DetailRow label="Name" value={patient?.Name} />
                              <DetailRow label="Email" value={patient?.Email} />
                              <DetailRow
                                label="Age"
                                value={
                                  patient?.Age ? `${patient.Age} years` : "—"
                                }
                              />
                              <DetailRow
                                label="Phone"
                                value={patient?.PhoneNumber}
                              />
                            </div>
                          </div>

                          <div style={styles.expandSection}>
                            <h4 style={styles.expandHeading}>
                              Appointment Details
                            </h4>
                            <div style={styles.detailList}>
                              <DetailRow
                                label="Date"
                                value={formatDate(apt.Appointment_Date)}
                              />
                              <DetailRow
                                label="Time Slot"
                                value={apt.Time_slot}
                              />
                              <DetailRow
                                label="Status"
                                value={<StatusBadge status={apt.Status} />}
                              />
                              <DetailRow
                                label="Condition"
                                value={apt.Condition}
                              />
                            </div>
                          </div>

                         
                          <div style={styles.expandSection}>
                            <h4 style={styles.expandHeading}>Quick Actions</h4>
                            <div style={styles.actionBtns}>
                            
                              <button
                                className="at-action-btn"
                                style={styles.actionBtn}
                                onClick={() =>
                                  navigate(`/doctor/patient/${patient?._id}`)
                                }
                              >
                                <Eye size={14} style={{ color: "#10b981" }} />
                                View Profile
                              </button>

                            
                              <button
                                className="at-confirm-btn"
                                style={{
                                  ...styles.confirmBtn,
                                  opacity:
                                    confirmingId === apt._id + "Accepted"
                                      ? 0.7
                                      : 1,
                                  cursor: confirmingId
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                                disabled={!!confirmingId}
                                onClick={() =>
                                  handleStatusUpdate(apt._id, "Accepted")
                                }
                              >
                                {confirmingId === apt._id + "Accepted" ? (
                                  <Loader2
                                    size={14}
                                    style={{
                                      animation: "spin 1s linear infinite",
                                    }}
                                  />
                                ) : (
                                  <CheckCircle size={14} />
                                )}
                                Accept
                              </button>

                             
                              <button
                                className="at-reject-btn"
                                style={{
                                  ...styles.rejectBtn,
                                  opacity:
                                    confirmingId === apt._id + "Rejected"
                                      ? 0.7
                                      : 1,
                                  cursor: confirmingId
                                    ? "not-allowed"
                                    : "pointer",
                                }}
                                disabled={!!confirmingId}
                                onClick={() =>
                                  handleStatusUpdate(apt._id, "Rejected")
                                }
                              >
                                {confirmingId === apt._id + "Rejected" ? (
                                  <Loader2
                                    size={14}
                                    style={{
                                      animation: "spin 1s linear infinite",
                                    }}
                                  />
                                ) : (
                                  <Ban size={14} />
                                )}
                                Reject
                              </button>

                            
                              <button
                                className="at-delete-btn"
                                style={{
                                  ...styles.deleteBtn,
                                  opacity: deletingId === apt._id ? 0.7 : 1,
                                  cursor:
                                    deletingId === apt._id
                                      ? "not-allowed"
                                      : "pointer",
                                }}
                                disabled={deletingId === apt._id}
                                onClick={() => handleDelete(apt._id)}
                              >
                                {deletingId === apt._id ? (
                                  <Loader2
                                    size={14}
                                    style={{
                                      animation: "spin 1s linear infinite",
                                    }}
                                  />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        
          {!loading && !error && filtered.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIconWrap}>
                <Calendar size={32} style={{ color: "#a7f3d0" }} />
              </div>
              <h3 style={styles.emptyTitle}>No appointments found</h3>
              <p style={styles.emptyText}>
                {searchQuery
                  ? `No results for "${searchQuery}"`
                  : "No appointments scheduled yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};


const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(150deg, #f0fdf4 0%, #ffffff 60%, #f0fdf4 100%)",
  },
  topStrip: {
    height: 5,
    background:
      "linear-gradient(90deg,#059669,#10b981,#34d399,#10b981,#059669)",
  },
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: "36px 20px 60px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  header: { paddingBottom: 4 },
  headerEyebrow: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#10b981",
    marginBottom: 6,
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 30,
    fontWeight: 700,
    color: "#064e3b",
    margin: "0 0 4px",
  },
  subtitle: { fontSize: 13, color: "#6b7280", margin: 0 },
  toolbar: {
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
    alignItems: "center",
    background: "#ffffff",
    padding: "14px 18px",
    borderRadius: 16,
    border: "1px solid #d1fae5",
    boxShadow: "0 2px 12px rgba(16,185,129,0.06)",
  },
  searchWrap: { position: "relative", flex: "1 1 200px" },
  searchIcon: {
    position: "absolute",
    left: 12,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
  },
  searchInput: {
    width: "100%",
    paddingLeft: 36,
    paddingRight: 14,
    paddingTop: 9,
    paddingBottom: 9,
    border: "1px solid #d1fae5",
    borderRadius: 12,
    fontSize: 13,
    color: "#064e3b",
    background: "#f9fefb",
    boxSizing: "border-box",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.15s ease",
  },
  select: {
    padding: "9px 14px",
    border: "1px solid #d1fae5",
    borderRadius: 12,
    fontSize: 13,
    color: "#064e3b",
    background: "#f9fefb",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    transition: "border-color 0.15s ease",
  },
  countPill: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 12px",
    background: "#fffbeb",
    border: "1px solid #fde68a",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    color: "#92400e",
    marginLeft: "auto",
  },
  pillRow: { display: "flex", flexWrap: "wrap", gap: 8 },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    border: "1px solid #e5e7eb",
    borderRadius: 999,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  pillCount: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 20,
    height: 20,
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    padding: "0 5px",
  },
  loadingBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    padding: "60px 0",
  },
  errorBox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "16px 20px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: 14,
  },
  list: { display: "flex", flexDirection: "column", gap: 12 },
  apptCard: {
    background: "#ffffff",
    borderRadius: 18,
    border: "1px solid #d1fae5",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(16,185,129,0.05)",
  },
  apptRow: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "18px 20px",
    cursor: "pointer",
  },
  avatarWrap: { flexShrink: 0 },
  avatarImg: {
    width: 48,
    height: 48,
    borderRadius: 14,
    objectFit: "cover",
    border: "2px solid #a7f3d0",
  },
  avatarFallback: {
    background: "linear-gradient(135deg,#059669,#10b981)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  apptMain: { flex: 1, minWidth: 0 },
  apptNameRow: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  apptName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 17,
    fontWeight: 700,
    color: "#064e3b",
  },
  apptAge: { fontSize: 12, color: "#9ca3af", fontWeight: 500 },
  apptMeta: {
    display: "flex",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    color: "#6b7280",
  },
  metaItem: { display: "flex", alignItems: "center", gap: 4 },
  metaDot: { color: "#d1fae5" },
  conditionText: {
    marginTop: 6,
    fontSize: 12,
    color: "#6b7280",
    background: "#f9fefb",
    padding: "4px 10px",
    borderRadius: 8,
    display: "inline-block",
  },
  conditionLabel: { fontWeight: 600, color: "#10b981" },
  chevron: { flexShrink: 0, paddingTop: 2 },
  expanded: {
    background: "#f9fefb",
    borderTop: "1px solid #d1fae5",
    padding: "20px 22px",
  },
  expandedGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
  },
  expandSection: {},
  expandHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 14,
    fontWeight: 700,
    color: "#064e3b",
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: "2px solid #a7f3d0",
  },
  detailList: { display: "flex", flexDirection: "column", gap: 2 },
  actionBtns: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    marginTop: 4,
  },
  actionBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 16px",
    background: "#f9fefb",
    border: "1px solid #d1fae5",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    color: "#064e3b",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  confirmBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 16px",
    background: "#10b981",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    color: "#ffffff",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  rejectBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 16px",
    background: "#ef4444",
    border: "none",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    color: "#ffffff",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  deleteBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "9px 16px",
    background: "#ffffff",
    border: "1.5px solid #fca5a5",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    color: "#dc2626",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "64px 0",
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: "#ecfdf5",
    border: "2px solid #a7f3d0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20,
    fontWeight: 700,
    color: "#064e3b",
    margin: "0 0 6px",
  },
  emptyText: { fontSize: 13, color: "#9ca3af", margin: 0 },
};

export default AppointmentsTab;
