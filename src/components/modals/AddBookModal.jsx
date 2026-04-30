import React, { useState, useRef } from "react";
import { useActionsStore } from "../../store/useActionsStore.js";
import { useAppStore } from "../../store/useAppStore.js";

const AddBookModal = () => {
  const { lists, isAnyModalOpen, setAnyModalOpen } = useAppStore();
  const { createBoook, isCreatingBook } = useActionsStore();

  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    total_pages: "",
    pagesRead: 0,
    status: "to-read",
    listIds: [],
    cover: "",
    rating: 0,
  });

  const [preview, setPreview] = useState("");
  const [errors, setErrors] = useState({});

  const inputStyle =
    "w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400";

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "total_pages" ||
        name === "pagesRead" ||
        name === "rating"
          ? Number(value)
          : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));

    if (name === "cover") setPreview(value);
  };

  // ================= IMAGE =================
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreview(reader.result);

      setForm((prev) => ({
        ...prev,
        cover: reader.result, // base64
      }));
    };

    reader.readAsDataURL(file);
  };

  // ================= LISTS =================
  const toggleList = (id) => {
    setForm((prev) => ({
      ...prev,
      listIds: prev.listIds.includes(id)
        ? prev.listIds.filter((l) => l !== id)
        : [...prev.listIds, id],
    }));
  };

  // ================= VALIDACIÓN =================
  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = "Requerido";
    if (!form.author.trim()) newErrors.author = "Requerido";

    if (!form.total_pages || form.total_pages <= 0) {
      newErrors.total_pages = "Mayor que 0";
    }

    if (form.pagesRead > form.total_pages) {
      newErrors.pagesRead = "No puede superar";
    }

    return newErrors;
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await createBoook(form);

    if (!result?.success) {
      if (result?.errors) {
        const formatted = {};

        result.errors.forEach((e) => {
          if (e.field) {
            formatted[e.field] = e.message;
          } else {
            formatted.general = e.message;
          }
        });

        setErrors(formatted);
      }
      return;
    }

    setAnyModalOpen(false);
  };

  if (!isAnyModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-3">

      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto p-6">

        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          Nuevo libro
        </h2>

        {errors.general && (
          <p className="text-sm text-red-500 text-center mb-2">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* GRID */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* IMAGEN */}
            <div className="flex flex-col items-center gap-3">

              <div
                onClick={() => fileRef.current.click()}
                className="w-40 h-56 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-90"
              >
                {preview ? (
                  <img src={preview} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs text-gray-400">
                    Click para subir
                  </span>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <input
                name="cover"
                placeholder="URL de portada"
                onChange={handleChange}
                className={inputStyle}
              />
            </div>

            {/* FORM */}
            <div className="lg:col-span-2 flex flex-col gap-4">

              {/* TITULO */}
              <div>
                <label className="text-sm text-gray-600">Título</label>
                <input
                  name="title"
                  placeholder="Ej: El principito"
                  onChange={handleChange}
                  className={inputStyle}
                />
                {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
              </div>

              {/* AUTOR */}
              <div>
                <label className="text-sm text-gray-600">Autor</label>
                <input
                  name="author"
                  placeholder="Ej: Autor"
                  onChange={handleChange}
                  className={inputStyle}
                />
                {errors.author && <p className="text-xs text-red-500">{errors.author}</p>}
              </div>

              {/* GRID NUMEROS */}
              <div className="grid sm:grid-cols-3 gap-3">

                <div>
                  <label className="text-sm text-gray-600">Páginas totales</label>
                  <input
                    name="total_pages"
                    type="number"
                    placeholder="200"
                    onChange={handleChange}
                    className={inputStyle}
                  />
                  {errors.total_pages && (
                    <p className="text-xs text-red-500">{errors.total_pages}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Páginas leídas</label>
                  <input
                    name="pagesRead"
                    type="number"
                    placeholder="50"
                    onChange={handleChange}
                    className={inputStyle}
                  />
                  {errors.pagesRead && (
                    <p className="text-xs text-red-500">{errors.pagesRead}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm text-gray-600">Calificación</label>
                  <input
                    name="rating"
                    type="number"
                    min="0"
                    max="5"
                    placeholder="0 - 5"
                    onChange={handleChange}
                    className={inputStyle}
                  />
                </div>

              </div>

              {/* STATUS */}
              <div>
                <label className="text-sm text-gray-600">Estado</label>
                <select
                  name="status"
                  onChange={handleChange}
                  className={inputStyle}
                >
                  <option value="to-read">Quiero leer</option>
                  <option value="reading">Leyendo</option>
                  <option value="read">Leído</option>
                  <option value="abandoned">Abandonado</option>
                </select>
              </div>

            </div>
          </div>

          {/* LISTAS */}
          <div>
            <p className="text-sm font-medium mb-2">Listas</p>

            {lists.length === 0 ? (
              <p className="text-xs text-gray-500">No hay listas</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {lists.map((list) => (
                  <button
                    type="button"
                    key={list._id}
                    onClick={() => toggleList(list._id)}
                    className={`px-3 py-1 rounded-full text-xs border
                      ${
                        form.listIds.includes(list._id)
                          ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                          : "text-gray-600 border-gray-300"
                      }`}
                  >
                    {list.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAnyModalOpen(false)}
              className="px-4 py-2 bg-gray-100 rounded-lg text-sm"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={isCreatingBook}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm"
            >
              {isCreatingBook ? "Guardando..." : "Guardar"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddBookModal;