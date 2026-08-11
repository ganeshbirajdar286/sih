import { ChatMistralAI } from "@langchain/mistralai";
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from "@langchain/langgraph";


export const chatBot = async (req, res) => {
  try {
    
    const {question}=req.body;

    const llm = new ChatMistralAI({
    model: "mistral-medium-3-5",
    apikey: process.env.MISTRAL_API_KEY,
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
        content: question
      },
    ],
  });



  return res.json({
    message:result.messages.at(-1).content
  })
  } catch (error) {
    return res.json({
        error:"5000000 errooror"
    })
  }
};
