import express from "express"
import  dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js"
import connect_db from "./config/db.connted.js"
import cookieParser from "cookie-parser";
import  cors from "cors"
import { createServer } from "http";
import initializeSocket from "./services/video-call-services.js";



dotenv.config()


const allowedOrigins = [
  /\.vercel\.app$/,
  ...process.env.FRONTEND_URL.split(","),
];

const corsOption = {
  origin: function (origin, callback) {
    // Allow mobile apps, Postman etc
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some((allowed) =>
      typeof allowed === "string"
        ? allowed === origin
        : allowed.test(origin)
    );

    if (isAllowed) {
      return callback(null, true);
    }
    console.log("❌ CORS blocked:", origin);
    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

  //allowedHeaders: ["Content-Type", "Authorization"],
};

const app=express();
const server = createServer(app);
const io = initializeSocket(server);

const port =process.env.Port
app.use(cors(corsOption))
app.use(cookieParser());  
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/auth",authRouter)

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

server.listen(port, "0.0.0.0", () => {
  connect_db();
  console.log(`Server running on ${port}`);
});
 