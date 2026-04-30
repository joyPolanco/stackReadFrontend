import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {login, }= useAuthStore();
  const navigate= useNavigate()
  const handleLogin = async () => {
     await login({email,password})
  };
  return (
    <div className="w-full flex flex-col gap-4 text-gray-700">

      {/* EMAIL */}
      <input
        className="
          w-full
          px-4 py-2
          rounded-lg
          border border-gray-200
          bg-white
          text-gray-800
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-emerald-400
          focus:border-emerald-400
          transition
        "
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
      />

      {/* PASSWORD */}
      <input
        className="
          w-full
          px-4 py-2
          rounded-lg
          border border-gray-200
          bg-white
          text-gray-800
          placeholder-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-sky-400
          focus:border-sky-400
          transition
        "
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />

      {/* BOTÓN */}
      <button
        type="button"
        onClick={handleLogin}
        className="
          mt-2
          w-full
          bg-gradient-to-r from-emerald-500 to-sky-500
          text-white
          rounded-lg
          p-2.5
          font-medium
          shadow-sm
          hover:shadow-md
          hover:opacity-95
          transition
        "
      >
        Iniciar sesión
      </button>

      {/* RECUPERAR CONTRASEÑA */}
      <div className="text-right">
        <button className="text-sm text-sky-600 hover:text-sky-800 cursor-pointer underline transition" onClick={()=>navigate("/restore-password")}>
          ¿Olvidaste tu contraseña?
        </button>
      </div>

    </div>
  );
};

export default LoginForm;