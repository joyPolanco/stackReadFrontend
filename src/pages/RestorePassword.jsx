import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";

const RestorePassword = () => {
  const { sendResetPasswordRequest } = useAuthStore();
  const [isSendingRequest, setSendingRequest] = useState();
  const [email, setEmail] = useState("");

  const handleOnSubmit = async (e) => {
  e.preventDefault();

  try {
    setSendingRequest(true);

    const res = await sendResetPasswordRequest(email);

    toast.success(`Se ha enviado un correo a ${email}`);


  } catch (err) {
    toast.error("Error enviando correo. Intenta de nuevo");
  } finally {
    setSendingRequest(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-center text-gray-800 mb-6">
          Enviar correo de cambio de contraseña
        </h3>

        <form onSubmit={handleOnSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ingresa tu correo
            </label>

            <input
              name="email"
              type="email"
              placeholder="correo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSendingRequest}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg transition"
          >
            Enviar correo
          </button>
        </form>
      </div>
    </div>
  );
};

export default RestorePassword;
