import  jwt from "jsonwebtoken"

export const jwtToken=(userId)=>{
    return jwt.sign({ userId },process.env.PRIVATED_KEY, { expiresIn: '1y' } );
}