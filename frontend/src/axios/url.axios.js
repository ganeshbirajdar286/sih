import axios from "axios";
 const apiUrl= `${import.meta.env.VITE_API_URL}/auth`
 
const getToken=()=>localStorage.getItem("auth_token")


 export const axiosInstance = axios.create({
  baseURL:apiUrl,
   withCredentials: true, 
});


axiosInstance.interceptors.request.use((config)=>{
   const token=getToken();
   if(token){
      config.headers=config.headers||{};
      config.headers.Authorization=`Bearer ${token}`;
   }
   return config;
})