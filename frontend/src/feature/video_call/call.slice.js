import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCalling: false,
  isReceivingCall: false,
  callAccepted: false,
  callEnded: false,
  callerInfo: null,       // { name, patientId, signal }
  localStream: null,
  remoteStream: null,
  onlineUsers: {},
};

const callSlice = createSlice({
  name: "call",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
  state.onlineUsers = action.payload;
},
    setIsCalling(state, { payload }) {
      state.isCalling = payload;
      state.isReceivingCall = false;
    },
    setIncomingCall(state, { payload }) {
      // payload: { callerName, patientId, signal }
      state.isReceivingCall = true;
      state.callerInfo = payload;
    },
    setCallAccepted(state, { payload }) {
      state.callAccepted = true;
      state.isCalling = false;
      state.isReceivingCall = false;
    },
    setCallEnded(state) {
      return { ...initialState };        // full reset
    },
    setLocalStream(state, { payload }) {
      state.localStream = payload;
    },
    setRemoteStream(state, { payload }) {
      state.remoteStream = payload;
    },
  },
});

export const {
  setIsCalling,
  setIncomingCall,
  setCallAccepted,
  setCallEnded,
  setLocalStream,
  setRemoteStream,
  setOnlineUsers,
} = callSlice.actions;

export default callSlice.reducer;