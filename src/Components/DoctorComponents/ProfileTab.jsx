import React, { useState } from "react";

export default function ProfileTab() {
  // State for editable profile
  const [profile, setProfile] = useState({
    name: "Dr. Sharma",
    email: "johndoe@example.com",
    specialization: "Ayurveda Specialist",
    phone: "+91 9876543210",
    experience: "15 years",
    qualifications: "BAMS, MD (Ayurveda)",
    clinicName: "Ayurveda Healing Center",
    clinicAddress: "123 Wellness Street, Mumbai, India",
    bio: "Senior Ayurvedic practitioner with expertise in Panchakarma and herbal medicine. Committed to holistic healing and patient wellness.",
    consultationFee: "₹1500",
    availability: "Mon-Sat: 9:00 AM - 6:00 PM"
  });

  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVXRMrZHp2Vv7XePQtwJZrf0FmbXoUWw53iQ&s"  // direct link
);


  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    setIsEditing(false);
    // Simulate API call
    setTimeout(() => {
      alert("Profile updated successfully!");
    }, 500);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values here if needed
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { label: "Total Patients", value: "1,247" },
    { label: "Success Rate", value: "92%" },
    { label: "Experience", value: profile.experience },
    { label: "Rating", value: "4.9/5" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-blue-50/30 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12"></div>

          <div className="flex flex-col lg:flex-row items-center gap-6 relative z-10">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-2xl border-4 border-white/20 shadow-lg overflow-hidden">
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              {isEditing && (
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  <span className="text-white text-sm font-medium">📷 Change</span>
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="text-center lg:text-left flex-1">
              <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
              <p className="text-amber-100 text-lg mb-3">{profile.specialization}</p>
              <p className="text-white/90">{profile.qualifications}</p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center lg:justify-start">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="font-bold">{stat.value}</span>
                    <span className="text-amber-100 text-sm ml-2">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`cursor-pointer px-6 py-3 rounded-lg font-semibold transition-all ${isEditing
                  ? 'bg-white text-amber-600 hover:bg-amber-50'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
                }`}
            >
              {isEditing ? '✕ Cancel' : '✏️ Edit Profile'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8  ">

          {/* Left Column - Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              {/* Navigation Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-slate-100 rounded-xl p-1 mb-6">
                {['personal', 'professional', 'settings'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${activeTab === tab
                        ? 'bg-white text-amber-600 shadow-sm'
                        : 'text-slate-600 hover:text-slate-800'
                      }`}
                  >
                    {tab === 'personal' && '👤 Personal'}
                    {tab === 'professional' && '💼 Professional'}
                    {tab === 'settings' && '⚙️ Settings'}
                  </button>
                ))}
              </div>

              {/* Personal Info Tab */}
              {activeTab === 'personal' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Personal Information</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Experience</label>
                      <input
                        type="text"
                        name="experience"
                        value={profile.experience}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows="4"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Professional Info Tab */}
              {activeTab === 'professional' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Professional Details</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Specialization</label>
                      <input
                        type="text"
                        name="specialization"
                        value={profile.specialization}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Qualifications</label>
                      <input
                        type="text"
                        name="qualifications"
                        value={profile.qualifications}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Clinic Name</label>
                      <input
                        type="text"
                        name="clinicName"
                        value={profile.clinicName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Consultation Fee</label>
                      <input
                        type="text"
                        name="consultationFee"
                        value={profile.consultationFee}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Clinic Address</label>
                    <textarea
                      name="clinicAddress"
                      value={profile.clinicAddress}
                      onChange={handleChange}
                      disabled={!isEditing}
                      rows="3"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Availability</label>
                    <input
                      type="text"
                      name="availability"
                      value={profile.availability}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-4">Account Settings</h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Change Password</h4>
                      <div className="space-y-3">
                        <input
                          type="password"
                          placeholder="Current Password"
                          className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="password"
                          placeholder="New Password"
                          className="w-full border border-blue-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                          Update Password
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                      <h4 className="font-semibold text-amber-800 mb-2">Notification Preferences</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="rounded text-amber-500" defaultChecked />
                          <span className="text-slate-700">Email notifications</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="rounded text-amber-500" defaultChecked />
                          <span className="text-slate-700">SMS alerts</span>
                        </label>
                        <label className="flex items-center gap-3">
                          <input type="checkbox" className="rounded text-amber-500" />
                          <span className="text-slate-700">Push notifications</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              {isEditing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-200">
                  <button
                    onClick={handleSave}
                    className="w-full bg-amber-500 text-white py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors"
                  >
                    💾 Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="w-full bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>


          {/* Right Column - Quick Stats */}
          <div className="space-y-6">
            {/* Verification Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Verification Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700">Email Verified</span>
                  <span className="text-green-500">✓</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-700">Phone Verified</span>
                  <span className="text-green-500">✓</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span className="text-amber-700">License Verified</span>
                  <span className="text-amber-500">⏳</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3">
                  <span className="text-blue-500">📊</span>
                  <span>View Analytics</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3">
                  <span className="text-green-500">👥</span>
                  <span>Manage Patients</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3">
                  <span className="text-purple-500">📅</span>
                  <span>Appointment Schedule</span>
                </button>
                <button className="w-full text-left p-3 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-3">
                  <span className="text-red-500">⚙️</span>
                  <span>Account Settings</span>
                </button>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-4">Profile Completion</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Profile Strength</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
                <p className="text-slate-600 text-sm">Complete your profile to improve visibility</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}