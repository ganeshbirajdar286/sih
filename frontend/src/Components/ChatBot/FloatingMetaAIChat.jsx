import React, { useState } from "react";
import { Sparkles, X } from "lucide-react";
import ChatBotView from "./ChatBotView";

export default function FloatingMetaAIChat() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-50 flex flex-col items-end pointer-events-none">
      {/* Chat Window Drawer / Modal */}
      {isOpen && (
        <div className="pointer-events-auto mb-3 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[82vh] shadow-2xl rounded-2xl border border-emerald-200/80 bg-white overflow-hidden flex flex-col animate-fadeIn transition-all duration-300">
          <ChatBotView isEmbedded={true} onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* Floating Action Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto group relative flex items-center justify-center p-0.5 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
        aria-label={isOpen ? "Close Swasthya AI Assistant" : "Open Swasthya AI Assistant"}
      >
        {/* Animated Swasthya AI Gradient Ring */}
        <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-500 opacity-75 group-hover:opacity-100 blur-xs animate-pulse"></span>
        
        {/* Inner Orb Button */}
        <div className="relative w-13 h-13 sm:w-14 sm:h-14 bg-gradient-to-br from-emerald-700 via-green-800 to-teal-900 rounded-full flex items-center justify-center text-white border-2 border-emerald-300/40 shadow-inner">
          {isOpen ? (
            <X className="w-6 h-6 text-emerald-100 transition-transform duration-300 rotate-90" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-emerald-300 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></span>
            </div>
          )}
        </div>

        {/* Tooltip on hover */}
        {!isOpen && (
          <span className="absolute right-16 bg-gray-900/90 text-white text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-gray-700">
            Ask Swasthya AI ✨
          </span>
        )}
      </button>
    </div>
  );
}

