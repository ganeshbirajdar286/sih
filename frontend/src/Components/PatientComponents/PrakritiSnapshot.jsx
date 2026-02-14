// src/components/PrakritiSnapshot.jsx

import React, { useEffect } from "react";
import Card from "./Card";
import { FaBalanceScale } from "react-icons/fa";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  Legend,
  Radar,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import { getDosha } from "../../feature/Patient/patient.thunk";

const PrakritiSnapshot = () => {
  const { dosha, loading } = useSelector(
    (state) => state.patient
  );

  const dispatch =useDispatch();

 
useEffect(() => {
  dispatch(getDosha());
}, [dispatch]);
  const prakriti = dosha?.prakriti;
  const vikriti = dosha?.vikriti;


  if (loading) {
    return (
      <Card title="Dosha Balance" icon={FaBalanceScale}>
        <p className="text-center py-10 text-gray-500">
          Loading Dosha Data...
        </p>
      </Card>
    );
  }

  if (!prakriti || !vikriti) {
    return (
      <Card title="Dosha Balance" icon={FaBalanceScale}>
        <p className="text-center py-10 text-gray-500">
          No Dosha Data Found
        </p>
      </Card>
    );
  }

  const data = [
    {
      subject: "Vata",
      A: prakriti.vata,
      B: vikriti.vata,
      fullMark: 100,
    },
    {
      subject: "Pitta",
      A: prakriti.pitta,
      B: vikriti.pitta,
      fullMark: 100,
    },
    {
      subject: "Kapha",
      A: prakriti.kapha,
      B: vikriti.kapha,
      fullMark: 100,
    },
  ];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-1">
            {payload[0].payload.subject}
          </p>

          {payload.map((entry, index) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}:{" "}
              <span className="font-bold">
                {entry.value}%
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Dosha Balance" icon={FaBalanceScale}>
      <div className="w-full">
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart
            cx="50%"
            cy="50%"
            outerRadius="70%"
            data={data}
          >
            <PolarGrid stroke="#e5e7eb" />

            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fill: "#4b5563",
                fontSize: 12,
              }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Legend
              wrapperStyle={{
                fontSize: "12px",
                paddingTop: "10px",
              }}
              iconType="circle"
            />

            <Radar
              name="Prakriti (Constitution)"
              dataKey="A"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
              strokeWidth={2}
            />

   
            <Radar
              name="Vikriti (Imbalance)"
              dataKey="B"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      
      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-3 gap-2 sm:gap-3">
        {data.map((dosha, index) => (
          <div
            key={index}
            className="text-center"
          >
            <p className="text-xs sm:text-sm text-gray-500 mb-1">
              {dosha.subject}
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-1">
              <span className="text-sm sm:text-base font-bold text-blue-600">
                {dosha.A}%
              </span>

              <span className="hidden sm:inline text-gray-400">
                /
              </span>

              <span className="text-sm sm:text-base font-bold text-green-600">
                {dosha.B}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PrakritiSnapshot;
