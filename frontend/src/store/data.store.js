import { configureStore } from '@reduxjs/toolkit'
import userReducer  from '../feature/User/user.slice'

export const store = configureStore({
  reducer: {
    userReducer,
  },
})
