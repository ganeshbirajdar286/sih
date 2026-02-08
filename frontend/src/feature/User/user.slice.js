import { createSlice } from "@reduxjs/toolkit";
import { loginThunk, logoutThunk, registerThunk } from "./user.thunk";

const initialState = {
      isAuthenticated: false,
    screenLoading:true,
    userProfile:null,
    ButtonLoading:false,
    otherUser:null,
    selectedUser:null,
};



const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    setSelectedUser:(state,action)=>{
       state.selectedUser=action.payload;
     }
  },
  extraReducers:(builder)=>{
    // login
     builder.addCase(loginThunk.fulfilled,(state,action)=>{
       console.log("fulfilled");
                state.userProfile=action.payload?.responseData;
                state.ButtonLoading=false;
                state.isAuthenticated=true;
     })
     builder.addCase(loginThunk.pending, (state, action) => {
            console.log("pending");    
            state.ButtonLoading=true;
        })
        builder.addCase(loginThunk.rejected, (state, action) => {
            console.log("rejected"); 
            state.ButtonLoading=false;
        })
// register 
          builder.addCase(registerThunk.fulfilled, (state, action) => {
            console.log("fulfilled");
                state.userProfile=action.payload?.responseData;
                state.ButtonLoading=false;
                state.isAuthenticated=true;
        })
        builder.addCase(registerThunk.pending, (state, action) => {
            console.log("pending");    
            state.ButtonLoading=true;
        })
        builder.addCase(registerThunk.rejected, (state, action) => {
            console.log("rejected"); 
            state.ButtonLoading=false;
        })

            // logout user
            builder.addCase(logoutThunk.fulfilled, (state, action) => {
                console.log("fulfilled");
                    state.userProfile=null;
                    state.ButtonLoading=false;
                    state.isAuthenticated=false;
            })
            builder.addCase(logoutThunk.pending, (state, action) => {
                console.log("pending");    
                state.ButtonLoading=true;
            })
            builder.addCase(logoutThunk.rejected, (state, action) => {
                console.log("rejected"); 
                state.ButtonLoading=false;
            })


  }
});


export const {setSelectedUser} = userSlice.actions

export default userSlice.reducer