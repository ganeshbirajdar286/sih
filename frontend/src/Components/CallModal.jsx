import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PhoneOff, Phone, Mic, MicOff, Video, VideoOff, User } from "lucide-react";

const CallModal = ({ localRef, remoteRef, onAnswer, onEnd }) => {
  const { isCalling, callAccepted, isReceivingCall, callerInfo } =
    useSelector((s) => s.call);

  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  useEffect(() => {
    const retry = () => {
      if (localRef?.current && !localRef.current.srcObject) {
        requestAnimationFrame(retry);
      }
    };
    requestAnimationFrame(retry);
  }, [isCalling, callAccepted]);

  const toggleMic = () => {
    const stream = localRef?.current?.srcObject;
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMicOn((p) => !p);
  };

  const toggleCam = () => {
    const stream = localRef?.current?.srcObject;
    if (!stream) return;
    stream.getVideoTracks().forEach((t) => (t.enabled = !t.enabled));
    setCamOn((p) => !p);
  };

  if (!isCalling && !callAccepted && !isReceivingCall) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal — slides up from bottom on mobile */}
      <div className="relative w-full h-screen sm:h-auto sm:max-w-lg sm:mx-4 bg-gray-900 sm:rounded-3xl overflow-hidden shadow-2xl">

        {/* Video area */}
   <div className="relative w-full bg-black" style={{ height: "calc(100vh - 100px)" }}>

          {/* Remote video (full) */}
          <video
            ref={remoteRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Local PiP */}
          <div className="absolute bottom-3 right-3 w-24 h-18 sm:w-32 sm:h-24 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg">
            <video
              ref={localRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {!camOn && (
              <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                <VideoOff className="w-5 h-5 text-white/40" />
              </div>
            )}
          </div>

          {/* Caller name badge */}
          {callAccepted && (
            <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-white text-xs font-medium">Live</span>
            </div>
          )}

          {/* Waiting overlay */}
          {isCalling && !callAccepted && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 gap-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="text-center">
                <p className="text-white font-semibold">Calling patient…</p>
                <p className="text-white/50 text-sm mt-1">Waiting for answer</p>
              </div>
            </div>
          )}

          {/* Incoming call overlay */}
          {isReceivingCall && !callAccepted && !isCalling && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90 gap-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400/40 flex items-center justify-center">
                <User className="w-10 h-10 text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm">Incoming call from</p>
                <p className="text-white font-bold text-xl mt-1">
                  {callerInfo?.name || "Doctor"}
                </p>
              </div>
              <button
                onClick={onAnswer}
                className="flex items-center gap-2 bg-emerald-500 text-white px-8 py-3 rounded-2xl font-semibold hover:bg-emerald-600 active:scale-95 transition-all shadow-lg shadow-emerald-500/30"
              >
                <Phone className="w-5 h-5" />
                Answer
              </button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-gray-900 px-6 py-5 flex items-center justify-between gap-3">
          {/* Mic */}
          <button
            onClick={toggleMic}
            className={`flex flex-col items-center gap-1.5 flex-1 py-3 rounded-2xl transition-all active:scale-95 ${
              micOn ? "bg-gray-700 text-white" : "bg-red-500/20 text-red-400"
            }`}
          >
            {micOn
              ? <Mic className="w-5 h-5" />
              : <MicOff className="w-5 h-5" />
            }
            <span className="text-xs font-medium">{micOn ? "Mute" : "Unmute"}</span>
          </button>

          {/* End Call */}
          <button
            onClick={onEnd}
            className="flex flex-col items-center gap-1.5 flex-1 py-3 rounded-2xl bg-red-500 text-white hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/30"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="text-xs font-medium">End</span>
          </button>

          {/* Camera */}
          <button
            onClick={toggleCam}
            className={`flex flex-col items-center gap-1.5 flex-1 py-3 rounded-2xl transition-all active:scale-95 ${
              camOn ? "bg-gray-700 text-white" : "bg-red-500/20 text-red-400"
            }`}
          >
            {camOn
              ? <Video className="w-5 h-5" />
              : <VideoOff className="w-5 h-5" />
            }
            <span className="text-xs font-medium">{camOn ? "Camera" : "No Cam"}</span>
          </button>
        </div>

        {/* Bottom safe area for mobile */}
        <div className="bg-gray-900 pb-safe pb-2" />
      </div>
    </div>
  );
};

export default CallModal;   