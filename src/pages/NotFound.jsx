import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const NotFound = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50 px-4">

      <div className="text-center max-w-md">

        {/* ICONO */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <AlertTriangle className="text-emerald-600" />
          </div>
        </div>

        {/* TITULO */}
        <h1 className="text-5xl font-bold text-gray-800">
          404
        </h1>

        {/* TEXTO */}
        <p className="text-gray-500 mt-2">
          La página que buscas no existe o fue movida.
        </p>

        {/* BOTÓN */}
        <Link
          to="/"
          className="
            inline-block mt-6
            px-5 py-2
            rounded-lg
            bg-gradient-to-r from-emerald-500 to-sky-500
            text-white
            font-medium
            shadow-sm
            hover:shadow-md
            hover:opacity-95
            transition
          "
        >
          Volver al inicio
        </Link>

      </div>
    </div>
  );
};

export default NotFound;