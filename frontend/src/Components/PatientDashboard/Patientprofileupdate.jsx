import React, { useState } from "react";
import { User, Phone, Calendar, Ruler, Weight, Camera, Upload, X, Check } from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { updateProfile } from "../../feature/Patient/patient.thunk";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PatientProfileUpdate = ({ setActiveTab }) => {
  const dispatch = useDispatch();
  const navigate=useNavigate()

  const { loading } = useSelector((state) => state.patient);

  const storedUser = JSON.parse(localStorage.getItem("user")) || {};

  const [formData, setFormData] = useState({
    Name: storedUser?.Name || "",
    PhoneNumber: storedUser?.PhoneNumber || "",
    Age: storedUser?.Age || "",
    Height: storedUser?.Height || "",
    Weight: storedUser?.Weight || "",
    profileImage:storedUser?.Image_url
  });

  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(storedUser?.Image_url || null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setProfileImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = "Name is required";
    }

    if (!formData.PhoneNumber.toString().trim()) {
      newErrors.PhoneNumber = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.PhoneNumber)) {
      newErrors.PhoneNumber = "Phone number must be 10 digits";
    }

    if (!formData.Age) {
      newErrors.Age = "Age is required";
    } else if (formData.Age < 0 || formData.Age > 150) {
      newErrors.Age = "Please enter a valid age";
    }

    if (!formData.Height) {
      newErrors.Height = "Height is required";
    } else if (formData.Height < 50 || formData.Height > 250) {
      newErrors.Height = "Please enter a valid height (50-250 cm)";
    }

    if (!formData.Weight) {
      newErrors.Weight = "Weight is required";
    } else if (formData.Weight < 20 || formData.Weight > 300) {
      newErrors.Weight = "Please enter a valid weight (20-300 kg)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const form = new FormData();

      form.append("Name", formData.Name);
      form.append("PhoneNumber", formData.PhoneNumber);
      form.append("Age", formData.Age);
      form.append("Height", formData.Height);
      form.append("Weight", formData.Weight);

      if (profileImage) {
        form.append("profileImage", profileImage);
      }

      const response = await dispatch(updateProfile(form)).unwrap();
      console.log(response);
      localStorage.setItem("user", JSON.stringify(response.user));
      toast.success("Profile updated successfully!");
       if (setActiveTab) {
    setTimeout(() => {
      setActiveTab("patients");  
    }, 1000);
  }

    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error?.message || "Failed to update profile. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputFields = [
    {
      name: "Name",
      label: "Full Name",
      type: "text",
      icon: User,
      placeholder: "Enter your full name",
    },
    {
      name: "PhoneNumber",
      label: "Phone Number",
      type: "tel",
      icon: Phone,
      placeholder: "Enter 10-digit phone number",
    },
    {
      name: "Age",
      label: "Age",
      type: "number",
      icon: Calendar,
      placeholder: "Enter your age",
      suffix: "years",
    },
    {
      name: "Height",
      label: "Height",
      type: "number",
      icon: Ruler,
      placeholder: "Enter height",
      suffix: "cm",
    },
    {
      name: "Weight",
      label: "Weight",
      type: "number",
      icon: Weight,
      placeholder: "Enter weight",
      suffix: "kg",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
         
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Update Your Profile
          </h1>
          <p className="text-gray-600">
            Keep your health information up to date
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
          <div className="h-2 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500"></div>

          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-6">
            
              <div className="flex flex-col items-center mb-10 space-y-6">
               
                <div className="relative group">
             
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-300 animate-pulse"></div>
                  
                  <div className="relative">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-white border-4 border-white shadow-xl">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <User className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                    </div>

                    <label className="absolute bottom-2 right-2 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 group">
                      <Camera className="w-6 h-6 text-white" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      
                      {/* Tooltip */}
                      <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Change photo
                      </span>
                    </label>

                    {/* Success Checkmark (shown when image is uploaded) */}
                
                  </div>
                </div>

                {/* Upload/Remove Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  {/* Upload Button */}
                  <label className="flex-1 group cursor-pointer">
                    <div className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-200 transform hover:-translate-y-0.5">
                      <Upload className="w-5 h-5" />
                      <span>Upload Photo</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>

                  {/* Remove Button */}
                  {preview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-300 text-red-600 font-semibold rounded-xl shadow-md hover:bg-red-50 hover:border-red-400 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                      <X className="w-5 h-5" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>

                {/* Upload Guidelines */}
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Recommended: Square image, at least 400x400px
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG or GIF • Max size 5MB
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    Personal Information
                  </span>
                </div>
              </div>

              {/* Form Fields */}
              {inputFields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.name} className="group">
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      {field.label}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Icon
                          className={`h-5 w-5 transition-colors ${
                            errors[field.name]
                              ? "text-red-400"
                              : "text-gray-400 group-focus-within:text-green-500"
                          }`}
                        />
                      </div>
                      <input
                        type={field.type}
                        id={field.name}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={`
                          w-full pl-12 ${field.suffix ? 'pr-16' : 'pr-4'} py-3.5 rounded-xl border-2 transition-all
                          text-gray-900 placeholder-gray-400
                          focus:outline-none focus:ring-4 focus:ring-green-100
                          ${
                            errors[field.name]
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-green-500"
                          }
                        `}
                      />
                      {field.suffix && (
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                          <span className="text-sm font-medium text-gray-500">
                            {field.suffix}
                          </span>
                        </div>
                      )}
                    </div>
                    {errors[field.name] && (
                      <p className="mt-2 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="flex-1 py-3.5 px-6 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all focus:outline-none focus:ring-4 focus:ring-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 px-6 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold hover:from-green-600 hover:to-emerald-700 transition-all focus:outline-none focus:ring-4 focus:ring-green-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Your information is secure and will only be used for healthcare purposes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileUpdate;