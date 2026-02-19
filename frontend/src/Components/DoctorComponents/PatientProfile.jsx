import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { single_patient } from "../../feature/Doctor/doctor.thunk";

import {
  User,
  Mail,
  Phone,
  Ruler,
  Weight,
  FileText,
  Calendar,
  Loader2,
  Download,
  Activity,
  Heart,
  Leaf,
} from "lucide-react";

const PatientProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { singlePatient, loading, error } = useSelector(
    (state) => state.doctor,
  );

  useEffect(() => {
    dispatch(single_patient(id));
  }, [dispatch, id]);

  if (loading) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={styles.loaderCard}>
          <Loader2
            style={{ ...styles.loaderIcon, animation: "spin 1s linear infinite" }}
          />
          <p style={styles.loaderText}>Loading patient profile…</p>
        </div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.loadingWrapper}>
        <div style={{ ...styles.loaderCard, borderColor: "#fca5a5" }}>
          <p style={{ color: "#dc2626", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
            Failed to load patient profile
          </p>
        </div>
      </div>
    );
  }

  const patient = singlePatient;
  const dosha = patient?.Dosha?.doshaAssessment;

  const infoItems = [
    { icon: <User size={16} />,     label: "Name",   value: patient?.Name },
    { icon: <Mail size={16} />,     label: "Email",  value: patient?.Email },
    { icon: <Calendar size={16} />, label: "Age",    value: patient?.Age    ? `${patient.Age} Years`  : "—" },
    { icon: <User size={16} />,     label: "Gender", value: patient?.Gender },
    { icon: <Ruler size={16} />,    label: "Height", value: patient?.Height ? `${patient.Height} cm` : "—" },
    { icon: <Weight size={16} />,   label: "Weight", value: patient?.Weight ? `${patient.Weight} kg` : "—" },
  ];


  const doshaColors = {
    vata:  { bar: "#818cf8", light: "#eef2ff", text: "#4338ca" },
    pitta: { bar: "#f97316", light: "#fff7ed", text: "#c2410c" },
    kapha: { bar: "#10b981", light: "#ecfdf5", text: "#047857" },
  };

  const DoshaBar = ({ label, value, colors }) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: colors.text, textTransform: "capitalize" }}>
          {label}
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: colors.text }}>{value}%</span>
      </div>
      <div style={{ height: 8, background: "#f1f5f9", borderRadius: 999, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: colors.bar,
            borderRadius: 999,
            transition: "width 0.8s ease",
          }}
        />
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%, 100% { box-shadow: 0 0 0 0 rgba(16,185,129,0.3); }
          50%       { box-shadow: 0 0 0 12px rgba(16,185,129,0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .pp-card { animation: fadeUp 0.5s ease both; }
        .pp-card:nth-child(2) { animation-delay: 0.12s; }
        .pp-card:nth-child(3) { animation-delay: 0.20s; }
        .pp-card:nth-child(4) { animation-delay: 0.28s; }

        .pp-record-row { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .pp-record-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16,185,129,0.12);
        }

        .pp-view-btn { transition: background 0.15s ease, transform 0.12s ease; }
        .pp-view-btn:hover { background: #059669 !important; transform: scale(1.04); }

        .pp-info-chip { transition: background 0.15s ease; }
        .pp-info-chip:hover { background: #ecfdf5 !important; }

        .pp-dosha-chip { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .pp-dosha-chip:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.08); }
      `}</style>

      <div style={styles.page}>
        <div style={styles.topStrip} />

        <div style={styles.container}>

          <div style={styles.pageHeader}>
            <div style={styles.pageTitleGroup}>
              <Heart size={20} style={{ color: "#10b981" }} />
              <span style={styles.pageLabel}>Patient Profile</span>
            </div>
            <h1 style={styles.pageTitle}>{patient?.Name ?? "Patient"}</h1>
          </div>

        
          <div className="pp-card" style={styles.card}>
            <div style={styles.avatarSection}>
              <div style={styles.avatarRing}>
                <div style={styles.avatar}>
                  {patient?.Image_url ? (
                    <img
                      src={patient.Image_url}
                      alt={patient?.Name}
                      style={styles.avatarImg}
                    />
                  ) : (
                    <User size={36} color="#fff" strokeWidth={1.8} />
                  )}
                </div>
              </div>
              <div style={styles.avatarMeta}>
                <p style={styles.avatarName}>{patient?.Name}</p>
                <span style={styles.badge}>{patient?.Gender ?? "Patient"}</span>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.infoGrid}>
              {infoItems.map((item, i) => (
                <div key={i} className="pp-info-chip" style={styles.infoChip}>
                  <div style={styles.infoIcon}>{item.icon}</div>
                  <div>
                    <p style={styles.infoLabel}>{item.label}</p>
                    <p style={styles.infoValue}>{item.value ?? "—"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          
          {dosha && (
            <div className="pp-card" style={{ ...styles.card, animationDelay: "0.12s" }}>
              <div style={styles.sectionHeader}>
                <Leaf size={18} style={{ color: "#10b981" }} />
                <h2 style={styles.sectionTitle}>Dosha Assessment</h2>
                <div style={{ display: "flex", gap: 6 }}>
                  <span style={{
                    ...styles.dominantBadge,
                    background: doshaColors[dosha.dominantPrakriti]?.light,
                    color: doshaColors[dosha.dominantPrakriti]?.text,
                    border: `1px solid ${doshaColors[dosha.dominantPrakriti]?.bar}40`,
                  }}>
                    Prakriti: {dosha.dominantPrakriti?.charAt(0).toUpperCase() + dosha.dominantPrakriti?.slice(1)}
                  </span>
                  <span style={{
                    ...styles.dominantBadge,
                    background: doshaColors[dosha.dominantVikriti]?.light,
                    color: doshaColors[dosha.dominantVikriti]?.text,
                    border: `1px solid ${doshaColors[dosha.dominantVikriti]?.bar}40`,
                  }}>
                    Vikriti: {dosha.dominantVikriti?.charAt(0).toUpperCase() + dosha.dominantVikriti?.slice(1)}
                  </span>
                </div>
              </div>

              <div style={styles.doshaGrid}>

              
                <div className="pp-dosha-chip" style={styles.doshaBox}>
                  <p style={styles.doshaBoxTitle}>Prakriti <span style={styles.doshaBoxSub}>(Constitution)</span></p>
                  <div style={styles.divider} />
                  {Object.entries(dosha.prakriti).map(([key, val]) => (
                    <DoshaBar key={key} label={key} value={val} colors={doshaColors[key]} />
                  ))}
                </div>

              
                <div className="pp-dosha-chip" style={styles.doshaBox}>
                  <p style={styles.doshaBoxTitle}>Vikriti <span style={styles.doshaBoxSub}>(Current State)</span></p>
                  <div style={styles.divider} />
                  {Object.entries(dosha.vikriti).map(([key, val]) => (
                    <DoshaBar key={key} label={key} value={val} colors={doshaColors[key]} />
                  ))}
                </div>

              </div>
            </div>
          )}

          <div className="pp-card" style={{ ...styles.card, animationDelay: "0.20s" }}>
            <div style={styles.sectionHeader}>
              <Activity size={18} style={{ color: "#10b981" }} />
              <h2 style={styles.sectionTitle}>Medical Records</h2>
              {patient?.Medical_records?.length > 0 && (
                <span style={styles.recordCount}>
                  {patient.Medical_records.length}
                </span>
              )}
            </div>

            {!patient?.Medical_records?.length ? (
              <div style={styles.emptyState}>
                <FileText size={40} style={{ color: "#d1fae5", marginBottom: 12 }} />
                <p style={styles.emptyText}>No records available</p>
              </div>
            ) : (
              <div style={styles.recordList}>
                {patient.Medical_records.map((record, idx) => (
                  <div
                    key={record._id}
                    className="pp-record-row"
                    style={{
                      ...styles.recordRow,
                      animation: "fadeUp 0.4s ease both",
                      animationDelay: `${0.08 * idx}s`,
                    }}
                  >
                    <div style={styles.recordLeft}>
                      <div style={styles.recordIconWrap}>
                        <FileText size={18} color="#10b981" />
                      </div>
                      <div>
                        <p style={styles.recordTitle}>{record.Title}</p>
                        <p style={styles.recordCategory}>{record.Category}</p>
                        <p style={styles.recordDate}>
                          {new Date(record.Report_date).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>

                    <a
                      href={record.File_url}
                      target="_blank"
                      rel="noreferrer"
                      className="pp-view-btn"
                      style={styles.viewBtn}
                    >
                      <Download size={14} />
                      View
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
};


const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #f0fdf4 0%, #ffffff 50%, #f0fdf4 100%)",
    fontFamily: "'DM Sans', sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  topStrip: {
    height: 6,
    background: "linear-gradient(90deg, #059669, #10b981, #34d399, #10b981, #059669)",
    backgroundSize: "200% 100%",
  },
  container: {
    maxWidth: 780,
    margin: "0 auto",
    padding: "40px 20px 60px",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  pageHeader: { marginBottom: 4 },
  pageTitleGroup: { display: "flex", alignItems: "center", gap: 6, marginBottom: 6 },
  pageLabel: {
    fontSize: 12, fontWeight: 600, letterSpacing: "0.12em",
    textTransform: "uppercase", color: "#10b981",
  },
  pageTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 32, fontWeight: 700, color: "#064e3b", margin: 0, lineHeight: 1.15,
  },
  card: {
    background: "#ffffff", borderRadius: 20, padding: "28px 32px",
    border: "1px solid #d1fae5",
    boxShadow: "0 4px 24px rgba(16,185,129,0.07), 0 1px 4px rgba(0,0,0,0.04)",
  },
  avatarSection: { display: "flex", alignItems: "center", gap: 20, marginBottom: 24 },
  avatarRing: {
    padding: 3, borderRadius: "50%",
    background: "linear-gradient(135deg, #10b981, #059669)",
    animation: "pulseRing 2.8s ease infinite", flexShrink: 0,
  },
  avatar: {
    width: 76, height: 76, borderRadius: "50%", overflow: "hidden",
    background: "linear-gradient(135deg, #059669, #10b981)",
    display: "flex", alignItems: "center", justifyContent: "center",
    border: "3px solid #fff",
  },
  avatarImg: { width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" },
  avatarMeta: { display: "flex", flexDirection: "column", gap: 6 },
  avatarName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22, fontWeight: 700, color: "#064e3b", margin: 0,
  },
  badge: {
    display: "inline-block", padding: "3px 12px",
    background: "#ecfdf5", color: "#059669", borderRadius: 999,
    fontSize: 12, fontWeight: 600, letterSpacing: "0.04em",
    border: "1px solid #a7f3d0", width: "fit-content",
  },
  divider: {
    height: 1,
    background: "linear-gradient(90deg, transparent, #a7f3d0, transparent)",
    marginBottom: 24,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 12,
  },
  infoChip: {
    display: "flex", alignItems: "center", gap: 12,
    padding: "12px 16px", borderRadius: 12,
    background: "#f9fefb", border: "1px solid #d1fae5", cursor: "default",
  },
  infoIcon: {
    width: 34, height: 34, borderRadius: 10, background: "#ecfdf5",
    display: "flex", alignItems: "center", justifyContent: "center",
    color: "#10b981", flexShrink: 0,
  },
  infoLabel: {
    fontSize: 10, fontWeight: 600, textTransform: "uppercase",
    letterSpacing: "0.08em", color: "#6ee7b7", margin: "0 0 2px",
  },
  infoValue: { fontSize: 14, fontWeight: 500, color: "#064e3b", margin: 0 },

  /* ── Dosha ── */
  sectionHeader: { display: "flex", alignItems: "center", gap: 8, marginBottom: 20, flexWrap: "wrap" },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 20, fontWeight: 700, color: "#064e3b", margin: 0, flex: 1,
  },
  dominantBadge: {
    display: "inline-flex", alignItems: "center",
    padding: "3px 10px", borderRadius: 999,
    fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
  },
  doshaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
  },
  doshaBox: {
    padding: "18px 20px",
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    background: "#fafffe",
  },
  doshaBoxTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 15, fontWeight: 700, color: "#064e3b",
    margin: "0 0 12px",
  },
  doshaBoxSub: {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 11, fontWeight: 400, color: "#9ca3af",
  },

  /* ── Records ── */
  recordCount: {
    padding: "2px 10px", background: "#ecfdf5", color: "#059669",
    borderRadius: 999, fontSize: 12, fontWeight: 700, border: "1px solid #a7f3d0",
  },
  recordList: { display: "flex", flexDirection: "column", gap: 12 },
  recordRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "14px 18px", borderRadius: 14,
    border: "1px solid #d1fae5", background: "#fafffe", gap: 12,
  },
  recordLeft: { display: "flex", alignItems: "center", gap: 14 },
  recordIconWrap: {
    width: 40, height: 40, borderRadius: 10,
    background: "linear-gradient(135deg, #ecfdf5, #d1fae5)",
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0, border: "1px solid #a7f3d0",
  },
  recordTitle: { fontSize: 14, fontWeight: 600, color: "#064e3b", margin: "0 0 2px" },
  recordCategory: { fontSize: 12, color: "#6ee7b7", fontWeight: 500, margin: "0 0 2px" },
  recordDate: { fontSize: 11, color: "#9ca3af", margin: 0, fontWeight: 400 },
  viewBtn: {
    display: "flex", alignItems: "center", gap: 6,
    padding: "8px 16px", background: "#10b981", color: "#fff",
    borderRadius: 10, fontSize: 13, fontWeight: 600,
    textDecoration: "none", whiteSpace: "nowrap", flexShrink: 0,
    letterSpacing: "0.02em",
  },
  emptyState: {
    display: "flex", flexDirection: "column", alignItems: "center",
    padding: "40px 0 20px",
  },
  emptyText: { color: "#a7f3d0", fontSize: 14, fontWeight: 500 },
  loadingWrapper: {
    minHeight: "100vh", display: "flex", alignItems: "center",
    justifyContent: "center", background: "#f0fdf4",
  },
  loaderCard: {
    background: "#fff", borderRadius: 20, padding: "40px 60px",
    border: "1px solid #d1fae5",
    boxShadow: "0 4px 24px rgba(16,185,129,0.1)",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 14,
  },
  loaderIcon: { width: 36, height: 36, color: "#10b981" },
  loaderText: {
    color: "#059669", fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500, fontSize: 14, margin: 0,
  },
};

export default PatientProfile;