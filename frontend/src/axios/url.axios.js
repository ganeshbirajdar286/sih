import axios from "axios";
 const apiUrl= `${import.meta.env.VITE_API_URL}/auth`

 
 export const axiosInstance = axios.create({
  baseURL:apiUrl,
   withCredentials: true, 
});
