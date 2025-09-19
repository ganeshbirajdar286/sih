import React, { useState } from "react";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
  const [termsChecked, setTermsChecked] = useState(false);

  const handleFocus = (field) => setIsFocused({ ...isFocused, [field]: true });
  const handleBlur = (field) => setIsFocused({ ...isFocused, [field]: false });

  const handleChange = (field, value) => setFormData({ ...formData, [field]: value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!termsChecked) return alert("Please accept Terms & Conditions");
    if (formData.password !== formData.confirmPassword) return alert("Passwords do not match!");
    
    setIsLoading(true);
    setTimeout(() => {
      console.log("Sign Up:", formData);
      setIsLoading(false);
    }, 1500);
  };

  const handleDemoSignup = () => {
    setFormData({
      name: "Demo User",
      email: "demo@ayurdietcare.com",
      password: "demopassword",
      confirmPassword: "demopassword",
    });
    setTermsChecked(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50/70 via-amber-50/50 to-white px-4 relative overflow-hidden">
      
      {/* Animated Background */}
      <div className="absolute top-[10%] left-[5%] w-24 h-24 bg-emerald-200 rounded-full blur-3xl opacity-30 animate-float"></div>
      <div className="absolute top-[60%] left-[70%] w-32 h-32 bg-amber-200 rounded-full blur-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] left-[80%] w-20 h-20 bg-green-200 rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>

      {/* Card */}
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
        
        {/* Top Border */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-t-3xl"></div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-lg mb-4 transform transition-transform duration-500 hover:scale-105 hover:rotate-3">
            <span className="text-4xl text-white">🌿</span>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-800 bg-clip-text text-transparent">
            AyurDietCare
          </h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">Create an account to start your wellness journey</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div className="relative">
            <input
              type="text"
              id="name"
              value={formData.name}
              onFocus={() => handleFocus("name")}
              onBlur={() => handleBlur("name")}
              onChange={(e) => handleChange("name", e.target.value)}
              className="peer w-full pt-6 pb-2 px-4 border-0 border-b-2 border-gray-300 focus:border-emerald-500 focus:ring-0 outline-none bg-white/90 text-gray-800 rounded-none font-medium"
              required
            />
            <label
              htmlFor="name"
              className={`absolute left-4 top-3 text-gray-400 text-sm transition-all duration-300 pointer-events-none
                ${isFocused.name || formData.name ? "top-1 text-xs text-emerald-600 font-bold" : ""}
              `}
            >
              Full Name
            </label>
          </div>

          {/* Email */}
          <div className="relative">
            <input
              type="email"
              id="email"
              value={formData.email}
              onFocus={() => handleFocus("email")}
              onBlur={() => handleBlur("email")}
              onChange={(e) => handleChange("email", e.target.value)}
              className="peer w-full pt-6 pb-2 px-4 border-0 border-b-2 border-gray-300 focus:border-emerald-500 focus:ring-0 outline-none bg-white/90 text-gray-800 rounded-none font-medium"
              required
            />
            <label
              htmlFor="email"
              className={`absolute left-4 top-3 text-gray-400 text-sm transition-all duration-300 pointer-events-none
                ${isFocused.email || formData.email ? "top-1 text-xs text-emerald-600 font-bold" : ""}
              `}
            >
              Email
            </label>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword.password ? "text" : "password"}
              id="password"
              value={formData.password}
              onFocus={() => handleFocus("password")}
              onBlur={() => handleBlur("password")}
              onChange={(e) => handleChange("password", e.target.value)}
              className="peer w-full pt-6 pb-2 px-4 pr-10 border-0 border-b-2 border-gray-300 focus:border-emerald-500 focus:ring-0 outline-none bg-white/90 text-gray-800 rounded-none font-medium"
              required
            />
            <label
              htmlFor="password"
              className={`absolute left-4 top-3 text-gray-400 text-sm transition-all duration-300 pointer-events-none
                ${isFocused.password || formData.password ? "top-1 text-xs text-emerald-600 font-bold" : ""}
              `}
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword({ ...showPassword, password: !showPassword.password })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 focus:outline-none"
            >
              {showPassword.password ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <input
              type={showPassword.confirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={formData.confirmPassword}
              onFocus={() => handleFocus("confirmPassword")}
              onBlur={() => handleBlur("confirmPassword")}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              className="peer w-full pt-6 pb-2 px-4 pr-10 border-0 border-b-2 border-gray-300 focus:border-emerald-500 focus:ring-0 outline-none bg-white/90 text-gray-800 rounded-none font-medium"
              required
            />
            <label
              htmlFor="confirmPassword"
              className={`absolute left-4 top-3 text-gray-400 text-sm transition-all duration-300 pointer-events-none
                ${isFocused.confirmPassword || formData.confirmPassword ? "top-1 text-xs text-emerald-600 font-bold" : ""}
              `}
            >
              Confirm Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword({ ...showPassword, confirmPassword: !showPassword.confirmPassword })}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-600 focus:outline-none"
            >
              {showPassword.confirmPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Terms & Conditions */}
          <label className="flex items-center cursor-pointer text-sm">
            <input
              type="checkbox"
              checked={termsChecked}
              onChange={(e) => setTermsChecked(e.target.checked)}
              className="mr-2 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
            />
            I accept the <a href="/terms" className="text-emerald-600 font-medium hover:text-emerald-700">Terms & Conditions</a>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-green-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>

          {/* Demo */}
          <button
            type="button"
            onClick={handleDemoSignup}
            className="w-full py-3 border border-emerald-500 text-emerald-600 font-medium rounded-xl hover:bg-emerald-50 transition-colors duration-300"
          >
            Try Demo Account
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="mx-4 text-gray-400 text-sm">or continue with</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Social Sign-in */}
        <button className="w-full py-3 flex justify-center items-center bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors font-medium text-gray-700">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Extra Links */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/signin" className="text-emerald-600 font-semibold hover:text-emerald-700">Sign in</a>
        </p>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
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
