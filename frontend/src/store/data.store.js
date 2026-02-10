import { configureStore } from '@reduxjs/toolkit'
import userReducer  from '../feature/User/user.slice'
import patientReducer from "../feature/Patient/patient.slice"

export const store = configureStore({
  reducer: {
   user:userReducer,
   patient:patientReducer,
  },
})
