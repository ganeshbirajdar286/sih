import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { registerThunk } from "../feature/User/user.thunk";
import { FaCamera, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo.png";


const DOCTOR_SPECIALIZATIONS = [
  "Allergist", "Anesthesiologist", "Cardiologist", "Colorectal Surgeon",
  "Dermatologist", "Endocrinologist", "Family Doctor", "Gastroenterologist",
  "General Physician", "Geriatrician", "Hematologist", "Infectious Disease Physician",
  "Internal Medicine", "Nephrologist", "Neurologist",
  "Obstetrics and Gynaecology", "Oncologist", "Ophthalmologist",
  "Orthopedics", "Pediatrician", "Psychiatrist", "Radiologist",
  "Surgeon", "Urologist",
];

const GENDER_OPTIONS = ["Male", "Female", "Other"];

const INITIAL_FORM = {
  name: "",
  age: "",
  email: "",
  password: "",
  confirmPassword: "",
  gender: "",
  height: "",
  weight: "",
  isDoctor: false,
  specialization: "",
  experience: "",
  profileImage: null,
  certificate: null,
};


const FloatingInput = ({ label, type = "text", value, onChange, required, rightSlot, min }) => {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value !== "";

  return (
    <div className="relative">
      <label
        className={`absolute left-4 pointer-events-none transition-all duration-200 ${
          lifted
            ? "top-1 text-[10px] sm:text-xs text-emerald-600 font-semibold"
            : "top-3 text-gray-400 text-sm"
        }`}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        min={min}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onChange={onChange}
        required={required}
        className="w-full pt-6 pb-2 px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-transparent text-gray-800 text-sm rounded-none pr-14"
      />
      {rightSlot && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightSlot}</div>
      )}
    </div>
  );
};


 
const FloatingSelect = ({ label, value, onChange, options, required }) => (
  <div className="relative">
    <label className="absolute left-4 top-1 text-[10px] sm:text-xs text-emerald-600 font-semibold pointer-events-none">
      {label}
    </label>
    <select
      value={value}
      onChange={onChange}
      required={required}
      className="w-full pt-6 pb-2 px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-transparent text-gray-800 text-sm rounded-none appearance-none cursor-pointer"
    >
      <option value="" disabled>Select {label.toLowerCase()}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);



