import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, Activity } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { ALLAppointmentCount } from "../../feature/Doctor/doctor.thunk";

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#ffffff",
      border: "1px solid #e0f2fe",
      borderRadius: "12px",
      padding: "10px 14px",
      boxShadow: "0 8px 24px rgba(6,182,212,0.13)",
      minWidth: "140px",
    }}>
      <p style={{
        color: "#94a3b8", fontSize: "10px", fontWeight: 700,
        letterSpacing: "0.1em", textTransform: "uppercase",
        margin: "0 0 8px 0",
      }}>{label}</p>
      {payload.map((entry, i) => (
        <div key={i} style={{
          display: "flex", alignItems: "center", gap: "8px",
          marginBottom: i < payload.length - 1 ? "6px" : 0,
        }}>
          <span style={{
            width: 9, height: 9, borderRadius: "3px", flexShrink: 0,
            background: entry.dataKey === "totalAppointments" ? "#0d9488" : "#7c3aed",
          }} />
          <span style={{ color: "#64748b", fontSize: "12px", flex: 1 }}>
            {entry.dataKey === "totalAppointments" ? "Appointments" : "Patients"}
          </span>
          <span style={{ color: "#0f172a", fontSize: "13px", fontWeight: 700 }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

// ─── Stat Card ─────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, gradFrom, gradTo }) => (
  <div style={{
    background: "#ffffff",
    border: "1px solid #f1f5f9",
    borderRadius: "16px",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flex: "1 1 140px",   // flex-grow + basis so 3 cards wrap properly
    minWidth: "0",        // allow shrink on mobile
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  }}>
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0, height: "3px",
      background: `linear-gradient(90deg, ${gradFrom}, ${gradTo})`,
      borderRadius: "16px 16px 0 0",
    }} />
    <div style={{
      width: 38, height: 38, borderRadius: "11px", flexShrink: 0,
      background: `${gradFrom}1a`,
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <Icon size={17} color={gradFrom} strokeWidth={2.2} />
    </div>
    <div style={{ minWidth: 0 }}>
      <p style={{
        color: "#94a3b8", fontSize: "10px", fontWeight: 700,
        letterSpacing: "0.07em", textTransform: "uppercase",
        margin: "0 0 2px 0", whiteSpace: "nowrap",
        overflow: "hidden", textOverflow: "ellipsis",
      }}>{label}</p>
      <p style={{
        color: "#0f172a", fontSize: "22px", fontWeight: 900,
        lineHeight: 1, margin: 0,
      }}>{value}</p>
    </div>
  </div>
);

// ─── Legend ────────────────────────────────────────────────────────────────────
const ChartLegend = () => (
  <div style={{
    display: "flex", justifyContent: "center",
    gap: "20px", marginTop: "14px", flexWrap: "wrap",
  }}>
    {[
      { from: "#0d9488", to: "#06b6d4", label: "Appointments" },
      { from: "#7c3aed", to: "#a78bfa", label: "Patients" },
    ].map(({ from, to, label }) => (
      <div key={label} style={{ display: "flex", alignItems: "center", gap: "7px" }}>
        <span style={{
          width: 24, height: 9, borderRadius: "5px", display: "inline-block",
          background: `linear-gradient(90deg, ${from}, ${to})`,
        }} />
        <span style={{ color: "#64748b", fontSize: "13px", fontWeight: 600 }}>
          {label}
        </span>
      </div>
    ))}
  </div>
);

// SVG chevron extracted to avoid Vite JSX parse issues with < inside strings
const CHEVRON_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='11' fill='%230d9488' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E\")";

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function AppointmentChart() {
  const dispatch = useDispatch();
  const { Appointment_count } = useSelector((state) => state.doctor);

  useEffect(() => {
    dispatch(ALLAppointmentCount());
  }, []);

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const availableYears = useMemo(() => {
    const years = [...new Set(Appointment_count.map((item) => item.year))].sort((a, b) => b - a);
    return years.length ? years : [new Date().getFullYear()];
  }, [Appointment_count]);

  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    if (availableYears.length && !selectedYear) setSelectedYear(availableYears[0]);
  }, [availableYears]);

  const filteredData = useMemo(
    () => Appointment_count.filter((item) => item.year === selectedYear),
    [Appointment_count, selectedYear]
  );

  const filledData = useMemo(
    () => MONTHS.map((month) => {
      const found = filteredData.find((item) => item.month === month);
      return {
        month,
        totalAppointments: found ? found.totalAppointments : 0,
        patients: found
          ? (found.uniquePatients !== undefined ? found.uniquePatients : Math.round(found.totalAppointments * 0.7))
          : 0,
      };
    }),
    [filteredData, selectedYear]
  );

  const totalAppointments = filteredData.reduce((acc, curr) => acc + curr.totalAppointments, 0);

  const peakMonth = filledData.reduce(
    (max, m) => (m.totalAppointments > max.totalAppointments ? m : max), filledData[0]
  );

  // ── Empty State ──
  if (!Appointment_count?.length) {
    return (
      <div style={{
        background: "#fff", borderRadius: "20px", padding: "48px",
        textAlign: "center", border: "1px solid #f1f5f9",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: "16px",
          background: "linear-gradient(135deg,#0d9488,#06b6d4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 16px",
          boxShadow: "0 6px 20px rgba(6,182,212,0.3)",
        }}>
          <Calendar size={26} color="#fff" />
        </div>
        <h2 style={{ color: "#0f172a", fontSize: "17px", fontWeight: 700, margin: "0 0 6px" }}>
          No Appointment Analytics
        </h2>
        <p style={{ color: "#94a3b8", margin: 0 }}>No appointments available yet</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      style={{
        background: "#ffffff",
        borderRadius: "22px",
        padding: "20px",
        border: "1px solid #f1f5f9",
        boxShadow: "0 4px 24px rgba(13,148,136,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        width: "100%",
        boxSizing: "border-box",
        fontFamily: "inherit",
      }}
    >
      {/* ── Header: icon + title + year selector ── */}
      <div style={{ marginBottom: "16px" }}>
        {/* Row 1: icon + title LEFT, year pill RIGHT */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px",
        }}>
          {/* icon */}
          <div style={{
            width: 38, height: 38, borderRadius: "11px", flexShrink: 0,
            background: "linear-gradient(135deg, #0d9488, #06b6d4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(6,182,212,0.28)",
          }}>
            <Activity size={18} color="#fff" strokeWidth={2.3} />
          </div>

          {/* title — shrinks but never hides */}
          <div style={{ flex: 1, minWidth: 0, marginLeft: "10px" }}>
            <h2 style={{
              color: "#0f172a", fontSize: "15px", fontWeight: 800, margin: 0,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              Monthly Appointments
            </h2>
            <p style={{
              color: "#94a3b8", fontSize: "11px", margin: "2px 0 0",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              Patient appointment analytics
            </p>
          </div>

          {/* year pill — always on same row, never hidden */}
          <select
            value={selectedYear ?? ""}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            style={{
              flexShrink: 0,
              background: "#f0fdfa",
              border: "1.5px solid #5eead4",
              borderRadius: "10px",
              padding: "5px 24px 5px 10px",
              color: "#0d9488",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              outline: "none",
              appearance: "none",
              WebkitAppearance: "none",
              backgroundImage: CHEVRON_SVG,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 7px center",
              minWidth: "64px",
            }}
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Stat Cards: all 3 in a row on desktop, wrap to 2+1 on mobile ── */}
      <div style={{
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        flexWrap: "wrap",   // wraps to 2+1 on very small screens
      }}>
        <StatCard
          icon={Calendar}
          label="Appointments"
          value={totalAppointments}
          gradFrom="#0d9488" gradTo="#06b6d4"
        />
        <StatCard
          icon={TrendingUp}
          label="Peak Month"
          value={peakMonth?.month ?? "—"}
          gradFrom="#f59e0b" gradTo="#fbbf24"
        />
      </div>

      {/* ── Chart — taller bars via bigger maxBarSize + smaller gap ── */}
      <div style={{ width: "100%", height: "240px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filledData}
            barCategoryGap="25%"
            barGap={3}
            margin={{ top: 6, right: 2, left: -26, bottom: 0 }}
          >
            <defs>
              <linearGradient id="barTeal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#0d9488" />
              </linearGradient>
              <linearGradient id="barViolet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#c4b5fd" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 4" vertical={false} stroke="#f3f4f6" />

            <XAxis
              dataKey="month"
              tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
              axisLine={false} tickLine={false}
              interval={0}         // show every month label
            />
            <YAxis
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false} tickLine={false}
              allowDecimals={false}
              width={30}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(6,182,212,0.05)", radius: 6 }}
            />

            <Bar
              dataKey="totalAppointments"
              name="totalAppointments"
              fill="url(#barTeal)"
              radius={[6, 6, 0, 0]}
              animationDuration={1000}
              maxBarSize={22}      // wider bars = more visible on mobile
            />
            <Bar
              dataKey="patients"
              name="patients"
              fill="url(#barViolet)"
              radius={[6, 6, 0, 0]}
              animationDuration={1000}
              animationBegin={150}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Legend ── */}
      <ChartLegend />
    </motion.div>
  );
}