import { createSlice } from "@reduxjs/toolkit";

import {
  Paymentgateway,
  PaymentSuccessThunk,
  PaymentCancelThunk,
} from "./Payment.thunk";

const initialState = {
  loading: false,

  checkout_url: null,

  paymentData: null,

  paymentSuccess: false,

  paymentCancelled: false,

  error: null,
};

const paymentSlice = createSlice({
  name: "payment",

  initialState,

  reducers: {
    resetPaymentState: (state) => {
      state.loading = false;

      state.checkout_url = null;

      state.paymentData = null;

      state.paymentSuccess = false;

      state.paymentCancelled = false;

      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder



      // ========================
      // CREATE PAYMENT
      // ========================

      .addCase(
        Paymentgateway.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        Paymentgateway.fulfilled,
        (state, action) => {
          state.loading = false;

          state.checkout_url =
            action.payload.checkout_url;

          state.paymentData =
            action.payload;
        }
      )

      .addCase(
        Paymentgateway.rejected,
        (state, action) => {
          state.loading = false;

          state.error = action.payload;
        }
      )



      // ========================
      // PAYMENT SUCCESS
      // ========================

      .addCase(
        PaymentSuccessThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        PaymentSuccessThunk.fulfilled,
        (state, action) => {
          state.loading = false;

          state.paymentSuccess = true;

          state.paymentData =
            action.payload;
        }
      )

      .addCase(
        PaymentSuccessThunk.rejected,
        (state, action) => {
          state.loading = false;

          state.error = action.payload;
        }
      )



      // ========================
      // PAYMENT CANCEL
      // ========================

      .addCase(
        PaymentCancelThunk.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        PaymentCancelThunk.fulfilled,
        (state, action) => {
          state.loading = false;

          state.paymentCancelled = true;

          state.paymentData =
            action.payload;
        }
      )

      .addCase(
        PaymentCancelThunk.rejected,
        (state, action) => {
          state.loading = false;

          state.error = action.payload;
        }
      );
  },
});

export const { resetPaymentState } =
  paymentSlice.actions;

export default paymentSlice.reducer;