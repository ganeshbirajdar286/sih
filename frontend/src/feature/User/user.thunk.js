import { axiosInstance } from "../../axios/url.axios";
import { createAsyncThunk,  } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const loginThunk=createAsyncThunk("users/login",async({ Email,Password},{rejectWithValue})=>{
    try {
        const response=await axiosInstance.post("/login",{
            Email,Password
        })
          toast.success('Successfully login!');
     return response.data
    } catch (error) {
         console.error(error)
      toast.error( "name or password is wrong")
      return rejectWithValue(error)
    }
})


// user.thunk.js
export const registerThunk = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      formData.append("Name", userData.Name);
      formData.append("Password", userData.Password);
      formData.append("Email",userData.Email);
      formData.append("Age", userData.Age);
      formData.append("Height", userData.Height);
      formData.append("Weight", userData.Weight);
      formData.append("Gender", userData.Gender);
      formData.append("isDoctor", userData.isDoctor);
      if (userData.profileImage) {
        formData.append("profileImage", userData.profileImage);
      }
      if (userData.isDoctor) {
        formData.append("Specialization", userData.Specialization);
        formData.append("Experience", userData.Experience);
        
        if (userData.certificate) {
          formData.append("certificate", userData.certificate);
        }
      }

      const response = await axiosInstance.post("/register", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);



  export const logoutThunk = createAsyncThunk(
  "users/logout",
  async () => {
    await axiosInstance.post("/logout");

    localStorage.removeItem("user");

    toast.dismiss(); // remove old toasts
    toast.success("Logout successfully");

    return true;
  }
);

export const getDoshaStatusThunk=createAsyncThunk(
  "user/getDoshaStatusThunk",async(_,{rejectWithValue})=>{
    try {
      const response=await axiosInstance.get("/status");
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
)

export const submitDoshaThunk=createAsyncThunk(
  "user/submitDoshaThunk",async(payload,{rejectWithValue})=>{
    try {
      const response=await axiosInstance.post("/submit",payload);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
)