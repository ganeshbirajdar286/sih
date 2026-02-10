import toast from "react-hot-toast";
import { axiosInstance } from "../../axios/url.axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const patient_report = createAsyncThunk(
  "patient/report",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/report/patient", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("report created successfully!!");
      return response.data;
    } catch (error) {
      console.error(error);
      toast.error("Title or Category or media is wrong");
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const doctor = createAsyncThunk(
  "patient/doctor",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/patient/doctor");
      return response.data;
    } catch (error) {
      console.error(error);
      toast.error("no doctor found!");
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const delete_report = createAsyncThunk(
  "patient/delete_report",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/patientreport/${id}`);
      toast.success("report deleted successfully!!");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        toast.error("report not found "),
        error.response?.data || error.message,
      );
    }
  },
);


export const getSingleDoctor = createAsyncThunk(
  "patient/getSingleDoctor",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/patient/singledoctor/${id}`  
      );

      return response.data;

    } catch (error) {
      toast.error("Failed to load doctor profile ❌");

      return rejectWithValue(
        error.response?.data?.message ||
        error.message
      );
    }
  }
);

export const BookingAppointments = createAsyncThunk(
  "patient/bookAppointments",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/appointment/patient/${id}`,
        data
      );

      toast.success("Appointment booked successfully ✅");

      return response.data;

    } catch (error) {
      toast.error("Booking appointment failed ❌");

      return rejectWithValue(
        error.response?.data?.message ||
        error.message
      );
    }
  }
);

export const getDoctorBookedSlots = createAsyncThunk(
  "patient/getDoctorBookedSlots",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/patient/appointments/${id}`
      );

      return response.data;

    } catch (error) {
      console.error(error);

      return rejectWithValue(
        error.response?.data?.message ||
        error.message
      );
    }
  }
);




