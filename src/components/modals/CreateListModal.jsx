import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useActionsStore } from "../../store/useActionsStore";

const CreateListModal = () => {
  const {
    isCreateListModalOpen,
    setIsCreateListModalOpen,
    setAnyModalOpen,
  } = useAppStore();

  const { createList } = useActionsStore();

  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ================= INPUT =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name" && value.length > 40) return;
    if (name === "description" && value.length > 100) return;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const res = await createList(form);

    if (res?.success) {
      setIsCreateListModalOpen(false);
      setAnyModalOpen(false);

      setForm({
        name: "",
        description: "",
      });

      setErrors({});
    } else {
      if (res?.errors) {
        const formatted = {};
        res.errors.forEach((err) => {
          formatted[err.field] = err.message;
        });
        setErrors(formatted);
      } else {
        setErrors({ general: "Error al crear la lista" });
      }
    }

    setLoading(false);
  };

  if (!isCreateListModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl">

        <h2 className="text-xl font-semibold mb-5 text-center">
          Crear lista
        </h2>

        {errors.general && (
          <p className="text-sm text-red-500 mb-2 text-center">
            {errors.general}
          </p>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* NAME */}
          <div>
            <input
              name="name"
              placeholder="Nombre de la lista *"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg text-sm"
            />
            <div className="text-xs text-gray-500 text-right">
              {form.name.length}/40
            </div>
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          {/* DESCRIPTION */}
          <div>
            <input
              name="description"
              placeholder="Descripción (opcional)"
              value={form.description}
              onChange={handleChange}
              className="w-full border p-3 rounded-lg text-sm"
            />
            <div className="text-xs text-gray-500 text-right">
              {form.description.length}/100
            </div>
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description}
              </p>
            )}
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 mt-4">

            <button
              type="button"
              onClick={() => {
                setIsCreateListModalOpen(false);
                setAnyModalOpen(false);
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg text-sm"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm"
            >
              {loading ? "Creando..." : "Crear lista"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default CreateListModal;