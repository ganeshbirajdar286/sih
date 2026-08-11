import { createSlice } from "@reduxjs/toolkit";
import { ChatBot } from "./chatbot.thunk";

const getWelcomeMessage = () => ({
  id: "welcome-1",
  sender: "bot",
  text: "Namaste 🙏 I am Swasthya AI Assistant. How can I help you with your Ayurvedic health, Dosha balance, or diet care today?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
});

const initialState = {
  response: "",
  loading: false,
  error: null,
  messages: [getWelcomeMessage()]
};

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,

  reducers: {
    clearChat: (state) => {
      state.response = "";
      state.error = null;
      state.messages = [getWelcomeMessage()];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(ChatBot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(ChatBot.fulfilled, (state, action) => {
        state.loading = false;
        const rawPayload = action.payload;
        let botText = "";
        
        if (typeof rawPayload === "string") {
          botText = rawPayload;
        } else if (rawPayload && typeof rawPayload === "object") {
          botText = rawPayload.data?.reply 
            || rawPayload.data?.response 
            || rawPayload.data?.message 
            || rawPayload.data 
            || rawPayload.reply 
            || rawPayload.message 
            || rawPayload.response;

          if (typeof botText === "object" && botText !== null) {
            botText = botText.text || botText.content || botText.reply || JSON.stringify(botText);
          }
        }
        
        botText = botText || "I have received your request. Let me know if you have more questions regarding Ayurvedic care!";
        state.response = botText;
        state.error = null;

        state.messages.push({
          id: Date.now().toString(),
          sender: "bot",
          text: botText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      })

      .addCase(ChatBot.rejected, (state, action) => {
        state.loading = false;
        const errText = typeof action.payload === "string" 
          ? action.payload 
          : (action.payload?.message || "Unable to get AI response right now.");
        state.error = errText;
        state.messages.push({
          id: Date.now().toString(),
          sender: "bot",
          text: `⚠️ ${errText}`,
          isError: true,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      });
  },
});

export const { clearChat, addMessage } = chatbotSlice.actions;

export default chatbotSlice.reducer;