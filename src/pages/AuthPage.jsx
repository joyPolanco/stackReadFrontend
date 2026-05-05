import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import GoogleAuth from "../components/GoogleAuth";
import SignUp from "../components/SignUp";
import loginImage from "../assets/login.jpg";
import { useAuthStore } from "../store/useAuthStore.js";

const AuthPage = () => {
  const [actualOption, setActualOption] = useState("login");
  const {authUser} = useAuthStore();
  return (
    <div className="w-full h-screen flex font-sans bg-gray-100">

      {/* IZQUIERDA - IMAGEN */}
      <div className="hidden md:flex w-1/2 relative">

        <img
          src={loginImage}
          alt="login"
          className="w-full h-full object-cover"
        />

        {/* OVERLAY PARA MEJOR CONTRASTE */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* TEXTO */}
        <div className="absolute bottom-10 left-10 text-white max-w-sm z-10">
          <h2 className="text-2xl font-semibold">
            Tu lectura, tu progreso
          </h2>
          <p className="text-sm text-white/80 mt-2">
            Organiza tus libros, registra tus avances y mejora tus hábitos de lectura.
          </p>
        </div>

      </div>

      {/* DERECHA - FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-6 bg-[#f0f7ff]">

        <div className="w-full max-w-md p-6 md:p-8 rounded-2xl bg-white shadow-xl border border-gray-200">

          {/* TÍTULO */}
          <h1 className="text-center text-3xl font-semibold text-gray-800 mb-6">
            Bienvenid@
          </h1>

          {/* TABS */}
          <div className="flex mb-6 border-b border-gray-200">

            <button
              onClick={() => setActualOption("login")}
              className={`flex-1 py-3 transition ${
                actualOption === "login"
                  ? "text-emerald-600 border-b-2 border-emerald-500 font-medium"
                  : "text-gray-500"
              }`}
            >
              Iniciar sesión
            </button>

            <button
              onClick={() => setActualOption("signup")}
              className={`flex-1 py-3 transition ${
                actualOption === "signup"
                  ? "text-emerald-600 border-b-2 border-emerald-500 font-medium"
                  : "text-gray-500"
              }`}
            >
              Registrarse
            </button>

          </div>

          {/* CONTENIDO */}
          {actualOption === "login" ? (
            <>
              <LoginForm />

              <div className="my-5 flex items-center">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="px-3 text-sm text-gray-400">
                  o continuar con
                </span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <GoogleAuth />
            </>
          ) : (
            <SignUp setActualOption={setActualOption} />
          )}

        </div>
      </div>
    </div>
  )
};

export default AuthPage;