const ProfileImagePicker = ({ preview, onChange, onRemove }) => (
  <div className="flex flex-col items-center mb-2">
    <div className="relative group">
      <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg bg-gray-100">
        {preview ? (
          <img src={preview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-green-100">
            <FaUser className="text-5xl text-emerald-400" />
          </div>
        )}
      </div>

      <label
        htmlFor="profileImage"
        className="absolute bottom-0 right-0 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-emerald-700 transition-colors border-4 border-white"
      >
        <FaCamera className="text-white text-sm" />
        <input
          id="profileImage"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </label>

      {preview && (
        <button
          type="button"
          onClick={onRemove}
          aria-label="Remove profile image"
          className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow transition-colors"
        >
          ✕
        </button>
      )}
    </div>
    <p className="text-xs text-gray-400 mt-2 text-center">
      {preview ? "Click camera icon to change photo" : "Upload a profile picture (optional)"}
    </p>
  </div>
);

const Blob = ({ className, delay }) => (
  <div
    className={`absolute rounded-full blur-3xl animate-float ${className}`}
    style={{ animationDelay: `${delay}s` }}
  />
);

const TogglePasswordBtn = ({ visible, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-gray-400 hover:text-emerald-600 transition-colors focus:outline-none"
    aria-label={visible ? "Hide password" : "Show password"}
  >
    {visible ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
  </button>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);


const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
  const [termsChecked, setTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── Helpers ──

  const set = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("Please upload a valid image file."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be smaller than 5 MB."); return; }
    set("profileImage", file);
    const reader = new FileReader();
    reader.onloadend = () => setProfileImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeProfileImage = () => { set("profileImage", null); setProfileImagePreview(null); };

  const togglePassword = (field) => setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

  // ── Validation ──

  const validate = () => {
    if (!termsChecked) { toast.error("Please accept the Terms & Conditions."); return false; }
    if (formData.password !== formData.confirmPassword) { toast.error("Passwords do not match."); return false; }
    if (formData.password.length < 8) { toast.error("Password must be at least 8 characters."); return false; }
    if (formData.isDoctor && !formData.certificate) { toast.error("Please upload your medical certificate."); return false; }
    return true;
  };

  // ── Submit ──

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      await dispatch(
        registerThunk({
          Name: formData.name,
          Email: formData.email,
          Password: formData.password,
          Age: formData.age,
          Height: formData.height,
          Weight: formData.weight,
          Gender: formData.gender,
          isDoctor: formData.isDoctor,
          Specialization: formData.specialization,
          Experience: formData.experience,
          profileImage: formData.profileImage,
          certificate: formData.certificate,
        })
      ).unwrap();
      toast.success("Registration successful! 🎉");
      navigate(formData.isDoctor ? "/doctor-dashboard" : "/signin");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(error?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── Render ──

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/70 via-amber-50/50 to-white px-4 py-10 relative overflow-hidden">
      <Blob className="top-[10%] left-[5%] w-24 h-24 bg-emerald-200 opacity-30" delay={0} />
      <Blob className="top-[60%] left-[70%] w-32 h-32 bg-amber-200 opacity-30" delay={2} />
      <Blob className="top-[20%] left-[80%] w-20 h-20 bg-green-200 opacity-20" delay={4} />

      <div className="relative w-full max-w-xl bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/30">
        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-t-3xl" />

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full overflow-hidden shadow-lg mb-4 hover:scale-105 hover:rotate-3 transition-transform duration-300">
            <img src={logo} alt="Swasthya logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 tracking-wide">SWASTHYA</h1>
          <p className="text-gray-500 text-sm mt-1">Create an account to start your wellness journey</p>
        </div>


        {/* Divider */}
        <div className="relative flex items-center mb-5">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-3 text-xs text-gray-400 font-medium">OR SIGN UP WITH EMAIL</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        {/* Role Toggle */}
        <div className="flex justify-center gap-3 mb-6">
          {[{ label: "Patient", value: false }, { label: "Doctor", value: true }].map((role) => (
            <button
              key={role.label}
              type="button"
              onClick={() => set("isDoctor", role.value)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                formData.isDoctor === role.value
                  ? "bg-emerald-600 text-white shadow-md scale-105"
                  : "bg-white text-gray-600 border border-gray-300 hover:bg-emerald-50"
              }`}
            >
              {role.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <ProfileImagePicker
            preview={profileImagePreview}
            onChange={handleProfileImageChange}
            onRemove={removeProfileImage}
          />

          <FloatingInput label="Full Name" value={formData.name} onChange={(e) => set("name", e.target.value)} required />
          <FloatingInput label="Email Address" type="email" value={formData.email} onChange={(e) => set("email", e.target.value)} required />
          <FloatingInput label="Age" type="number" min="1" value={formData.age} onChange={(e) => set("age", e.target.value)} required />

          <FloatingInput
            label="Password"
            type={showPassword.password ? "text" : "password"}
            value={formData.password}
            onChange={(e) => set("password", e.target.value)}
            required
            rightSlot={<TogglePasswordBtn visible={showPassword.password} onClick={() => togglePassword("password")} />}
          />

          <FloatingInput
            label="Confirm Password"
            type={showPassword.confirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={(e) => set("confirmPassword", e.target.value)}
            required
            rightSlot={<TogglePasswordBtn visible={showPassword.confirmPassword} onClick={() => togglePassword("confirmPassword")} />}
          />

          <FloatingSelect
            label="Gender"
            value={formData.gender}
            onChange={(e) => set("gender", e.target.value)}
            options={GENDER_OPTIONS}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FloatingInput label="Height (cm)" type="number" min="1" value={formData.height} onChange={(e) => set("height", e.target.value)} required />
            <FloatingInput label="Weight (kg)" type="number" min="1" value={formData.weight} onChange={(e) => set("weight", e.target.value)} required />
          </div>

          {/* Doctor-only fields */}
          {formData.isDoctor && (
            <div className="space-y-5 pt-2 border-t border-emerald-100">
              <p className="text-xs font-semibold text-emerald-700 pt-2 flex items-center gap-1">
                🩺 Doctor Information
              </p>

              <FloatingSelect
                label="Specialization"
                value={formData.specialization}
                onChange={(e) => set("specialization", e.target.value)}
                options={DOCTOR_SPECIALIZATIONS}
                required
              />

              <FloatingInput
                label="Experience (years)"
                type="number"
                min="0"
                value={formData.experience}
                onChange={(e) => set("experience", e.target.value)}
                required
              />

              <div>
                <p className="text-xs font-semibold text-gray-600 mb-2">Medical Certificate / License</p>
                <label className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg cursor-pointer transition-colors">
                  📎 Choose File
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="hidden"
                    onChange={(e) => set("certificate", e.target.files[0])}
                  />
                </label>

                {formData.certificate && (
                  <div className="mt-2 flex items-center justify-between gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-sm">
                    <span className="truncate text-emerald-800 font-medium">{formData.certificate.name}</span>
                    <button
                      type="button"
                      onClick={() => set("certificate", null)}
                      className="text-red-500 hover:text-red-700 font-semibold text-xs shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Terms */}
          <label className="flex items-start gap-2 cursor-pointer text-sm text-gray-600 pt-2">
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded accent-emerald-600 cursor-pointer"
            />
            <span>
              I accept the{" "}
              <a href="/terms" className="text-emerald-600 font-semibold hover:underline">
                Terms & Conditions
              </a>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Creating account…
              </span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <a href="/signin" className="text-emerald-600 font-semibold hover:underline">
            Sign In
          </a>
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50%        { transform: translateY(-18px) scale(1.05); }
        }
        .animate-float { animation: float 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default SignUp;