import bcrypt from "bcrypt"

export const hash_Password=async(Password)=>{
    try {
        const hashPassword=await bcrypt.hash(Password,12)
        return hashPassword;
    } catch (error) {
        console.log("password is not hash "+error);
    }
}

export const comparePassword=async(Password, userPassword)=>{
 return await bcrypt.compare(Password, userPassword);
}