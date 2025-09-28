import React, { useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

export default function ReportsTab() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [activeTab, setActiveTab] = useState('overview');

  const patientGrowthDataSets = {
    weekly: [
      { week: "W1", new: 12, returning: 30 },
      { week: "W2", new: 15, returning: 28 },
      { week: "W3", new: 20, returning: 32 },
      { week: "W4", new: 18, returning: 27 },
    ],
    monthly: [
      { month: 'Jan', new: 45, returning: 120 },
      { month: 'Feb', new: 52, returning: 135 },
      { month: 'Mar', new: 48, returning: 142 },
      { month: 'Apr', new: 65, returning: 158 },
      { month: 'May', new: 72, returning: 165 },
      { month: 'Jun', new: 68, returning: 172 },
    ],
    quarterly: [
      { quarter: "Q1", new: 145, returning: 397 },
      { quarter: "Q2", new: 205, returning: 495 },
    ],
    yearly: [
      { year: "2023", new: 720, returning: 1890 },
      { year: "2024", new: 845, returning: 2040 },
    ],
  };




  const treatmentSuccessData = [
    { therapy: 'Panchakarma', success: 92, patients: 45 },
    { therapy: 'Herbal Medicine', success: 85, patients: 120 },
    { therapy: 'Yoga Therapy', success: 78, patients: 89 },
    { therapy: 'Diet Planning', success: 88, patients: 156 },
    { therapy: 'Lifestyle', success: 82, patients: 134 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 125000, expenses: 85000 },
    { month: 'Feb', revenue: 138000, expenses: 92000 },
    { month: 'Mar', revenue: 145000, expenses: 88000 },
    { month: 'Apr', revenue: 162000, expenses: 95000 },
    { month: 'May', revenue: 158000, expenses: 91000 },
    { month: 'Jun', revenue: 172000, expenses: 98000 },
  ];

  const keyMetrics = [
    { title: 'Total Patients', value: '1,247', change: '+12%', trend: 'up' },
    { title: 'Success Rate', value: '86%', change: '+5%', trend: 'up' },
    { title: 'Avg. Session Time', value: '45min', change: '-2%', trend: 'down' },
    { title: 'Revenue', value: '₹9.2L', change: '+18%', trend: 'up' },
  ];

  const recentActivities = [
    { patient: 'Rajesh Kumar', action: 'Completed Panchakarma', time: '2 hours ago', status: 'completed' },
    { patient: 'Priya Sharma', action: 'New Consultation', time: '4 hours ago', status: 'new' },
    { patient: 'Amit Patel', action: 'Follow-up Scheduled', time: '1 day ago', status: 'scheduled' },
    { patient: 'Sneha Reddy', action: 'Treatment Plan Updated', time: '2 days ago', status: 'updated' },
  ];

  const COLORS = ['#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#3B82F6'];
  const patientData = patientGrowthDataSets[timeRange];


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Reports & Analytics</h1>
              <p className="text-slate-600 mt-2">Comprehensive insights into patient progress and clinic performance</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors flex items-center gap-2">
                📊 Export Report
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {keyMetrics.map((metric, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-slate-600 font-medium">{metric.title}</h3>
                  <span className={`text-sm font-medium ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {metric.change}
                  </span>
                </div>
                <p className="text-3xl font-bold text-slate-800 mb-2">{metric.value}</p>
                <div className={`w-full h-2 rounded-full ${metric.trend === 'up' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                  <div
                    className={`h-2 rounded-full ${metric.trend === 'up' ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    style={{ width: metric.trend === 'up' ? '75%' : '60%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6">
          <div className="flex overflow-x-auto">
            {['overview', 'patients', 'treatments', 'financial', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium whitespace-nowrap transition-colors ${activeTab === tab
                  ? 'text-amber-600 border-b-2 border-amber-500'
                  : 'text-slate-600 hover:text-slate-800'
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

          {/* Patient Growth Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Patient Growth</h3>
              <span className="text-sm text-slate-500">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patientData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey={
                    timeRange === "weekly"
                      ? "week"
                      : timeRange === "quarterly"
                        ? "quarter"
                        : timeRange === "yearly"
                          ? "year"
                          : "month"
                  }
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new" fill="#3B82F6" name="New Patients" radius={[4, 4, 0, 0]} />
                <Bar dataKey="returning" fill="#10B981" name="Returning Patients" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>


          </div>



          {/* Treatment Success Rate */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Treatment Success Rates</h3>
              <span className="text-sm text-slate-500">Based on patient feedback</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={treatmentSuccessData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="therapy" width={120} />
                <Tooltip formatter={(value) => [`${value}%`, 'Success Rate']} />
                <Legend />
                <Bar dataKey="success" fill="#8B5CF6" name="Success Rate" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-slate-800">Revenue & Expenses</h3>
              <span className="text-sm text-slate-500">Monthly comparison</span>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981' }} />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'new' ? 'bg-blue-500' :
                      activity.status === 'scheduled' ? 'bg-amber-500' : 'bg-purple-500'
                    }`}></div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{activity.patient}</p>
                    <p className="text-slate-600 text-sm">{activity.action}</p>
                  </div>
                  <span className="text-slate-500 text-sm">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-blue-700 font-medium">Active Treatments</span>
                <span className="text-blue-700 font-bold">89</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-green-700 font-medium">Pending Follow-ups</span>
                <span className="text-green-700 font-bold">23</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="text-amber-700 font-medium">New Messages</span>
                <span className="text-amber-700 font-bold">12</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-purple-700 font-medium">Upcoming Appointments</span>
                <span className="text-purple-700 font-bold">17</span>
              </div>
            </div>
          </div>
        </div>

        {/* Report Actions */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-xl font-bold mb-2">Generate Detailed Report</h3>
              <p className="text-amber-100">Create comprehensive reports for analysis and presentation</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-white text-amber-600 px-6 py-2 rounded-lg font-medium hover:bg-amber-50 transition-colors">
                📈 Generate PDF
              </button>
              <button className="bg-amber-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-900 transition-colors">
                📊 Custom Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}