// src/components/DietaryTracker.jsx
import React from 'react';
import Card from './Card';
import { FaUtensils } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer, CartesianGrid } from 'recharts';

const DietaryTracker = ({ analysis }) => {
  const GUNA_COLORS = ['#8884d8', '#82ca9d'];
  const RASA_COLORS = ['#8884d8', '#82ca9d'];


  const CustomBarTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800 mb-2">{payload[0].payload.name}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.fill }}>
              {entry.name}: <span className="font-bold">{entry.value}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-800">
            {payload[0].name}: <span className="text-green-600">{payload[0].value}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card title="Dietary Analysis" icon={FaUtensils}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
       
        <div>
          <h4 className="font-semibold text-gray-700 text-center mb-3 sm:mb-4 text-sm sm:text-base">
            Rasa (Six Tastes)
          </h4>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[280px]">
            <BarChart 
              data={analysis.rasa} 
              layout="vertical" 
              margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
              <XAxis 
                type="number" 
                tick={{ fill: '#6b7280', fontSize: 11 }}
                className="text-xs sm:text-sm"
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={70}
                tick={{ fill: '#4b5563', fontSize: 11 }}
                className="text-xs sm:text-sm"
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
              <Bar 
                dataKey="actual" 
                name="Actual" 
                fill="#8884d8" 
                radius={[0, 4, 4, 0]}
                animationDuration={800}
              />
              <Bar 
                dataKey="prescribed" 
                name="Prescribed" 
                fill="#82ca9d"
                radius={[0, 4, 4, 0]}
                animationDuration={800}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

       
        <div>
          <h4 className="font-semibold text-gray-700 text-center mb-3 sm:mb-4 text-sm sm:text-base">
            Guna (Qualities)
          </h4>
          <ResponsiveContainer width="100%" height={250} className="sm:h-[280px]">
            <PieChart>
              <Pie 
                data={analysis.guna} 
                dataKey="value" 
                nameKey="name" 
                cx="50%" 
                cy="50%" 
                outerRadius="75%"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                animationDuration={800}
              >
                {analysis.guna.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={GUNA_COLORS[index % GUNA_COLORS.length]}
                    stroke="#fff"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

   
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-center">
            <p className="text-xs text-gray-600 mb-1">Total Tastes</p>
            <p className="text-lg sm:text-xl font-bold text-blue-600">{analysis.rasa.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3 border border-green-100 text-center">
            <p className="text-xs text-gray-600 mb-1">Qualities</p>
            <p className="text-lg sm:text-xl font-bold text-green-600">{analysis.guna.length}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100 text-center col-span-2 sm:col-span-1">
            <p className="text-xs text-gray-600 mb-1">Balance Score</p>
            <p className="text-lg sm:text-xl font-bold text-purple-600">85%</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DietaryTracker;