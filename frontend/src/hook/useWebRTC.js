import { useRef, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsCalling, setCallAccepted, setCallEnded,
  setLocalStream, setRemoteStream,
} from "../feature/video_call/call.slice";
import { getSocket } from "../services/socket_init";

const ICE_SERVERS = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export const useWebRTC = () => {
  const dispatch  = useDispatch();
  const peerRef   = useRef(null);
  const localRef  = useRef(null);
  const remoteRef = useRef(null);
  const streamRef = useRef(null);
  const iceCandidateQueue = useRef([]); 

 const getMedia = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  streamRef.current = stream;
  dispatch(setLocalStream(true));

 
  const assignLocal = () => {
    if (localRef.current) {
      localRef.current.srcObject = stream;
    } else {
      requestAnimationFrame(assignLocal); 
    }
  };
  requestAnimationFrame(assignLocal);

  return stream;
};

  const createPeer = (stream) => {
    const peer = new RTCPeerConnection(ICE_SERVERS);
    stream.getTracks().forEach((t) => peer.addTrack(t, stream));

    peer.ontrack = (e) => {
      console.log("✅ Got remote track", e.streams[0]); 
      if (remoteRef.current) remoteRef.current.srcObject = e.streams[0];
      dispatch(setRemoteStream(true));
    };

    peer.onicecandidate = (e) => {
      if (e.candidate) {
        console.log("📤 Sending ICE candidate"); 
        getSocket().emit("ice-candidate", { candidate: e.candidate });
      }
    };

   
    peer.onconnectionstatechange = () => {
      console.log("🔗 Connection state:", peer.connectionState);
    };

    peerRef.current = peer;
    return peer;
  };


  const flushIceQueue = async () => {
    for (const candidate of iceCandidateQueue.current) {
      await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    }
    iceCandidateQueue.current = [];
  };

  const stopMedia = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    peerRef.current?.close();
    peerRef.current = null;
    streamRef.current = null;
    iceCandidateQueue.current = [];
    if (localRef.current) localRef.current.srcObject = null;
    if (remoteRef.current) remoteRef.current.srcObject = null;
  };

  // ─── Doctor calls ──────────────────────────────────────────
  const callPatient = useCallback(async (patientSocketId, doctorName) => {

    const stream = await getMedia();
    const peer   = createPeer(stream);
    const offer  = await peer.createOffer();
    await peer.setLocalDescription(offer);

    console.log("📞 Calling patient socket:", patientSocketId); 

    getSocket().emit("call-user", {
      to:     patientSocketId,
      from:   getSocket().id,
      name:   doctorName,
      signal: offer,
    });

    dispatch(setIsCalling(true));

    getSocket().once("call-accepted", async ({ signal }) => {
      console.log("✅ Call accepted, setting remote description"); 
      await peer.setRemoteDescription(new RTCSessionDescription(signal));
      await flushIceQueue();
      dispatch(setCallAccepted());
    });
  }, [dispatch]);

  // ─── Patient answers ───────────────────────────────────────
  const answerCall = useCallback(async (callerInfo) => {
    console.log("📲 Answering call from:", callerInfo); 

    if (!callerInfo?.signal) {
      console.error("❌ No signal in callerInfo!", callerInfo);
      return;
    }

    const stream = await getMedia();
    const peer   = createPeer(stream);

    await peer.setRemoteDescription(
      new RTCSessionDescription(callerInfo.signal)
    );
    await flushIceQueue(); 

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    getSocket().emit("answer-call", {
      to:     callerInfo.from, 
      signal: answer,
    });

    dispatch(setCallAccepted());
  }, [dispatch]);

  const endCall = useCallback(() => {
    stopMedia();
    getSocket().emit("end-call");
    dispatch(setCallEnded());
  }, [dispatch]);


  const addIceCandidate = useCallback(async (candidate) => {
    if (!candidate) return;

    const peer = peerRef.current;
    if (peer && peer.remoteDescription) {
      
      await peer.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      console.log("⏳ Queuing ICE candidate");
      iceCandidateQueue.current.push(candidate);
    }
  }, []);

  return { callPatient, answerCall, endCall, addIceCandidate, localRef, remoteRef };
};