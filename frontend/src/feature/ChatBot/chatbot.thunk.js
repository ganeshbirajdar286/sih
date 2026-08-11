import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../axios/url.axios";

export const ChatBot = createAsyncThunk(
  "chatbot/chat",
  async (question, { rejectWithValue }) => {
    try {
      // Handle both string and object parameter formats safely
      const payload = typeof question === "string" 
        ? { question: question, message: question } 
        : question;
      const response = await axiosInstance.post("/chatbot/chat", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message || "Failed to communicate with ChatBot");
    }
  }
);
