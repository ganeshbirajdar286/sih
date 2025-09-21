import { useState } from 'react';

const AyurvedicDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample data
  const stats = [
    { label: 'Total Patients', value: 142, icon: 'user-injured', color: 'green' },
    { label: 'Diet Charts', value: 89, icon: 'utensils', color: 'blue' },
    { label: "Today's Appointments", value: 12, icon: 'calendar-check', color: 'purple' },
    { label: 'Food Items', value: 8240, icon: 'database', color: 'yellow' }
  ];

  const recentPatients = [
    { name: 'Rajesh Kumar', gender: 'Male', age: 42, lastVisit: '12 Sep 2023', status: 'Active' },
    { name: 'Priya Singh', gender: 'Female', age: 35, lastVisit: '10 Sep 2023', status: 'Pending' },
    { name: 'Arun Mehta', gender: 'Male', age: 58, lastVisit: '8 Sep 2023', status: 'Active' }
  ];

  const appointments = [
    { name: 'Vikram Joshi', type: 'Follow-up consultation', date: 'Today', time: '10:30 AM' },
    { name: 'Sunita Reddy', type: 'New patient - Diet planning', date: 'Tomorrow', time: '11:45 AM' },
    { name: 'Amit Patel', type: 'Progress evaluation', date: 'Tomorrow', time: '2:15 PM' }
  ];

  const quickActions = [
    { label: 'Create New Diet Chart', icon: 'utensils' },
    { label: 'Add New Patient', icon: 'user-plus' },
    { label: 'Generate Report', icon: 'file-pdf' },
    { label: 'Search Food Database', icon: 'search' }
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-green-800 text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-green-700 lg:justify-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-leaf text-2xl text-yellow-400"></i>
            <span className="text-2xl font-extrabold">AyurDiet</span>
          </div>
          <button 
            className="text-white lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="p-4">
          {['dashboard', 'patients', 'dietCharts', 'foodDatabase', 'reports', 'settings'].map((item) => (
            <button
              key={item}
              className={`w-full flex items-center space-x-2 py-2.5 px-4 rounded mb-2 transition-colors ${activeTab === item ? 'bg-green-900' : 'hover:bg-green-700'}`}
              onClick={() => setActiveTab(item)}
            >
              <i className={`fas fa-${getIconName(item)}`}></i>
              <span className="capitalize">{item === 'foodDatabase' ? 'Food Database' : item}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-green-700">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center">
              <i className="fas fa-user-md text-white"></i>
            </div>
            <div>
              <p className="font-medium">Dr. Sharma</p>
              <p className="text-sm text-green-200">Ayurvedic Specialist</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                className="text-green-800 lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
              <h1 className="text-2xl font-semibold text-gray-800 ml-4 capitalize">
                {activeTab === 'foodDatabase' ? 'Food Database' : activeTab}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <i className="fas fa-bell text-gray-500 text-xl"></i>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </div>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="border rounded-full py-1 px-4 pl-10 text-sm w-40 md:w-64"
                />
                <i className="fas fa-search absolute left-3 top-2 text-gray-400"></i>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-4 flex items-center">
                <div className={`rounded-full p-3 ${getBgColor(stat.color)} mr-4`}>
                  <i className={`fas fa-${stat.icon} text-${stat.color}-600 text-2xl`}></i>
                </div>
                <div>
                  <p className="text-gray-500">{stat.label}</p>
                  <h3 className="font-bold text-2xl">{stat.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Patients and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Recent Patients */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Recent Patients</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Last Visit</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentPatients.map((patient, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <i className="fas fa-user text-green-600"></i>
                            </div>
                            <div>
                              <p className="font-medium">{patient.name}</p>
                              <p className="text-sm text-gray-500">{patient.gender}, {patient.age} years</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">{patient.lastVisit}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(patient.status)}`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button className="text-green-600 hover:underline">
                            {patient.status === 'Pending' ? 'Create Diet' : 'View Chart'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-4">
                {quickActions.map((action, index) => (
                  <button 
                    key={index}
                    className="w-full flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-600 hover:text-white transition-colors"
                  >
                    <span>{action.label}</span>
                    <i className={`fas fa-${action.icon}`}></i>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-lg shadow mb-6">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
              <button className="text-sm text-green-600 hover:underline">View All</button>
            </div>
            <div className="divide-y divide-gray-200">
              {appointments.map((appointment, index) => (
                <div key={index} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{appointment.name}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500">{appointment.date}</p>
                    <p className="text-sm text-green-600">{appointment.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

// Helper functions
function getIconName(tab) {
  const icons = {
    dashboard: 'home',
    patients: 'user-injured',
    dietCharts: 'utensils',
    foodDatabase: 'database',
    reports: 'chart-pie',
    settings: 'cog'
  };
  return icons[tab] || 'circle';
}

function getBgColor(color) {
  const colors = {
    green: 'bg-green-100',
    blue: 'bg-blue-100',
    purple: 'bg-purple-100',
    yellow: 'bg-yellow-100'
  };
  return colors[color] || 'bg-gray-100';
}

function getStatusClass(status) {
  const classes = {
    Active: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

export default AyurvedicDashboard;