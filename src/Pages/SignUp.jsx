import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from  "../assets/logo.png"

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient", // default
    certificates: [],
    specialization: "",
  });

  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
  const [termsChecked, setTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const doctorOptions = [
    "Dermatologist", "Oncologist", "Cardiologist", "Endocrinologist", "Gastroenterologist",
    "Neurologist", "Obstetrics and Gynaecology", "Ophthalmologist", "Family doctor",
    "Psychiatrist", "Pediatrician", "Allergist", "Geriatrician", "Internal medicine",
    "Nephrologist", "Orthopedics", "Anesthesiologist", "Infectious disease physician",
    "Radiologist", "General physician", "Hematologist", "Surgeon", "Urologist", "Colorectal surgeon",
  ];

  const handleFocus = (field) => setIsFocused({ ...isFocused, [field]: true });
  const handleBlur = (field) => setIsFocused({ ...isFocused, [field]: false });
  const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termsChecked) {
      alert("Please accept the Terms & Conditions");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      console.log("Sign Up Data:", formData);

      if (formData.role === "doctor") {
        navigate("/doctor-dashboard");
      } else {
        navigate("/patient-dashboard");
      }
    }, 1000);
  };

  const handleDemoSignup = () => {
    setFormData({
      name: "Demo User",
      email: "demo@ayurdietcare.com",
      password: "demopassword",
      confirmPassword: "demopassword",
      role: "patient",
      certificates: [],
      specialization: "",
    });
    setTermsChecked(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/70 via-amber-50/50 to-white px-4 relative overflow-hidden">

      {/* Background */}
      <div className="absolute top-[10%] left-[5%] w-24 h-24 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-float"></div>
      <div className="absolute top-[60%] left-[70%] w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] left-[80%] w-20 h-20 bg-green-200 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-t-3xl"></div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg mb-4 transform transition-transform duration-500 hover:scale-105 hover:rotate-3 overflow-hidden rounded-full">
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-green-800">
            SWASTHYA
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Create an account to start your wellness journey</p>
        </div>

        {/* Role Selector */}
        <div className="flex justify-center mb-6 space-x-4">
          {["patient", "doctor"].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setFormData({ ...formData, role: r })}
              className={`px-4 cursor-pointer py-2 rounded-full font-medium transition-colors duration-300 ${formData.role === r ? "bg-emerald-600 text-white shadow-md" : "bg-white text-gray-700 border border-gray-300 hover:bg-emerald-50"}`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {["name", "email", "password", "confirmPassword"].map((field) => (
            <div key={field} className="relative">
              <label className={`absolute left-4 transition-all duration-300 pointer-events-none ${isFocused[field] || formData[field] ? 'top-1 text-xs text-emerald-600 font-medium' : 'top-3 text-gray-500 text-sm'}`}>
                {field === "name" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field.includes("password") ? (showPassword[field] ? "text" : "password") : "text"}
                value={formData[field]}
                onFocus={() => handleFocus(field)}
                onBlur={() => handleBlur(field)}
                onChange={(e) => handleChange(field, e.target.value)}
                className="w-full pt-6 pb-2 px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-white/90 text-gray-800 rounded-none pr-10"
                required
              />
              {field.includes("password") && (
                <button type="button" onClick={() => setShowPassword({ ...showPassword, [field]: !showPassword[field] })} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 focus:outline-none">
                  {showPassword[field] ? "Hide" : "Show"}
                </button>
              )}
            </div>
          ))}

          {/* Doctor-only Fields */}
          {formData.role === "doctor" && (
            <div className="space-y-4">
              {/* Certificates */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Upload Certificates</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFormData({ ...formData, certificates: [...formData.certificates, ...Array.from(e.target.files)] })}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200"
                />
              </div>
              {formData.certificates.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-gray-50 text-neutral-950">
                  {formData.certificates.map((file, idx) => (
                    <li key={idx} className="flex justify-between items-center text-sm mb-1">
                      <span className="truncate">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newFiles = formData.certificates.filter((_, i) => i !== idx);
                          setFormData({ ...formData, certificates: newFiles });
                        }}
                        className="text-red-500 hover:text-red-700 font-medium ml-2"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Specialization */}
              <div className="relative">
                <label htmlFor="specialization" className="absolute left-4 transition-all duration-300 pointer-events-none top-1 text-xs text-emerald-600 font-medium">Specialization</label>
                <select
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) => handleChange("specialization", e.target.value)}
                  className="w-full pt-6 pb-2 px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-white/90 text-gray-800 rounded-none"
                  required
                >
                  <option value="" disabled>Select your specialization</option>
                  {doctorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Terms & Submit */}
          <div className="flex flex-col gap-2">
            <label className="flex items-center cursor-pointer text-sm">
              <div className="relative">
                {/* Hidden native checkbox */}
                <input
                  type="checkbox"
                  checked={termsChecked}
                  onChange={(e) => setTermsChecked(e.target.checked)}
                  className="peer sr-only"
                />
                {/* Custom checkbox box */}
                <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-colors">
                  {/* White tick appears only when checked */}
                  <svg
                    className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <span className="ml-2">
                I accept the{" "}
                <a href="/terms" className="text-emerald-600 font-medium hover:text-emerald-700">
                  Terms & Conditions
                </a>
              </span>
            </label>





            <button type="submit" disabled={isLoading} className="w-full cursor-pointer py-3.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed">
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>

            <button type="button" onClick={handleDemoSignup} className="w-full cursor-pointer py-3 border border-emerald-500 text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition-colors duration-300">
              Try Demo Account
            </button>
          </div>
        </form>

        {/* Extra Links */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/signin" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors focus:outline-none focus:underline">Sign In</a>
        </p>
      </div>

      {/* Floating animation */}
      <style>{`
  @keyframes float {
    0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
    50% { transform: translateY(-20px) scale(1.05); opacity: 0.4; }
  }
  .animate-float { animation: float 8s ease-in-out infinite; }
`}</style>
    </div>
  );
};

export default SignUp;
