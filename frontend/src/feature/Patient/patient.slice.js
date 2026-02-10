import { createSlice } from "@reduxjs/toolkit";
import {
  BookingAppointments,
  doctor,
  getDoctorBookedSlots,
  getSingleDoctor,
} from "./patient.thunk";

const initialState = {
  doctor: [],
  singleDoctor: null,
  BookAppointments: [],
  loading: false,
  error: null,
  bookedSlot: [],
};

const PatientSlice = createSlice({
  name: "patients",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //all doctor
    builder.addCase(doctor.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.loading = false;
      state.doctor = action.payload?.data || [];
    });
    builder.addCase(doctor.pending, (state, action) => {
      console.log("pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(doctor.rejected, (state, action) => {
      console.log("rejected");
      state.loading = false;
      state.error = action.payload?.message || "Error fetching doctors";
    });

    // single doctor
    builder.addCase(getSingleDoctor.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getSingleDoctor.fulfilled, (state, action) => {
      state.loading = false;
      state.singleDoctor = action.payload;
    });
    builder.addCase(getSingleDoctor.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    //getDoctorBookedSlots
    builder.addCase(getDoctorBookedSlots.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.loading = false;
      state.bookedSlot = action.payload?.patient || [];
    });
    builder.addCase(getDoctorBookedSlots.pending, (state, action) => {
      console.log("pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getDoctorBookedSlots.rejected, (state, action) => {
      console.log("rejected");
      state.loading = false;
      state.error = action.payload?.message || "Error fetching doctors";
    });

    //bookingAppointments
    builder.addCase(BookingAppointments.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.loading = false;
      state.BookAppointments.push(action.payload.appointment);
    });
    builder.addCase(BookingAppointments.pending, (state, action) => {
      console.log("pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(BookingAppointments.rejected, (state, action) => {
      console.log("rejected");
      state.loading = false;
      state.error = action.payload?.message || "Error fetching doctors";
    });
  },
});

export const {} = PatientSlice.actions;

export default PatientSlice.reducer;
