import { createSlice } from "@reduxjs/toolkit";
import {
  BookingAppointments,
  doctor,
  getDoctorBookedSlots,
  getSingleDoctor,
  getappointmentschedule,
  RescheduleAppointment,
  Cancel_appointments,
  getReport,
  getDosha
} from "./patient.thunk";

const initialState = {
  doctor: [],
  singleDoctor: null,
  BookAppointments: [],
  loading: false,
  error: null,
  bookedSlot: [],
  getappointmentschedules: [],
  RescheduleAppointment: null,
  cancel: Boolean,
  cancelAppointments: null,
  medicalreport:[],
  dosha:null
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

    //getappointmentschedule
    builder.addCase(getappointmentschedule.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.loading = false;
      state.getappointmentschedules = action.payload.appointment || [];
    });
    builder.addCase(getappointmentschedule.pending, (state, action) => {
      console.log("pending");
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getappointmentschedule.rejected, (state, action) => {
      console.log("rejected");
      state.loading = false;
      state.error = action.payload?.message || "appointment not found ";
    });

    //RescheduleAppointment
    builder
      .addCase(RescheduleAppointment.pending, (state) => {
        console.log("pending");
        state.loading = true;
        state.error = null;
      })
      .addCase(RescheduleAppointment.fulfilled, (state, action) => {
        console.log("fulfilled");
        state.loading = false;

        const updated = action.payload.UpdatedAppointment;

        state.RescheduleAppointment = updated;

        // Update the appointment in the getappointmentschedules array
        state.getappointmentschedules = state.getappointmentschedules.map(
          (appt) => (appt._id === updated._id ? updated : appt),
        );
      })
      .addCase(RescheduleAppointment.rejected, (state, action) => {
        console.log("rejected");
        state.loading = false;
        state.error = action.payload || "Appointment not found";
      });

    // Cancel_appointments
    builder.addCase(Cancel_appointments.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.loading = false;
      state.cancel = action.payload.success;
      state.cancelAppointments = action.payload.data;

      // FIX: Remove the deleted appointment from the UI list immediately
      const deletedId = action.payload.data._id;
      state.getappointmentschedules = state.getappointmentschedules.filter(
        (appt) => appt._id !== deletedId,
      );
    })
    builder.addCase(Cancel_appointments.pending, (state) => {
        state.loading = true;
      })
    builder.addCase(Cancel_appointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // getreport
    builder.addCase(getReport.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.loading = false;
      state.medicalreport = action.payload.report;
    })
    builder.addCase(getReport.pending, (state) => {
        state.loading = true;
      })
    builder.addCase(getReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      //getDosha
      builder.addCase(getDosha.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.loading = false;
      state.dosha= action.payload.dosha[0].doshaAssessment;
    })
    builder.addCase(getDosha.pending, (state) => {
        state.loading = true;
      })
    builder.addCase(getDosha.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {} = PatientSlice.actions;

export default PatientSlice.reducer;
