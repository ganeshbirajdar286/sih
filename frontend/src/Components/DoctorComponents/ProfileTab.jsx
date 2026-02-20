import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { profileUpdate, profile as fetchProfile } from "../../feature/Doctor/doctor.thunk";
import {logoutThunk  } from "../../feature/User/user.thunk"; 
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

/* ─── Reusable Field ─── */
const Field = ({ label, name, type = "text", value, onChange, disabled, textarea, rows = 3, error }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    {textarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        rows={rows}
        className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-800
                   focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                   disabled:bg-slate-50 disabled:text-slate-400 resize-none transition-all
                   ${error ? "border-red-400 bg-red-50" : "border-slate-200"}`}
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border rounded-xl px-4 py-3 text-sm text-slate-800
                   focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent
                   disabled:bg-slate-50 disabled:text-slate-400 transition-all
                   ${error ? "border-red-400 bg-red-50" : "border-slate-200"}`}
      />
    )}
    {error && (
      <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
        <span>⚠️</span> {error}
      </p>
    )}
  </div>
);

/* ─── Tab Button ─── */
const TabBtn = ({ id, active, onClick, children }) => (
  <button
    onClick={() => onClick(id)}
    className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
      active ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
    }`}
  >
    {children}
  </button>
);

const seedFromDoctor = (doc) => ({
  Name:           doc?.User_id?.Name           || "",
  Email:          doc?.User_id?.Email          || "",
  PhoneNumber:    doc?.User_id?.PhoneNumber    || "",
  Specialization: doc?.Specialization          || "",
  Experience:     doc?.Experience !== undefined ? String(doc.Experience) : "",
  Bio:            doc?.Bio                     || "",
  Qualifications: doc?.Qualifications          || "",
  Clinic_Name:    doc?.Clinic_Name             || "",
  Consultation:   doc?.Consultation            || "",
});

const seedFromUpdatedUser = (user) => ({
  Name:           user?.Name                        || "",
  Email:          user?.Email                       || "",
  PhoneNumber:    user?.PhoneNumber                 || "",
  Specialization: user?.Doctor_id?.Specialization  || "",
  Experience:     user?.Doctor_id?.Experience !== undefined
                    ? String(user.Doctor_id.Experience) : "",
  Bio:            user?.Doctor_id?.Bio              || "",
  Qualifications: user?.Doctor_id?.Qualifications  || "",
  Clinic_Name:    user?.Doctor_id?.Clinic_Name      || "",
  Consultation:   user?.Doctor_id?.Consultation     || "",
});

const FALLBACK_AVATAR =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVXRMrZHp2Vv7XePQtwJZrf0FmbXoUWw53iQ&s";

const emptyForm = {
  Name: "", Email: "", PhoneNumber: "", Specialization: "",
  Experience: "", Bio: "", Qualifications: "", Clinic_Name: "", Consultation: "",
};

export default function ProfileTab() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();

  const { loading, Profile } = useSelector((state) => state.doctor);

  const [profile,      setProfile]      = useState(emptyForm);
  const [savedProfile, setSavedProfile] = useState(emptyForm);
  const [activeTab,    setActiveTab]    = useState("personal");
  const [isEditing,    setIsEditing]    = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile,    setImageFile]    = useState(null);
  const [errors,       setErrors]       = useState({});         // ← validation errors
  const [logoutLoading, setLogoutLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => { dispatch(fetchProfile()); }, [dispatch]);

  useEffect(() => {
    if (!Profile) return;
    let seeded, img = null;
    if (Profile.User_id) {
      seeded = seedFromDoctor(Profile);
      img    = Profile.User_id?.Image_url || null;
    } else {
      seeded = seedFromUpdatedUser(Profile);
      img    = Profile.Image_url || null;
    }
    setProfile(seeded);
    setSavedProfile(seeded);
    if (img) setProfileImage(img);
  }, [Profile]);

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone: allow digits only, max 10 chars
    if (name === "PhoneNumber") {
      const digitsOnly = value.replace(/\D/g, "").slice(0, 10);
      setProfile((prev) => ({ ...prev, PhoneNumber: digitsOnly }));
      setErrors((prev) => ({
        ...prev,
        PhoneNumber: digitsOnly.length > 0 && digitsOnly.length < 10
          ? "Phone number must be exactly 10 digits."
          : "",
      }));
      return;
    }

    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setProfileImage(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleEdit = () => {
    setSavedProfile(profile);
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setImageFile(null);
    setErrors({});
    setIsEditing(false);
  };

  /* ── Validate before save ── */
  const validate = () => {
    const newErrors = {};
    if (profile.PhoneNumber && profile.PhoneNumber.length !== 10) {
      newErrors.PhoneNumber = "Phone number must be exactly 10 digits.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      toast.error("Please fix the errors before saving.");
      setActiveTab("personal"); // jump to the tab that has the error
      return;
    }

    const formData = new FormData();
    formData.append("Name",           profile.Name);
    formData.append("Email",          profile.Email);
    formData.append("PhoneNumber",    profile.PhoneNumber);
    formData.append("Specialization", profile.Specialization);
    formData.append("Experience",     profile.Experience);
    formData.append("Bio",            profile.Bio);
    formData.append("Qualifications", profile.Qualifications);
    formData.append("Clinic_Name",    profile.Clinic_Name);
    formData.append("Consultation",   profile.Consultation);
    if (imageFile) formData.append("profileImage", imageFile);

    const result = await dispatch(profileUpdate(formData));
    if (profileUpdate.fulfilled.match(result)) {
      toast.success("Profile updated successfully!");
      setSavedProfile(profile);
      setImageFile(null);
      setIsEditing(false);
      dispatch(fetchProfile());
    } else {
      toast.error(result.payload || "Failed to update profile");
    }
  };

  /* ── Logout ── */
  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await dispatch(logoutThunk());          
      toast.success("Logged out successfully.");
      navigate("/login");                 // redirect to login page
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setLogoutLoading(false);
    }
  };

  const stats = [
    { label: "Experience", value: profile.Experience ? `${profile.Experience} yrs` : "—" },
    {
      label: "Rating",
      value: Profile?.averageRating
        ? `${Profile.averageRating}/5`
        : Profile?.Doctor_id?.averageRating
        ? `${Profile.Doctor_id.averageRating}/5`
        : "—",
    },
    { label: "Reviews", value: Profile?.totalReviews ?? Profile?.Doctor_id?.totalReviews ?? "—" },
    { label: "Specialty", value: profile.Specialization || "—" },
  ];

  const pct = (() => {
    const vals   = Object.values(profile);
    const filled = vals.filter(Boolean).length;
    return Math.round((filled / vals.length) * 100);
  })();

  if (loading && !Profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-blue-50/30 p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin w-10 h-10 text-amber-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-slate-500 text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-blue-50/30 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">

        {/* ── Header Banner ── */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 translate-y-12 pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">

            {/* Profile Image */}
            <div className="relative group flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white/30 shadow-lg overflow-hidden bg-white/20">
                <img
                  src={profileImage || FALLBACK_AVATAR}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = FALLBACK_AVATAR; }}
                />
              </div>
              {isEditing && (
                <>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center
                               rounded-2xl cursor-pointer opacity-0 group-hover:opacity-100
                               transition-opacity text-white text-xs font-semibold gap-1"
                  >
                    📷 Change
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </>
              )}
            </div>

            {/* Name / Info */}
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold truncate">
                {profile.Name ? `Dr. ${profile.Name}` : "—"}
              </h1>
              <p className="text-amber-100 text-base sm:text-lg mt-1 truncate">
                {profile.Specialization || "—"}
              </p>
              <p className="text-white/80 text-sm mt-0.5">
                {profile.Qualifications || "—"}
              </p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                {stats.map((s, i) => (
                  <div key={i} className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm">
                    <span className="font-bold">{s.value}</span>
                    <span className="text-amber-100 ml-1.5">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit / Cancel */}
            <button
              onClick={isEditing ? handleCancel : handleEdit}
              className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                isEditing
                  ? "bg-white text-amber-600 hover:bg-amber-50"
                  : "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30"
              }`}
            >
              {isEditing ? "✕ Cancel" : "✏️ Edit Profile"}
            </button>
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">

          {/* Left — Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 sm:p-6">

              {/* Tabs */}
              <div className="grid grid-cols-3 gap-1 bg-slate-100 rounded-xl p-1 mb-6">
                <TabBtn id="personal"     active={activeTab === "personal"}     onClick={setActiveTab}>👤 Personal</TabBtn>
                <TabBtn id="professional" active={activeTab === "professional"} onClick={setActiveTab}>💼 Professional</TabBtn>
                <TabBtn id="settings"     active={activeTab === "settings"}     onClick={setActiveTab}>⚙️ Settings</TabBtn>
              </div>

              {/* ── Personal Tab ── */}
              {activeTab === "personal" && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-slate-800">Personal Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name"          name="Name"        value={profile.Name}        onChange={handleChange} disabled={!isEditing} />
                    <Field label="Email"              name="Email"       value={profile.Email}       onChange={handleChange} disabled={!isEditing} type="email" />

                    {/* ── Phone with 10-digit restriction ── */}
                    <Field
                      label="Phone Number"
                      name="PhoneNumber"
                      value={profile.PhoneNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                      type="tel"
                      error={errors.PhoneNumber}
                    />

                    <Field label="Experience (years)" name="Experience"  value={profile.Experience}  onChange={handleChange} disabled={!isEditing} type="number" />
                  </div>
                  <Field label="Bio" name="Bio" value={profile.Bio} onChange={handleChange} disabled={!isEditing} textarea rows={4} />
                </div>
              )}

              {/* ── Professional Tab ── */}
              {activeTab === "professional" && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-slate-800">Professional Details</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Specialization"   name="Specialization" value={profile.Specialization} onChange={handleChange} disabled={!isEditing} />
                    <Field label="Qualifications"   name="Qualifications" value={profile.Qualifications} onChange={handleChange} disabled={!isEditing} />
                    <Field label="Clinic Name"      name="Clinic_Name"    value={profile.Clinic_Name}    onChange={handleChange} disabled={!isEditing} />
                    <Field label="Consultation Fee" name="Consultation"   value={profile.Consultation}   onChange={handleChange} disabled={!isEditing} />
                  </div>
                </div>
              )}

              {/* ── Settings Tab ── */}
              {activeTab === "settings" && (
                <div className="space-y-5">
                  <h3 className="text-lg font-bold text-slate-800">Account Settings</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                  

                    {/* ── Logout ── */}
                    <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                      <h4 className="font-semibold text-red-800 mb-1 text-sm">Sign Out</h4>
                      <p className="text-xs text-red-500 mb-4">
                        You will be logged out of your account and redirected to the login page.
                      </p>
                      <button
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600
                                   disabled:bg-red-300 disabled:cursor-not-allowed text-white py-2.5
                                   rounded-lg font-semibold text-sm transition-colors cursor-pointer"
                      >
                        {logoutLoading ? (
                          <>
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                            </svg>
                            Signing out…
                          </>
                        ) : (
                          <>🚪 Logout</>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* ── Save / Cancel ── */}
              {isEditing && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 pt-6 border-t border-slate-100">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600
                               disabled:bg-amber-300 disabled:cursor-not-allowed text-white py-3
                               rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                        Saving…
                      </>
                    ) : "💾 Save Changes"}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-3
                               rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}