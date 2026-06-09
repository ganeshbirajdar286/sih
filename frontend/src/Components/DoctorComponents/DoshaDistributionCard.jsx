
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Leaf } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const DOSHA_CONFIG = {
  vata:  { color: "#10b981", label: "Vata" },
  pitta: { color: "#f97316", label: "Pitta" },
  kapha: { color: "#3b82f6", label: "Kapha" },
};

export default function DoshaDistributionCard() {
  const raw = useSelector((state) => state.doctor.AllPatientsDosha);

  const distribution = useMemo(() => {
    const counts = { vata: 0, pitta: 0, kapha: 0 };
    (raw || []).forEach(({ dosha }) => {
      const key = dosha?.toLowerCase();
      if (key in counts) counts[key]++;
    });
    const total = Object.values(counts).reduce((s, n) => s + n, 0) || 1;
    return Object.entries(counts).map(([key, patients]) => ({
      key,
      label: DOSHA_CONFIG[key].label,
      color: DOSHA_CONFIG[key].color,
      patients,
      percentage: Math.round((patients / total) * 100),
    }));
  }, [raw]);

  const total = (raw || []).length;

  return (
    <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">Dosha distribution</h3>
        <Leaf className="w-4 h-4 text-orange-500" />
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Pie chart */}
        <div className="relative w-32 h-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                dataKey="patients"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius="55%"
                outerRadius="80%"
                paddingAngle={2}
                strokeWidth={2}
                stroke="#fff"
              >
                {distribution.map((d) => (
                  <Cell key={d.key} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} patients`, name]}
                contentStyle={{ fontSize: 12, borderRadius: 8 }}
              />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold text-gray-900">{total}</span>
            <span className="text-[10px] text-gray-400">patients</span>
          </div>
        </div>

       
        <div className="flex-1 w-full space-y-1">
          {distribution.map((d) => (
            <div
              key={d.key}
              className="flex items-center justify-between px-2 py-1.5 hover:bg-orange-50 rounded-lg transition-colors duration-150"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: d.color }}
                />
                <span className="text-sm font-medium text-gray-900">{d.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">{d.patients} patients</span>
                <div className="w-20 bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${d.percentage}%`, background: d.color }}
                  />
                </div>
                <span className="text-xs font-semibold text-gray-800 w-7 text-right">
                  {d.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}