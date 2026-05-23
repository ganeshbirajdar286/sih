import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";

import { useSelector, useDispatch } from "react-redux";

import { motion } from "framer-motion";

import { TrendingUp } from "lucide-react";

import { useEffect, useState, useMemo } from "react";

import { AppointmentCount as AppointmentCountThunk } from "../../feature/Doctor/doctor.thunk";

export default function AppointmentChart() {
  const dispatch = useDispatch();

  const { Appointment_count } = useSelector((state) => state.doctor);

 
useEffect(() => {
  if (Appointment_count.length === 0) {
    dispatch(AppointmentCountThunk());
  }
}, []);

  const availableYears = useMemo(() => {
    const years = [...new Set(Appointment_count.map((item) => item.year))].sort(
      (a, b) => b - a,
    );

    return years.length ? years : [new Date().getFullYear()];
  }, [Appointment_count]);

  const [selectedYear, setSelectedYear] = useState(null);

 
  useEffect(() => {
    if (availableYears.length && !selectedYear) {
      setSelectedYear(availableYears[0]);
    }
  }, [availableYears]);


  const filteredData = useMemo(() => {
    return Appointment_count.filter((item) => item.year === selectedYear);
  }, [Appointment_count, selectedYear]);


  const totalAppointments = filteredData.reduce(
    (acc, curr) => acc + curr.totalAppointments,
    0,
  );

  const colors = [
    "#10b981",
    "#059669",
    "#047857",
    "#34d399",
    "#6ee7b7",
    "#10b981",
    "#059669",
    "#047857",
    "#34d399",
    "#6ee7b7",
    "#10b981",
    "#059669",
  ];

  // EMPTY STATE
  if (!Appointment_count?.length) {
    return (
      <div className="bg-white rounded-2xl p-10 shadow-md border border-emerald-100 text-center">
        <h2 className="text-xl font-semibold text-gray-700">
          No Appointment Analytics
        </h2>

        <p className="text-gray-500 mt-2">No appointments available yet</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="bg-white rounded-2xl p-5 shadow-md border border-emerald-100"
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Monthly Appointments
          </h2>

          <p className="text-sm text-gray-500">Patient appointment analytics</p>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex flex-col items-end gap-2">
          {/* YEAR SELECT */}
          <select
            value={selectedYear ?? ""}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="
              text-sm
              border
              border-gray-200
              rounded-lg
              px-3
              py-1.5
              bg-gray-50
              text-gray-700
              cursor-pointer
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-400
            "
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* TOTAL */}
          <div className="flex items-center gap-2">
            <TrendingUp
              className="
                w-5
                h-5
                text-emerald-600
              "
            />

            <h2
              className="
              text-3xl
              font-bold
              text-emerald-600
            "
            >
              {totalAppointments}
            </h2>
          </div>

          <p
            className="
            text-xs
            text-gray-500
          "
          >
            Total Appointments
          </p>
        </div>
      </div>

      {/* CHART */}
      <div
        className="
        w-full
        min-h-[320px]
        h-[320px]
      "
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            barCategoryGap="40%"
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey={(data) => `${data.month}`}
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fill: "#6b7280",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                fill: "rgba(16,185,129,0.08)",
              }}
              contentStyle={{
                borderRadius: "12px",
                border: "none",

                boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              }}
            />
            <Bar
              dataKey="totalAppointments"
              radius={[12, 12, 0, 0]}
              animationDuration={1500}
              maxBarSize={80}
            >
              {filteredData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
