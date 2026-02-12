import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { registerThunk } from "../feature/User/user.thunk";
import { FaCamera, FaUser } from "react-icons/fa";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    password: "",
    confirmPassword: "",
    gender: "",
    height: "",
    weight: "",
    dosha: "",
    isDoctor: false,
    specialization: "",
    experience: "",
    profileImage: null,
    certificate: null,
  });

  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const [isFocused, setIsFocused] = useState({
    name: false,
    age: false,
    password: false,
    confirmPassword: false,
    gender: false,
    height: false,
    weight: false,
    dosha: false,
    experience: false,
  });

  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [termsChecked, setTermsChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const doctorOptions = [
    "Dermatologist",
    "Oncologist",
    "Cardiologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Neurologist",
    "Obstetrics and Gynaecology",
    "Ophthalmologist",
    "Family doctor",
    "Psychiatrist",
    "Pediatrician",
    "Allergist",
    "Geriatrician",
    "Internal medicine",
    "Nephrologist",
    "Orthopedics",
    "Anesthesiologist",
    "Infectious disease physician",
    "Radiologist",
    "General physician",
    "Hematologist",
    "Surgeon",
    "Urologist",
    "Colorectal surgeon",
  ];

  const doshaOptions = [
    "Vata",
    "Pitta",
    "Kapha",
    "Vata-Pitta",
    "Pitta-Kapha",
    "Vata-Kapha",
  ];
  const genderOptions = ["Male", "Female", "Other"];

  const handleFocus = (field) => setIsFocused({ ...isFocused, [field]: true });
  const handleBlur = (field) => setIsFocused({ ...isFocused, [field]: false });
  const handleChange = (field, value) =>
    setFormData({ ...formData, [field]: value });


  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }
      
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setFormData({ ...formData, profileImage: file });
      
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile image
  const removeProfileImage = () => {
    setFormData({ ...formData, profileImage: null });
    setProfileImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!termsChecked) {
      toast.error("Please accept the Terms & Conditions");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.isDoctor && !formData.certificate) {
      toast.error("Please upload certificate");
      return;
    }

    setIsLoading(true);

    try {
      const response = await dispatch(
        registerThunk({
          Name: formData.name,
          Password: formData.password,
          Age: formData.age,
          Height: formData.height,
          Weight: formData.weight,
          Gender: formData.gender,
          Dosha: formData.dosha,
          isDoctor: formData.isDoctor,
          Specialization: formData.specialization,
          Experience: formData.experience,
          profileImage: formData.profileImage,
          certificate: formData.certificate,
        }),
      ).unwrap();

      console.log("Register response:", response);

      toast.success("Registration successful");

      navigate(formData.isDoctor ? "/doctor-dashboard" : "/patient-dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/70 via-amber-50/50 to-white px-3 sm:px-4 md:px-6 lg:px-8 relative overflow-hidden py-6 sm:py-8 md:py-10">
      <div className="absolute top-[10%] left-[5%] w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-float"></div>
      <div
        className="absolute top-[60%] left-[70%] w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-amber-200 rounded-full blur-3xl opacity-30 animate-float"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute top-[20%] left-[80%] w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-green-200 rounded-full blur-3xl opacity-20 animate-float"
        style={{ animationDelay: "4s" }}
      ></div>

      {/* Card */}
      <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 border border-white/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-t-2xl sm:rounded-t-3xl"></div>

        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg mb-3 sm:mb-4 transform transition-transform duration-500 hover:scale-105 hover:rotate-3 overflow-hidden rounded-full">
            <img src={logo} alt="logo" className="w-full h-full object-cover" />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-green-800">
            SWASTHYA
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2 font-medium px-2">
            Create an account to start your wellness journey
          </p>
        </div>

        {/* Role Selector */}
        <div className="flex justify-center mb-5 sm:mb-6 space-x-2 sm:space-x-4">
          {[
            { label: "Patient", value: false },
            { label: "Doctor", value: true },
          ].map((role) => (
            <button
              key={role.label}
              type="button"
              onClick={() => setFormData({ ...formData, isDoctor: role.value })}
              className={`px-3 sm:px-4 md:px-6 cursor-pointer py-1.5 sm:py-2 text-sm sm:text-base rounded-full font-medium transition-colors duration-300 ${formData.isDoctor === role.value ? "bg-emerald-600 text-white shadow-md" : "bg-white text-gray-700 border border-gray-300 hover:bg-emerald-50"}`}
            >
              {role.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-5 md:space-y-6"
        >
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative group">
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-emerald-500 shadow-lg bg-gray-100">
                {profileImagePreview ? (
                  <img
                    src={profileImagePreview}
                    alt="Profile Preview"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-100 to-green-100">
                    <FaUser className="text-4xl sm:text-5xl text-emerald-600" />
                  </div>
                )}
              </div>
              
              {/* Camera Icon Button */}
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-emerald-700 transition-all duration-200 border-4 border-white group-hover:scale-110"
              >
                <FaCamera className="text-white text-sm sm:text-base" />
                <input
                  id="profileImage"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImageChange}
                />
              </label>

              {/* Remove button */}
              {profileImagePreview && (
                <button
                  type="button"
                  onClick={removeProfileImage}
                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-md hover:bg-red-600 transition-all duration-200 text-white text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-3 text-center">
              {profileImagePreview ? 'Click camera icon to change' : 'Click camera icon to upload profile picture'}
            </p>
          </div>

          {/* Name */}
          <div className="relative">
            <label
              className={`absolute left-3 sm:left-4 transition-all duration-300 pointer-events-none ${isFocused.name || formData.name ? "top-0.5 sm:top-1 text-[10px] sm:text-xs text-emerald-600 font-medium" : "top-2.5 sm:top-3 text-gray-500 text-xs sm:text-sm"}`}
            >
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onFocus={() => handleFocus("name")}
              onBlur={() => handleBlur("name")}
              onChange={(e) => handleChange("name", e.target.value)}
              className="w-full pt-5 sm:pt-6 pb-1.5 sm:pb-2 px-3 sm:px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-white/90 text-gray-800 text-sm sm:text-base rounded-none"
              required
            />
          </div>

          {/* Age */}
          <div className="relative">
            <label
              className={`absolute left-3 sm:left-4 transition-all duration-300 pointer-events-none ${isFocused.age || formData.age ? "top-0.5 sm:top-1 text-[10px] sm:text-xs text-emerald-600 font-medium" : "top-2.5 sm:top-3 text-gray-500 text-xs sm:text-sm"}`}
            >
              Age
            </label>
            <input
              type="number"
              value={formData.age}
              onFocus={() => handleFocus("age")}
              onBlur={() => handleBlur("age")}
              onChange={(e) => handleChange("age", e.target.value)}
              className="w-full pt-5 sm:pt-6 pb-1.5 sm:pb-2 px-3 sm:px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-white/90 text-gray-800 text-sm sm:text-base rounded-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              className={`absolute left-3 sm:left-4 transition-all duration-300 pointer-events-none ${isFocused.password || formData.password ? "top-0.5 sm:top-1 text-[10px] sm:text-xs text-emerald-600 font-medium" : "top-2.5 sm:top-3 text-gray-500 text-xs sm:text-sm"}`}
            >
              Password
            </label>
            <input
              type={showPassword.password ? "text" : "password"}
              value={formData.password}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              onChange={(e) => handleChange("password", e.target.value)}
              className="w-full pt-5 sm:pt-6 pb-1.5 sm:pb-2 px-3 sm:px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-white/90 text-gray-800 text-sm sm:text-base rounded-none pr-14 sm:pr-16"
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  password: !showPassword.password,
                })
              }
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 focus:outline-none text-xs sm:text-sm"
            >
              {showPassword.password ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              className={`absolute left-3 sm:left-4 transition-all duration-300 pointer-events-none ${isFocused.confirmPassword || formData.confirmPassword ? "top-0.5 sm:top-1 text-[10px] sm:text-xs text-emerald-600 font-medium" : "top-2.5 sm:top-3 text-gray-500 text-xs sm:text-sm"}`}
            >
              Confirm Password
            </label>
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onFocus={() => handleFocus("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className="w-full pt-5 sm:pt-6 pb-1.5 sm:pb-2 px-3 sm:px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-white/90 text-gray-800 text-sm sm:text-base rounded-none pr-14 sm:pr-16"
              required
            />
            <button
              type="button"
              onClick={() =>
                setShowPassword({
                  ...showPassword,
                  confirmPassword: !showPassword.confirmPassword,
                })
              }
              className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 focus:outline-none text-xs sm:text-sm"
            >
              {showPassword.confirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Gender */}
          <div className="relative">
            <label
              htmlFor="gender"
              className="absolute left-3 sm:left-4 transition-all duration-300 pointer-events-none top-0.5 sm:top-1 text-[10px] sm:text-xs text-emerald-600 font-medium"
            >
              Gender
            </label>
            <select
              id="gender"
              value={formData.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full pt-5 sm:pt-6 pb-1.5 sm:pb-2 px-3 sm:px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-white/90 text-gray-800 text-sm sm:text-base rounded-none"
              required
            >
              <option value="" disabled>
                Select gender
              </option>
              {genderOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Height */}
          <div className="relative">
            <label
              className={`absolute left-3 sm:left-4 transition-all duration-300 pointer-events-none ${isFocused.height || formData.height ? "top-0.5 sm:top-1 text-[10px] sm:text-xs text-emerald-600 font-medium" : "top-2.5 sm:top-3 text-gray-500 text-xs sm:text-sm"}`}
            >
              Height (cm)
            </label>
            <input
              type="number"
              value={formData.height}
              onFocus={() => handleFocus("height")}
              onBlur={() => handleBlur("height")}
              onChange={(e) => handleChange("height", e.target.value)}
              className="w-full pt-5 sm:pt-6 pb-1.5 sm:pb-2 px-3 sm:px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-white/90 text-gray-800 text-sm sm:text-base rounded-none"
              required
            />
          </div>

          {/* Weight */}
          <div className="relative">
            <label
              className={`absolute left-3 sm:left-4 transition-all duration-300 pointer-events-none ${isFocused.weight || formData.weight ? "top-0.5 sm:top-1 text-[10px] sm:text-xs text-emerald-600 font-medium" : "top-2.5 sm:top-3 text-gray-500 text-xs sm:text-sm"}`}
            >
              Weight (kg)
            </label>
            <input
              type="number"
              value={formData.weight}
              onFocus={() => handleFocus("weight")}
              onBlur={() => handleBlur("weight")}
              onChange={(e) => handleChange("weight", e.target.value)}
              className="w-full pt-5 sm:pt-6 pb-1.5 sm:pb-2 px-3 sm:px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-white/90 text-gray-800 text-sm sm:text-base rounded-none"
              required
            />
          </div>

          {/* Dosha */}
          <div className="relative">
            <label
              htmlFor="dosha"
              className="absolute left-3 sm:left-4 transition-all duration-300 pointer-events-none top-0.5 sm:top-1 text-[10px] sm:text-xs text-emerald-600 font-medium"
            >
              Dosha
            </label>
            <select
              id="dosha"
              value={formData.dosha}
              onChange={(e) => handleChange("dosha", e.target.value)}
              className="w-full pt-5 sm:pt-6 pb-1.5 sm:pb-2 px-3 sm:px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-white/90 text-gray-800 text-sm sm:text-base rounded-none"
              required
            >
              <option value="" disabled>
                Select your dosha
              </option>
              {doshaOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Doctor-only Fields */}
          {formData.isDoctor && (
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Specialization */}
              <div className="relative">
                <label
                  htmlFor="specialization"
                  className="absolute left-3 sm:left-4 transition-all duration-300 pointer-events-none top-0.5 sm:top-1 text-[10px] sm:text-xs text-emerald-600 font-medium"
                >
                  Specialization
                </label>
                <select
                  id="specialization"
                  value={formData.specialization}
                  onChange={(e) =>
                    handleChange("specialization", e.target.value)
                  }
                  className="w-full pt-5 sm:pt-6 pb-1.5 sm:pb-2 px-3 sm:px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-white/90 text-gray-800 text-sm sm:text-base rounded-none"
                  required
                >
                  <option value="" disabled>
                    Select your specialization
                  </option>
                  {doctorOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div className="relative">
                <label
                  className={`absolute left-3 sm:left-4 transition-all duration-300 pointer-events-none ${isFocused.experience || formData.experience ? "top-0.5 sm:top-1 text-[10px] sm:text-xs text-emerald-600 font-medium" : "top-2.5 sm:top-3 text-gray-500 text-xs sm:text-sm"}`}
                >
                  Experience (years)
                </label>
                <input
                  type="number"
                  value={formData.experience}
                  onFocus={() => handleFocus("experience")}
                  onBlur={() => handleBlur("experience")}
                  onChange={(e) => handleChange("experience", e.target.value)}
                  className="w-full pt-5 sm:pt-6 pb-1.5 sm:pb-2 px-3 sm:px-4 border-0 border-b-2 border-gray-200 focus:border-emerald-500 outline-none bg-white/90 text-gray-800 text-sm sm:text-base rounded-none"
                  required
                />
              </div>

              {/* Certificate Upload */}
              <div>
                <label className="block text-gray-700 font-medium mb-2 text-xs sm:text-sm">
                  Upload Certificate/Document
                </label>

                <label className="flex items-center justify-center w-full sm:w-fit px-4 py-2 bg-green-600 text-white rounded-lg cursor-pointer hover:bg-green-700 transition text-xs sm:text-sm">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*,.pdf"
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        certificate: e.target.files[0],
                      })
                    }
                  />
                </label>

                {formData.certificate && (
                  <div className="mt-2 p-2 bg-gray-50 rounded-md border">
                    <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                      <span className="truncate text-neutral-950">
                        {formData.certificate.name}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, certificate: null })
                        }
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

         {/* Terms & Submit */}
<div className="flex flex-col gap-2 sm:gap-3 mt-6 sm:mt-8">

  <label className="flex items-center cursor-pointer text-xs sm:text-sm">
    <div className="relative">
      <input
        type="checkbox"
        checked={termsChecked}
        onChange={(e) => setTermsChecked(e.target.checked)}
        className="peer sr-only"
      />

      <div className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-colors">
        <svg
          className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="3"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>
    </div>

    <span className="ml-2">
      I accept the{" "}
      <a
        href="/terms"
        className="text-emerald-600 font-medium hover:text-emerald-700"
      >
        Terms & Conditions
      </a>
    </span>
  </label>   {/* ✅ LABEL CLOSED */}

  {/* SUBMIT BUTTON */}
  <button
    type="submit"
    disabled={isLoading}
    className="w-full cursor-pointer py-2.5 sm:py-3 md:py-3.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-semibold rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed text-sm sm:text-base"
  >
    {isLoading ? "Signing up..." : "Sign Up"}
  </button>

</div>

        </form>

         {/* Extra Links */}
        <p className="text-center text-xs sm:text-sm text-gray-600 mt-4 sm:mt-6">
          Already have an account?{" "}
          <a
            href="/signin"
            className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors focus:outline-none focus:underline"
          >
            Sign In
          </a>
        </p>

      </div>   {/* ✅ CLOSE CARD DIV */}

      {/* Floating animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.05); opacity: 0.4; }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>

    </div>  
  );
};

export default SignUp;