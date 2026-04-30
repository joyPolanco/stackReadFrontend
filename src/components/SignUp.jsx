import {
  MailIcon,
  UserIcon,
  LockIcon,
  ShieldCheckIcon,
} from "lucide-react";
import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const SignUp = ({ setActualOption }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { register } = useAuthStore();

  // ================= VALIDACIONES =================
  const isValidEmail =
    email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidName = name.length >= 2 && name.length <= 50;

  const isValidPassword =
    password.length > 0 &&
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/.test(password);

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const passwordsDontMatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  const validateForm = () => {
    if (!email || !name || !password || !confirmPassword) {
      toast.error("Todos los campos son obligatorios");
      return false;
    }

    if (!isValidName) {
      toast.error("El nombre debe tener entre 2 y 50 caracteres");
      return false;
    }

    if (!isValidEmail) {
      toast.error("Correo electrónico no válido");
      return false;
    }

    if (!isValidPassword) {
      toast.error(
        "La contraseña debe tener mayúscula, minúscula y número"
      );
      return false;
    }

    if (!passwordsMatch) {
      toast.error("Las contraseñas no coinciden");
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await register({ email, name, password });
      setActualOption("login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= ESTILO BASE =================
  const inputClass =
    "w-full pl-10 pr-4 py-2 rounded-lg border bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition";

  return (
    <div className="w-full flex flex-col gap-4 text-gray-700">

      {/* EMAIL */}
      <div className="relative w-full">
        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className={`${inputClass} ${
            email && !isValidEmail
              ? "border-red-400 focus:ring-red-400"
              : isValidEmail
              ? "border-emerald-400 focus:ring-emerald-400"
              : "border-gray-200 focus:ring-emerald-400"
          }`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
        />
      </div>

      {/* NAME */}
      <div className="relative w-full">
        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className={`${inputClass} ${
            name && !isValidName
              ? "border-red-400 focus:ring-red-400"
              : isValidName
              ? "border-emerald-400 focus:ring-emerald-400"
              : "border-gray-200 focus:ring-emerald-400"
          }`}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
        />
      </div>

      {/* PASSWORD */}
      <div className="relative w-full">
        <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className={`${inputClass} ${
            password && !isValidPassword
              ? "border-red-400 focus:ring-red-400"
              : isValidPassword
              ? "border-emerald-400 focus:ring-emerald-400"
              : "border-gray-200 focus:ring-emerald-400"
          }`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
        />
      </div>

      {/* MENSAJE PASSWORD */}
      {password && !isValidPassword && (
        <p className="text-xs text-red-500 -mt-2">
          Mínimo 6 caracteres, con mayúscula, minúscula y número
        </p>
      )}

      {/* CONFIRM PASSWORD */}
      <div className="relative w-full">
        <ShieldCheckIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          className={`${inputClass} ${
            passwordsDontMatch
              ? "border-red-400 focus:ring-red-400"
              : passwordsMatch
              ? "border-emerald-400 focus:ring-emerald-400"
              : "border-gray-200 focus:ring-emerald-400"
          }`}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirmar contraseña"
        />
      </div>

      {/* MENSAJES */}
      {passwordsDontMatch && (
        <p className="text-sm text-red-500 -mt-2">
          Las contraseñas no coinciden
        </p>
      )}

      {/* BOTÓN */}
      <button
        type="button"
        onClick={handleSignUp}
        disabled={
          loading ||
          passwordsDontMatch ||
          !isValidEmail ||
          !isValidPassword ||
          !isValidName
        }
        className="
          mt-2 w-full
          bg-gradient-to-r from-emerald-500 to-sky-500
          text-white
          rounded-lg p-2.5 font-medium
          shadow-sm hover:shadow-md hover:opacity-95
          transition disabled:opacity-50
        "
      >
        {loading ? "Registrando..." : "Registrarse"}
      </button>

      {/* LINK */}
      <div className="text-right" onClick={() => setActualOption("login")}>
        <p className="text-sm text-sky-600 hover:text-sky-800 cursor-pointer underline transition">
          ¿Ya tienes cuenta?
        </p>
      </div>
    </div>
  );
};

export default SignUp;