import  jwt from "jsonwebtoken"

export const jwtToken=(userId,doctor_id)=>{
    return jwt.sign({ userId,doctor_id },process.env.JWT_SECRET, { expiresIn: '1y' } );
}