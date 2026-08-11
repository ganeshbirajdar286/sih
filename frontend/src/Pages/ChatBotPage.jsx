import React from "react";
import { useNavigate } from "react-router-dom";
import ChatBotView from "../Components/ChatBot/ChatBotView";
import logo from "../assets/logo.png";
import { ArrowLeft, Home} from "lucide-react";
import { useSelector } from "react-redux";

export default function ChatBotPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isDoctor } = useSelector(
    (state) => state.user ?? { isAuthenticated: false, isDoctor: false }
  );

  const handleBackToDashboard = () => {
    if (!isAuthenticated) {
      navigate("/");
    } else if (isDoctor) {
      navigate("/doctor-dashboard");
    } else {
      navigate("/patient-dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackToDashboard}
            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full shadow-md overflow-hidden bg-green-700 flex items-center justify-center">
              <img src={logo} alt="logo" className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-green-800 tracking-tight leading-tight flex items-center gap-1.5">
                SWASTHYA <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium border border-emerald-200">AI</span>
              </h1>
              <p className="text-[11px] text-gray-500 hidden sm:block">Ayurvedic Health & Intelligence Portal</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleBackToDashboard}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-green-700 to-emerald-800 hover:from-green-800 hover:to-emerald-900 text-white text-xs font-semibold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 flex flex-col">
        <ChatBotView isEmbedded={false} />
      </main>
    </div>
  );
}
