import bcrypt from "bcrypt"

export const hash_Password=(Password)=>{
    try {
        const hashPassword=bcrypt.hash(Password,12)
        return hashPassword;
    } catch (error) {
        console.log("password is not hash "+error);
    }
}

export const comparePassword=async(Password, userPassword)=>{
 return await bcrypt.compare(Password, userPassword);
}