import mongoose from "mongoose";

const connect_db=async()=>{
   try {
       await mongoose.connect(process.env.MONGODB_URL);
       console.log("database is  connect !! ");
   } catch (error) {
       console.log("database not connected "+error);
       process.exit(1);
   }
}

export default connect_db;