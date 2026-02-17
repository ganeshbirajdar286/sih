import { createSlice } from "@reduxjs/toolkit";
import { myPatient } from "./doctor.thunk";

const initialState = {
  loading: false,
  error: null,
  appointment: [],
};

const doctorSlice = createSlice({
  name: "Doctors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(myPatient.pending, (state) => {
        console.log("pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(myPatient.fulfilled, (state, action) => {
        console.log("fulfilled");
        state.loading = false;
        state.appointment = action.payload?.patient || [];
      })
      .addCase(myPatient.rejected, (state, action) => {
        console.log("rejected");
        state.loading = false;
        state.error = action.payload?.message || "Error fetching patients";
      });
  },
});

export default doctorSlice.reducer;