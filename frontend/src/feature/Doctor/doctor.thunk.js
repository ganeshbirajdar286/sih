import toast from "react-hot-toast";
import { axiosInstance } from "../../axios/url.axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const bookedAppointments=createAsyncThunk(
    "doctor/appointment",async(_,{rejectWithValue})=>{
        try {
            const response = await axiosInstance.get("/doctor/mypatient");
            return response.data
        } catch (error) {
             console.error(error);
      return rejectWithValue(error.response?.data || error.message);
        }
    }
)
export const myPatient =createAsyncThunk(
    "doctor/mypatient",async(_,{rejectWithValue})=>{
       try {
         const response =await axiosInstance.get("/doctor/mypatient");
        return response.data;
       } catch (error) {
          console.error(error);
      return rejectWithValue(error.response?.data || error.message);
       }
    }
)

export const Cancel_appointments = createAsyncThunk(
  "doctor/cancel_appoinments",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/doctor/deleteappointment/${id}`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const single_patient=createAsyncThunk(
    "doctor/singlePatient",
    async(id,{rejectWithValue})=>{
        try {
            const response =await axiosInstance.get(`/doctor/patient/${id}`);
           return response.data; 
        } catch (error) {
             console.error(error);
      return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)
export const conformationappointment =createAsyncThunk(
  "doctor/conformationappointment",
   async({id,Status},{rejectWithValue})=>{
        try {
          console.log(id,Status);
            const response =await axiosInstance.post(`/doctor/appointment/${id}`,{Status});
           return response.data; 
        } catch (error) {
             console.error(error);
      return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
)
export const getDietchart=createAsyncThunk(
  "doctor/getdietchart",async(_,{rejectWithValue})=>{
   try {
     const response=await axiosInstance.get("/doctor/getdietchart");
    return  response.data
   } catch (error) {
    console.error(error);
      return rejectWithValue(error.response?.data?.message || error.message);
   }
  }
)
export const createDietChart=createAsyncThunk(
  "doctor/createdietchart",async(form,{rejectWithValue})=>{
    try {
      const response=axiosInstance.post("/doctor/dietchart",form);
      return (await response).data
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }

  }
)
export const profileUpdate = createAsyncThunk(
  "doctor/profileupdate",
  async (form, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/update/doctorprofile",
        form
      );

      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
export const profile = createAsyncThunk(
  "doctor/profile",
  async (_,{ rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        "/doctor/profile",
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
 