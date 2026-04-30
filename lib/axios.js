import axios from 'axios'

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ENV === "development"
    ? "http://localhost:4000/api"
    : "real/api",
  withCredentials: true
});
