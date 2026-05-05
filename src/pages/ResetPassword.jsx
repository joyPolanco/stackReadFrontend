import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { checkResetPasswordToken, resetPassword } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [tokenStatus, setTokenStatus] = useState("");
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate= useNavigate();
  // VALIDAR TOKEN
  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await checkResetPasswordToken(token);
        setTokenStatus(res.data.message);
      } catch (error) {
        setTokenStatus(
          error.response?.data?.message || "Token inválido o expirado"
        );
      }
    };

    if (token) validateToken();
  }, [token, checkResetPasswordToken]);

  // VALIDACIÓN PASSWORD
  useEffect(() => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/;

    if (!password) {
      setError("");
      return;
    }

    if (!passwordRegex.test(password)) {
      setError("Debe tener mayúscula, minúscula, número y símbolo");
      return;
    }

    if (confirmPassword && password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError("");
  }, [password, confirmPassword]);

  // SUBMIT
  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setIsSendingRequest(true);

    const res = await resetPassword(token, password);

    if (res?.status === 200) {
      toast.success("Contraseña actualizada correctamente");

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    }
  } catch (err) {
    toast.error("Error al cambiar contraseña");
  } finally {
    setIsSendingRequest(false);
  }
};

  // LOADING TOKEN
  if (!tokenStatus) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-500">
        Validando enlace...
      </div>
    );
  }

  // TOKEN INVALIDO
  if (tokenStatus !== "Token válido") {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-xl shadow">
          {tokenStatus}
        </div>
      </div>
    );
  }

  // TOKEN VÁLIDO → FORM
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">

      <div className="bg-white w-full max-w-md shadow-2xl p-8 rounded-3xl border border-slate-100">

        {/* HEADER */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">
            Nueva contraseña
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Crea una contraseña segura para tu cuenta
          </p>
        </div>

        {/* IMAGE */}
        <div className="flex justify-center mb-6 opacity-80">
          <img
            src="https://res.cloudinary.com/divesugmp/image/upload/v1777352672/Bibliophile-rafiki_d9qsfu.png"
            className="h-40 object-contain"
            alt="reset"
          />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="password"
            placeholder="Nueva contraseña"
            className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />

          <input
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-emerald-400 outline-none"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />

          {error && (
            <div className="bg-red-50 text-red-500 text-sm p-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            disabled={!!error || isSendingRequest}
            className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 text-white py-3 rounded-xl font-medium hover:scale-[1.02] active:scale-[0.98] transition disabled:opacity-50"
          >
            {isSendingRequest ? "Cambiando..." : "Cambiar contraseña"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default ResetPassword;