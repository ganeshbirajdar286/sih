import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

import { axiosInstance } from "../../axios/url.axios";



// CREATE PAYMENT
export const Paymentgateway = createAsyncThunk(
  "payment/one-time-payment",

  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/checkout/one_time_payment",
        formData
      );

      toast.success("Redirecting to payment...");

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message;

      toast.error(message);

      return rejectWithValue(message);
    }
  }
);



// PAYMENT SUCCESS
export const PaymentSuccessThunk =
  createAsyncThunk(
    "payment/payment-success",

    async (session_id, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(
          "/checkout/payment-success",
          { session_id }
        );

        toast.success("Payment successful");

        return response.data;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message;

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );



// PAYMENT CANCEL
export const PaymentCancelThunk =
  createAsyncThunk(
    "payment/payment-cancel",

    async (session_id, { rejectWithValue }) => {
      try {
        const response = await axiosInstance.post(
          "/checkout/payment-cancel",
          { session_id }
        );

        toast.error("Payment cancelled");

        return response.data;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          error.message;

        toast.error(message);

        return rejectWithValue(message);
      }
    }
  );