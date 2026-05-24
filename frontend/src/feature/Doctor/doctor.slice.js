import { createSlice } from "@reduxjs/toolkit";

import {
  myPatient,
  Cancel_appointments,
  single_patient,
  conformationappointment,
  getDietchart,
  createDietChart,
  profileUpdate, 
  profile,
  getdietchartID,
  updateDietChartbyID,
  AppointmentCount,
  AllPatientsDosha
} from "./doctor.thunk";

const initialState = {
  loading: false,
  error: null,
  appointment: [],
  cancelAppointments: null,
  singlePatient: null,
  statusappointment: null,
  getdietchart: [],
  dietchart: null,
  Profile: null,
   getDietchartById: null,
    updateLoading: false,
    updateError: null,
  updateSuccess: false,
  Appointment_count:[],
  totalAppointments: 0,
  AllPatientsDosha:[],
};

const doctorSlice = createSlice({
  name: "Doctors",
  initialState,
  reducers: {
    clearDietchartById(state) {
      state.getDietchartById = null;
      state.error = null;
    },
    clearUpdateStatus(state) {
      state.updateError = null;
      state.updateSuccess = false;
    },
incrementAppointmentCount: (state, action) => {

   const month = action.payload;

const found = state.Appointment_count.find(
  (item) => item.month === month && item.year === new Date().getFullYear()
);
   if (found) {

      found.totalAppointments += 1;

   } else {
      state.Appointment_count.push({
         month,
         year: new Date().getFullYear(),
         totalAppointments: 1
      });
   }
   state.totalAppointments += 1;
},
  },
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

    // getdietchart
    builder
      .addCase(getDietchart.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDietchart.fulfilled, (state, action) => {
        state.loading = false;
        state.getdietchart = action.payload.dietchart;
      })
      .addCase(getDietchart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // createdietchart
    builder
      .addCase(createDietChart.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDietChart.fulfilled, (state, action) => {
        state.loading = false;
        state.dietchart = action.payload.dietChart;
      })
      .addCase(createDietChart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // profile update
    builder
      .addCase(profileUpdate.pending, (state) => {
        state.loading = true;
      })
      .addCase(profileUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.Profile = action.payload.user;
      })
      .addCase(profileUpdate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

      // profile 
    builder
      .addCase(profile.pending, (state) => {
        state.loading = true;
      })
      .addCase(profile.fulfilled, (state, action) => {
        state.loading = false;
        state.Profile = action.payload.doctor;
      })
      .addCase(profile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

          builder
      //  getdietchartID 
      .addCase(getdietchartID.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getdietchartID.fulfilled, (state, action) => {
        state.loading = false;
        state.getDietchartById = action.payload.dietchart; 
      })
      .addCase(getdietchartID.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
       // updateDietchartbyID
      builder
       .addCase(updateDietChartbyID.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
        state.updateSuccess = false;
      })
      .addCase(updateDietChartbyID.fulfilled, (state, action) => {
        state.updateLoading = false;
        state.updateSuccess = true;
        // also refresh the cached chart with the latest saved data
        state.getDietchartById = action.payload.dietchart;
      })
      .addCase(updateDietChartbyID.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload;
        state.updateSuccess = false;
      });
     

      builder.addCase(AppointmentCount.pending,(state)=>{
        state.loading=true;
      })
      .addCase(AppointmentCount.fulfilled,(state,action)=>{
        state.loading=false;
        state.Appointment_count=action.payload.data;
       
      state.totalAppointments =
         action.payload.data.reduce(
            (acc, item) =>
               acc + item.totalAppointments,
            0
         );
         
      })
      .addCase(AppointmentCount.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload;})

      builder
      .addCase(AllPatientsDosha.pending,(state)=>{
        state.loading=true;
      })
      .addCase(AllPatientsDosha.fulfilled,(state,action)=>{
        state.loading=false;
        state.AllPatientsDosha=action.payload.data;
      })
      .addCase(AllPatientsDosha.rejected,(state,action)=>{
        state.loading=false;
        state.error=action.payload;
      });
  },
});

export const { clearDietchartById, clearUpdateStatus ,incrementAppointmentCount} = doctorSlice.actions;
export default doctorSlice.reducer;
