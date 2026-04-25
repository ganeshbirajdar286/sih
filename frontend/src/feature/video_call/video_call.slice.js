import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getSocket } from "../../services/socket_init";

const initialState = {
  callerid: null,
  receiverid: null,
  isCallActive: false,
  localStream: null,
  RemoteStream: null,
  isVideoEnabled: true,
  isAudioEnabled: true,
  isCallModelOpen: false,
};
