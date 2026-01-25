import express from "express"
import  dotenv from "dotenv"
import authRouter from "./routes/auth.routes.js"
import connect_db from "./config/db.connted.js"
import cookieParser from "cookie-parser";

dotenv.config()
const app=express();
const port =process.env.port
app.use(cookieParser());  
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use("/api/auth",authRouter)

app.listen(port,(res,req)=>{
     connect_db();
    console.log(`server is connected to port: ${port}`);
})

