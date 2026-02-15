import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, logoutThunk, registerThunk,getDoshaStatusThunk,submitDoshaThunk  } from "./user.thunk";

const userFromStorage = localStorage.getItem("user");

const initialState = {
  isAuthenticated: !!userFromStorage,
  userProfile: userFromStorage ? JSON.parse(userFromStorage) : null,
  isDoctor: userFromStorage ? JSON.parse(userFromStorage).isDoctor : null,
  mustFill:false,
  ButtonLoading: false,
   doshaData: null, 
};

const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // login
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      console.log("fulfilled");
      const user = action.payload?.responseData;

      state.ButtonLoading = false;
      state.isAuthenticated = true;
      state.userProfile = user;
      state.isDoctor = user?.isDoctor;

      // Persist
      localStorage.setItem("user", JSON.stringify(user));
    });
    builder.addCase(loginThunk.pending, (state, action) => {
      console.log("pending");
      state.ButtonLoading = true;
    });
    builder.addCase(loginThunk.rejected, (state, action) => {
      console.log("rejected");
      state.ButtonLoading = false;
    });

    // register
    builder.addCase(registerThunk.fulfilled, (state, action) => {
  console.log("Register fulfilled");

  const user = action.payload?.responseData;
  const autoLogin = action.payload?.autoLogin;

  state.ButtonLoading = false;

  if (autoLogin) {
    state.isAuthenticated = true;
    state.userProfile = user;
    state.isDoctor = user?.isDoctor;

    localStorage.setItem("user", JSON.stringify(user));
  } else {
    state.isAuthenticated = false;
    state.userProfile = null;
    state.isDoctor = null;
  }
});

    builder.addCase(registerThunk.pending, (state, action) => {
      console.log("pending");
      state.ButtonLoading = true;
    });
    builder.addCase(registerThunk.rejected, (state, action) => {
      console.log("rejected");
      state.ButtonLoading = false;
    });

    // logout user
    builder.addCase(logoutThunk.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.ButtonLoading = false;
      state.isAuthenticated = false;
      state.userProfile = null;
      state.isDoctor = null;
    });
    builder.addCase(logoutThunk.pending, (state, action) => {
      console.log("pending");
      state.ButtonLoading = true;
    });
    builder.addCase(logoutThunk.rejected, (state, action) => {
      console.log("rejected");
      state.ButtonLoading = false;
    });

//getDoshaStatusThunk
     builder.addCase(getDoshaStatusThunk.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.ButtonLoading = false;
      state.mustFill=action.payload.mustFill;
    });
    builder.addCase(getDoshaStatusThunk.pending, (state, action) => {
      console.log("pending");
      state.ButtonLoading = true;
    });
    builder.addCase(getDoshaStatusThunk.rejected, (state, action) => {
      console.log("rejected");
      state.ButtonLoading = false;
    });

    //submitDoshaThunk
     builder.addCase(submitDoshaThunk.fulfilled, (state, action) => {
      console.log("fulfilled");
      state.ButtonLoading = false;
      state.doshaData=action.payload.data;
    });
    builder.addCase(submitDoshaThunk.pending, (state, action) => {
      console.log("pending");
      state.ButtonLoading = true;
    });
    builder.addCase(submitDoshaThunk.rejected, (state, action) => {
      console.log("rejected");
      state.ButtonLoading = false;
    });
  },
});

export const { setSelectedUser } = userSlice.actions;

export default userSlice.reducer;
