import express from "express"
import  dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js"
import connect_db from "./config/db.connted.js"
import cookieParser from "cookie-parser";
import  cors from "cors"


dotenv.config()


const allowedOrigins = [
  /\.vercel\.app$/,  // allow ANY Vercel URL
  process.env.FRONTEND_URL, // your main production URL (optional)
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

const port =process.env.port
app.use(cors(corsOption))
app.use(cookieParser());  
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/auth",authRouter)



app.listen(port,(res,req)=>{
     connect_db();
    console.log(`server is connected to port: ${port}`);
})

