import { create } from "zustand";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-hot-toast";
import { Flag, LogOut } from "lucide-react";
import ResetPassword from "../pages/ResetPassword.jsx";

export const useAuthStore = create((set,get,) => ({
  authUser: null,
  isLoggingIn: false,
  isCheckingAuth: false,
  isRegistering: false,

  // CHECK AUTH
checkAuth: async () => {
  try {
    set({ isCheckingAuth: true });

    const res = await axiosInstance.get("/auth/check");

    set({
      authUser: res.data.user,
      isCheckingAuth: false
    });

  } catch (error) {
    set({
      authUser: null,
      isCheckingAuth: false
    });
  }
},
  // GOOGLE LOGIN
sendGoogleCredential: async (credential) => {
  try {
    const res = await axiosInstance.post("/auth/google", {
      credential,
    });

    const user = res.data.user;

    set({ authUser: user });

    toast.success("Login con Google exitoso");
    

  } catch (err) {
    toast.error("Error en login con Google");
    set({ authUser: null });

    return { success: false };
  }
},
  // LOGIN EMAIL/PASSWORD
  login: async (data) => {
    try {
      set({ isLoggingIn: true });

      const res = await axiosInstance.post("/auth/login", data);

      set({ authUser: res.data.user });

      toast.success("Login exitoso");

    } catch (err) {

      toast.error(err.response?.data?.message || "Error en login");

    } finally {
      set({ isLoggingIn: false });
    }
  },

  // REGISTER
  register: async (data) => {
  try {
    set({ isRegistering: true });

    const res = await axiosInstance.post("/auth/register", data);

    toast.success(res.data.message || "Usuario creado correctamente");

    return res.data;

  } catch (err) {

    const response = err.response?.data;

    if (response?.errors && Array.isArray(response.errors)) {
      response.errors.forEach((e) => {
        toast.error(`${e.field}: ${e.message}`);
      });
      return;
    }

    toast.error(response?.message || "Error en registro");

  } finally {
    set({ isRegistering: false });
  }
},


logout: async () => {
  try {
    await axiosInstance.post("/auth/logout");

    set({ authUser: null });

    toast.success("Sesión cerrada");
  } catch (err) {
    toast.error("Error al cerrar sesión");
  }

  }


  ,
  updateProfile:async (data)=>{
   const res= await axiosInstance.post("/auth/update-profile", data)
   set({authUser:res.data.user})
   return res
  }

  ,
sendResetPasswordRequest: async (email) => {
  try {
    const res = await axiosInstance.post("/auth/request-reset-password", {
      email,
    });

    return res.data;
  } catch (err) {
    throw err;
  }
},
checkResetPasswordToken: async (token) => {
  const res = await axiosInstance.get("/auth/check-reset-token", {
    params: { token },
  });
  return res;
}
,
resetPassword: async(token,password)=>{
  const res = await axiosInstance.post("/auth/reset-password", {token,password});
  return res;
}
}));