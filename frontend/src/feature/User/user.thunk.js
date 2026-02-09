import { axiosInstance } from "../../axios/url.axios";
import { createAsyncThunk,  } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const loginThunk=createAsyncThunk("users/login",async({Name,Password},{rejectWithValue})=>{
    try {
        const response=await axiosInstance.post("/login",{
            Name,Password
        })
          toast.success('Successfully login!');
     return response.data
    } catch (error) {
         console.error(error)
      toast.error( "name or password is wrong")
      return rejectWithValue(error)
    }
})


export const registerThunk = createAsyncThunk(
  "users/register",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("Name", data.Name);
      formData.append("Password", data.Password);
      formData.append("Age", data.Age);
      formData.append("Height", data.Height);
      formData.append("Weight", data.Weight);
      formData.append("Gender", data.Gender);
      formData.append("Dosha", data.Dosha);
      formData.append("isDoctor", data.isDoctor);
      formData.append("Specialization", data.Specialization);

      // ✅ ADD THIS
      formData.append("Experience", data.Experience);

      // File
      formData.append("media", data.media);

      const response = await axiosInstance.post(
        "/register",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Account created successfully!");
      return response.data;

    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
        "User already exists"
      );

      return rejectWithValue(
        error?.response?.data || error.message
      );
    }
  }
);


  //  export const logoutThunk = createAsyncThunk(
  //   'users/logout',
  //   async (_,{rejectWithValue}) => {
  //    try {
  //     const response =await axiosInstance.post("/logout")
  //        localStorage.removeItem("user");
  //        toast.success('logout Successfully!!!!!');
  //    return true
  //   } catch (error) {
  //     console.error(error.message)
  //     toast.error( error.response?.data?.message||"logout failed " )
  //     return rejectWithValue(error)
  //    }
  //   },
  // )


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
