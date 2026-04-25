import { Server } from "socket.io";

const initializeSocket=(server)=>{
  const io=new Server(server,{
    cors:{
        origin:[
            process.env.FRONTEND_URL,
            /\.vercel\.app$/,
        ],
        credentials:true,
        methods:["GET","POST","PUT","DELETE","PATCH"],
    },
    pingTimeout: 60000,
  })

  io.on("connection",(socket)=>{
    console.log("New client connected:", socket.id);
  })

  return io;
}

export default initializeSocket; 