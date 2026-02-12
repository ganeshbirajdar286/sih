// src/components/WeightTrend.jsx
import React from 'react';
import Card from './Card';
import { FaChartLine } from 'react-icons/fa';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';

const WeightTrend = ({ data }) => {
  // Custom Tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">{payload[0].payload.date}</p>
          <p className="text-base font-bold text-green-600">
            {payload[0].value} kg
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate stats
  const weights = data.map(d => d.weight);
  const currentWeight = weights[weights.length - 1];
  const startWeight = weights[0];
  const change = (currentWeight - startWeight).toFixed(1);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);

  return (
    <Card title="Weight Trend" icon={FaChartLine}>
      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-3 border border-green-100">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Current</p>
          <p className="text-lg sm:text-xl font-bold text-green-600">{currentWeight} kg</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Change</p>
          <p className={`text-lg sm:text-xl font-bold ${change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
            {change >= 0 ? '+' : ''}{change} kg
          </p>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Min</p>
          <p className="text-lg sm:text-xl font-bold text-purple-600">{minWeight} kg</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Max</p>
          <p className="text-lg sm:text-xl font-bold text-orange-600">{maxWeight} kg</p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={250} className="sm:h-[280px] md:h-[300px]">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickMargin={8}
            className="sm:text-xs md:text-sm"
          />
          <YAxis 
            tick={{ fill: '#6b7280', fontSize: 11 }}
            tickMargin={8}
            className="sm:text-xs md:text-sm"
          />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="weight" 
            stroke="#34d399" 
            strokeWidth={3}
            fill="url(#colorWeight)"
            name="Weight (kg)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default WeightTrend;