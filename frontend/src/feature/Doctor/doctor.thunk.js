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