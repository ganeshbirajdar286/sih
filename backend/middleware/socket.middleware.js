import  jwt from "jsonwebtoken"

export const socketMiddleware=(socket,next)=>{
   const token= socket.handshake.auth?.token ||
    socket.handshake.headers["authorization"]?.split(" ")[1]

    if(!token){
        return next(new Error("Authorization token missing "))
    }

    try{
        const decoded=jwt.verify(token,process.env.PRIVATED_KEY)
        socket.user=decoded;
        next();
    } catch (error) {
    console.log(error);
    return next(new Error("Token expired"));
  }
}