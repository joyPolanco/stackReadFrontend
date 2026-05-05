import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: "https://stackread-api-production.up.railway.app/api",
  withCredentials: true
});
