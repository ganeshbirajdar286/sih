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

export const delete_report = createAsyncThunk(
  "patient/delete_report",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `/patientreport/${id}`
      );
    toast.success("report deleted successfully!!");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        toast.error("report not found "),
        error.response?.data || error.message
      );
    }
  }
);



