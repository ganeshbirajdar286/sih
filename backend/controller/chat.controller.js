import { ChatMistralAI } from "@langchain/mistralai";
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from "@langchain/langgraph";


const formatAIResponse = (rawContent) => {
  if (typeof rawContent !== "string") {
    return rawContent;
  }

  const cleaned = rawContent
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return rawContent;
  }
};

export const chatBot = async (req, res) => {
  try {
    const question = req.body?.question || req.body?.message;

    if (!question || typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question or message field is required",
      });
    }

    const llm = new ChatMistralAI({
      model: "mistral-medium-3-5",
      apiKey: process.env.MISTRAL_API_KEY,
    });

    async function chatbot(state) {
      const response = await llm.invoke(state.messages);
      return {
        messages: [response],
      };
    }

    const Graph = new StateGraph(MessagesAnnotation)
      .addNode("chatbot", chatbot)
      .addEdge(START, "chatbot")
      .addEdge("chatbot", END);

    const app = Graph.compile();

    const result = await app.invoke({
      messages: [
        {
          role: "user",
          content: question.trim(),
        },
      ],
    });

    const rawContent = result.messages.at(-1)?.content || "";
    const parsedData = formatAIResponse(rawContent);

    // Build standard JSON response object
    const responseData =
      typeof parsedData === "object" && parsedData !== null
        ? parsedData
        : {
            reply: parsedData,
            response: parsedData,
          };

    return res.status(200).json({
      success: true,
      message: "Response generated successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("ChatBot Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during chatbot processing",
      error: error.message,
    });
  }
};


