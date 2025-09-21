import { useState } from 'react';

const AyurvedicDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Sample data
  const stats = [
    { label: 'Total Patients', value: 142, icon: 'user-injured', color: 'green', change: '+12%' },
    { label: 'Diet Charts', value: 89, icon: 'utensils', color: 'blue', change: '+5%' },
    { label: "Today's Appointments", value: 12, icon: 'calendar-check', color: 'purple', change: '+3' },
    { label: 'Food Items', value: 8240, icon: 'database', color: 'yellow', change: '+124' }
  ];

  const recentPatients = [
    { name: 'Rajesh Kumar', gender: 'Male', age: 42, lastVisit: '12 Sep 2023', status: 'Active' },
    { name: 'Priya Singh', gender: 'Female', age: 35, lastVisit: '10 Sep 2023', status: 'Pending' },
    { name: 'Arun Mehta', gender: 'Male', age: 58, lastVisit: '8 Sep 2023', status: 'Active' },
    { name: 'Sneha Patel', gender: 'Female', age: 29, lastVisit: '7 Sep 2023', status: 'Completed' }
  ];

  const appointments = [
    { name: 'Vikram Joshi', type: 'Follow-up consultation', date: 'Today', time: '10:30 AM' },
    { name: 'Sunita Reddy', type: 'New patient - Diet planning', date: 'Tomorrow', time: '11:45 AM' },
    { name: 'Amit Patel', type: 'Progress evaluation', date: 'Tomorrow', time: '2:15 PM' }
  ];

  const quickActions = [
    { label: 'Create New Diet Chart', icon: 'utensils', color: 'bg-blue-500' },
    { label: 'Add New Patient', icon: 'user-plus', color: 'bg-green-500' },
    { label: 'Generate Report', icon: 'file-pdf', color: 'bg-purple-500' },
    { label: 'Search Food Database', icon: 'search', color: 'bg-yellow-500' }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-green-800 to-green-900 text-white transform transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-green-700 lg:justify-center">
          <div className="flex items-center space-x-2">
            <i className="fas fa-leaf text-2xl text-yellow-400"></i>
            <span className="text-2xl font-extrabold">AyurDiet</span>
          </div>
          <button 
            className="text-white lg:hidden hover:text-green-200 transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <nav className="p-4 mt-2">
          {['dashboard', 'patients', 'dietCharts', 'foodDatabase', 'reports', 'settings'].map((item) => (
            <button
              key={item}
              className={`w-full flex items-center space-x-3 py-3 px-4 rounded-lg mb-2 transition-all ${activeTab === item ? 'bg-green-700 shadow-md' : 'hover:bg-green-700 hover:bg-opacity-50'}`}
              onClick={() => setActiveTab(item)}
            >
              <i className={`fas fa-${getIconName(item)} w-5 text-center`}></i>
              <span className="capitalize font-medium">{item === 'foodDatabase' ? 'Food Database' : item}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-green-700 bg-green-850">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center border border-green-500">
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
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button 
                className="text-green-800 lg:hidden hover:text-green-600 transition-colors"
                onClick={() => setSidebarOpen(true)}
              >
                <i className="fas fa-bars text-xl"></i>
              </button>
              <h1 className="text-2xl font-semibold text-gray-800 ml-4 capitalize">
                {activeTab === 'foodDatabase' ? 'Food Database' : activeTab}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
                  <i className="fas fa-bell text-gray-500"></i>
                  <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border-2 border-white"></span>
                </div>
                <div className="absolute invisible group-hover:visible right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10 p-4 border">
                  <p className="font-medium text-gray-700">Notifications</p>
                  <p className="text-sm text-gray-500 mt-2">No new notifications</p>
                </div>
              </div>
              
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="border rounded-full py-2 px-4 pl-10 text-sm w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-300 transition-all"
                />
                <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
              </div>
              
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white font-bold cursor-pointer hover:from-green-500 hover:to-green-700 transition-all shadow-md">
                DS
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Welcome Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, Dr. Sharma</h2>
            <p className="text-gray-600">Here's what's happening with your practice today.</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-5 flex items-center justify-between border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className={`rounded-xl p-3 ${getBgColor(stat.color)} mr-4`}>
                    <i className={`fas fa-${stat.icon} text-${stat.color}-600 text-xl`}></i>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                    <h3 className="font-bold text-2xl">{stat.value.toLocaleString()}</h3>
                    <p className={`text-xs ${stat.change.includes('+') ? 'text-green-500' : 'text-red-500'}`}>
                      {stat.change} from last week
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Patients and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Recent Patients */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-800">Recent Patients</h2>
                <button className="text-sm text-green-600 hover:text-green-700 font-medium">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Visit</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentPatients.map((patient, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                              <i className={`fas fa-user text-${patient.gender === 'Male' ? 'blue' : 'pink'}-500`}></i>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{patient.name}</p>
                              <p className="text-sm text-gray-500">{patient.gender}, {patient.age} years</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-gray-700">{patient.lastVisit}</td>
                        <td className="px-5 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(patient.status)}`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button className={`px-3 py-1 rounded-lg text-sm font-medium ${patient.status === 'Pending' ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-blue-100 text-blue-800 hover:bg-blue-200'} transition-colors`}>
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
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-3">
                {quickActions.map((action, index) => (
                  <button 
                    key={index}
                    className="w-full flex items-center justify-between p-4 rounded-xl transition-all transform hover:-translate-y-1 hover:shadow-md group"
                    style={{background: `linear-gradient(to right, ${action.color.replace('bg-', '')}20, ${action.color.replace('bg-', '')}10)`}}
                  >
                    <span className="font-medium text-gray-800 group-hover:text-gray-900">{action.label}</span>
                    <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                      <i className={`fas fa-${action.icon}`}></i>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
              <button className="text-sm text-green-600 hover:text-green-700 font-medium">View All</button>
            </div>
            <div className="divide-y divide-gray-200">
              {appointments.map((appointment, index) => (
                <div key={index} className="p-5 flex justify-between items-center hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mr-4">
                      <i className="fas fa-calendar-check text-green-600"></i>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{appointment.name}</p>
                      <p className="text-sm text-gray-500">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500 font-medium">{appointment.date}</p>
                    <p className="text-sm text-green-600 font-semibold">{appointment.time}</p>
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
    Pending: 'bg-yellow-100 text-yellow-800',
    Completed: 'bg-blue-100 text-blue-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
}

export default AyurvedicDashboard;