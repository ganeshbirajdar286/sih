import express from "express"
import  dotenv from "dotenv"

dotenv.config()
const app=express();
const port =process.env.port

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//app.use("/api/auth",)

app.listen(port,(res,req)=>{
    console.log(`server is connected to port: ${port}`);
})

