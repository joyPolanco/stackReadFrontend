import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const MAX_SIZE = 5 * 1024 * 1024;

const EditProfileModal = () => {
  const { setEditProfileModalOpen } = useAppStore();
  const { authUser, updateProfile } = useAuthStore();

  const [name, setName] = useState(authUser?.name || "");
  const [password, setPassword] = useState("");
  const [preview, setPreview] = useState(authUser?.profilePic || "");
  const [imageBase64, setImageBase64] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // ================= IMAGEN =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast.error("Formato de imagen no válido");
      return;
    }

    if (file.size > MAX_SIZE) {
      toast.error("La imagen no puede superar los 5MB");
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = () => {
      img.src = reader.result;
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 300;
      const MAX_HEIGHT = 300;

      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height = height * (MAX_WIDTH / width);
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width = width * (MAX_HEIGHT / height);
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL("image/jpeg", 0.7);

      setPreview(compressed);
      setImageBase64(compressed);
    };
  };

  // ================= BUILD DATA =================
  const buildUpdateData = () => {
    const data = {};

    if (name && name !== authUser.name) {
      data.name = name;
    }

    if (password) {
      data.password = password;
    }

    if (imageBase64 && imageBase64 !== authUser.profilePic) {
      data.picture = imageBase64; // ✔ importante
    }

    return data;
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const data = buildUpdateData();

    if (Object.keys(data).length === 0) {
      toast("No hay cambios");
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      await updateProfile(data);

      toast.success("Perfil actualizado");
      setEditProfileModalOpen(false);

    } catch (error) {
        console.log(error)
      const res = error.response?.data;

      if (res?.errors) {
        const formatted = {};
        res.errors.forEach((e) => {
          formatted[e.field] = e.message;
        });

        setErrors(formatted);
        return;
      }

      toast.error(res?.message || "Error al actualizar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl relative">

        {/* CERRAR */}
        <button
          onClick={() => setEditProfileModalOpen(false)}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Editar perfil
        </h2>

        {/* IMAGEN */}
        <div className="flex flex-col items-center mb-4">
          <label className="cursor-pointer group">
            <div className="w-24 h-24 rounded-full overflow-hidden border relative">

              {preview ? (
                <img
                  src={preview}
                  className="w-full h-full object-cover"
                  alt="preview"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-sky-500 text-white text-lg">
                  {authUser?.name?.charAt(0)?.toUpperCase()}
                </div>
              )}

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition">
                Cambiar
              </div>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          <p className="text-xs text-gray-400 mt-2">Máx 5MB</p>

          {errors.picture && (
            <p className="text-sm text-red-500 mt-1">{errors.picture}</p>
          )}
        </div>

        {/* EMAIL */}
        <input
          type="email"
          value={authUser?.email || ""}
          disabled
          className="w-full p-2 mb-3 rounded-lg border bg-gray-100 text-gray-500"
        />

        {/* NOMBRE */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre"
          className={`w-full p-2 mb-1 rounded-lg border ${
            errors.name ? "border-red-400" : ""
          }`}
        />
        {errors.name && (
          <p className="text-sm text-red-500 mb-2">{errors.name}</p>
        )}

        {/* PASSWORD */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nueva contraseña"
          className={`w-full p-2 mb-1 rounded-lg border ${
            errors.password ? "border-red-400" : ""
          }`}
        />
        {errors.password && (
          <p className="text-sm text-red-500 mb-3">{errors.password}</p>
        )}

        {/* BOTONES */}
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-emerald-500 text-white p-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>

          <button
            onClick={() => setEditProfileModalOpen(false)}
            className="flex-1 bg-gray-200 p-2 rounded-lg"
          >
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
};

export default EditProfileModal;