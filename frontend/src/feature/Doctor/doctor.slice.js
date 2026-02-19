import { createSlice } from "@reduxjs/toolkit";
import { myPatient, Cancel_appointments,single_patient, conformationappointment} from "./doctor.thunk";

const initialState = {
  loading: false,
  error: null,
  appointment: [],
  cancelAppointments: null,
  singlePatient:null,
  statusappointment:null,
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

    // Cancel_appointments
    builder.addCase(Cancel_appointments.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.loading = false;
      state.cancel = action.payload.success;
      state.cancelAppointments = action.payload.patient;
    });
    builder.addCase(Cancel_appointments.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(Cancel_appointments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // single_patient

    builder
      .addCase(single_patient.pending, (state) => {
        state.loading = true;
      })
      .addCase(single_patient.fulfilled, (state, action) => {
        state.loading = false;
        state.singlePatient = action.payload.patient;
      })
      .addCase(single_patient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      // update appointment status
       builder
      .addCase(conformationappointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(conformationappointment.fulfilled, (state, action) => {
        state.loading = false;
        state.statusappointment = action.payload.patient;
      })
      .addCase(conformationappointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default doctorSlice.reducer;
