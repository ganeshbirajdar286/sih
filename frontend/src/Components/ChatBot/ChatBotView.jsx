import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { ChatBot } from "../../feature/ChatBot/chatbot.thunk";
import { clearChat, addMessage } from "../../feature/ChatBot/chatbot.slice";
import { 
  Send, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  User, 
  Leaf, 
  Lightbulb,
  ShieldCheck,
  Zap,
  X
} from "lucide-react";
import toast from "react-hot-toast";
import FormattedMarkdown from "./FormattedMarkdown.jsx"

const SUGGESTED_PROMPTS = [
  { icon: "🌿", title: "Dosha Balance", text: "How can I balance Vata and Pitta doshas naturally?" },
  { icon: "🍵", title: "Ayurvedic Remedies", text: "What are effective Ayurvedic remedies for digestion and bloating?" },
  { icon: "🧘", title: "Dinacharya Routine", text: "Suggest an ideal daily Ayurvedic routine (Dinacharya) for wellness." },
  { icon: "🥗", title: "Prakriti Diet", text: "Which foods should I eat or avoid based on my Kapha constitution?" },
  { icon: "😴", title: "Sleep & Stress", text: "What natural herbs help improve sleep quality and calm anxiety?" },
];

export default function ChatBotView({ isEmbedded = false, onClose = null }) {
  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chatbot ?? { messages: [], loading: false });
  const { userProfile } = useSelector((state) => state.user ?? {});

  const [inputMessage, setInputMessage] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = (e) => {
    e?.preventDefault();
    const query = inputMessage.trim();
    if (!query || loading) return;

    // Add user message to UI immediately
    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    dispatch(addMessage(userMsg));
    setInputMessage("");

    // Dispatch thunk to fetch AI response
    dispatch(ChatBot({ question: query, message: query }));
  };

  const handlePromptClick = (promptText) => {
    if (loading) return;
    setInputMessage(promptText);
    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    dispatch(addMessage(userMsg));
    dispatch(ChatBot({ question: promptText, message: promptText }));
    setInputMessage("");
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success("Message copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    dispatch(clearChat());
    toast.success("Chat history cleared!");
  };

  return (
    <div className={`flex flex-col w-full h-full min-h-0 bg-slate-50/50 rounded-2xl border border-emerald-100/80 shadow-xl overflow-hidden ${isEmbedded ? "h-full" : "h-[calc(100vh-100px)] min-h-[500px]"}`}>
      {/* Header with Swasthya AI styling */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900 text-white px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between shadow-md shrink-0 relative overflow-hidden select-none">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center space-x-3 relative z-10 min-w-0">
          {/* Swasthya AI animated ring avatar */}
          <div className="relative flex items-center justify-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-400 via-emerald-400 to-teal-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-green-950 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-green-900 rounded-full"></span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base sm:text-lg tracking-wide text-white flex items-center gap-1.5 truncate">
                Swasthya AI
              </h2>
              <span className="text-[10px] sm:text-xs bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full border border-emerald-400/30 font-medium shrink-0">
                Ayurvedic Assistant
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/80 flex items-center gap-1 truncate mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Ayurvedic Health & Diet Intelligence</span>
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 relative z-10 shrink-0 ml-2">
          <button
            onClick={handleClear}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium cursor-pointer active:scale-95"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
          
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-all cursor-pointer active:scale-95 ml-1"
              title="Close Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Chat Messages Container */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 space-y-4 bg-gradient-to-b from-emerald-50/30 via-white to-slate-50/50 sidebar-scroll">
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-green-500/10 border border-emerald-200/60 rounded-2xl p-3.5 sm:p-4 shadow-2xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-xl shadow-xs shrink-0 mt-0.5">
              <Leaf className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-900 text-xs sm:text-sm flex items-center gap-1.5">
                Ask Swasthya AI Anything About Ayurveda & Nutrition
              </h3>
              <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                Get instant personalized guidance on Vata, Pitta, & Kapha balances, Ayurvedic diet plans, home remedies, and wellness routines tailored to your lifestyle.
              </p>
            </div>
          </div>
        </div>

        {/* Messages List */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold shadow-xs shrink-0 mt-1 ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-emerald-600 to-green-700 text-white"
                  : "bg-gradient-to-tr from-cyan-500 via-emerald-500 to-teal-600 text-white p-0.5"
              }`}
            >
              {msg.sender === "user" ? (
                userProfile?.Name ? userProfile.Name[0].toUpperCase() : <User className="w-4 h-4" />
              ) : (
                <div className="w-full h-full bg-emerald-950 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                </div>
              )}
            </div>

            {/* Bubble Container */}
            <div className={`max-w-[85%] sm:max-w-[78%] space-y-1 ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              {/* Sender label & Timestamp */}
              <div className={`flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-slate-400 px-1 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <span>{msg.sender === "user" ? (userProfile?.Name || "You") : "Swasthya AI"}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Box */}
              <div
                className={`p-3 sm:p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                  msg.sender === "user"
                    ? "bg-gradient-to-r from-emerald-700 via-emerald-800 to-green-800 text-white rounded-tr-none"
                    : msg.isError
                    ? "bg-rose-50 border border-rose-200 text-rose-800 rounded-tl-none"
                    : "bg-white border border-emerald-100/90 text-slate-800 rounded-tl-none shadow-sm shadow-emerald-900/5"
                }`}
              >
                {/* Text Content */}
                <FormattedMarkdown content={msg.text} isUser={msg.sender === "user"} />

                {/* Copy button for Bot messages */}
                {msg.sender === "bot" && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-700 text-[10px] sm:text-[11px] font-medium">
                      <Zap className="w-3 h-3 text-amber-500" /> Powered by Swasthya AI 
                    </span>
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1 rounded-lg hover:bg-emerald-50 text-slate-400 hover:text-emerald-700 transition flex items-center gap-1 cursor-pointer active:scale-95"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px] sm:text-[11px]">{copiedId === msg.id ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-cyan-500 via-emerald-500 to-teal-600 p-0.5 shadow-xs shrink-0 mt-1">
              <div className="w-full h-full bg-emerald-950 rounded-full flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300 animate-spin" />
              </div>
            </div>

            <div className="bg-white border border-emerald-100 p-3 sm:p-4 rounded-2xl rounded-tl-none shadow-sm shadow-emerald-900/5 flex items-center space-x-3">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
              </div>
              <span className="text-xs font-medium text-emerald-800 animate-pulse">Swasthya AI is generating response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-3 py-2 bg-white/90 border-t border-emerald-100 shrink-0 select-none">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span className="hidden sm:inline">Suggested:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 flex-1">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handlePromptClick(prompt.text)}
                disabled={loading}
                className="shrink-0 px-2.5 py-1 bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-900 border border-emerald-200/60 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 active:scale-95 shadow-2xs"
              >
                <span>{prompt.icon}</span>
                <span>{prompt.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} className="p-2.5 sm:p-3 bg-white border-t border-emerald-100 flex items-center gap-2 shrink-0">
        <div className="flex-1 relative min-w-0">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask Swasthya AI about Ayurvedic remedies, diet, doshas..."
            disabled={loading}
            className="w-full pl-3.5 pr-9 py-2 sm:py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/20 text-slate-800 text-xs sm:text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center text-emerald-600 pointer-events-none">
            <Sparkles className="w-4 h-4 opacity-50" />
          </div>
        </div>

        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-medium text-xs sm:text-sm transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </form>
    </div>
  );
}
