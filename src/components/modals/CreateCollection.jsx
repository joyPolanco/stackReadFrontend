import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { useActionsStore } from "../../store/useActionsStore";

const CreateCollection = () => {
  const { setCreateCollectionModalOpen, lists } = useAppStore();
  const { createCollection } = useActionsStore();

  const [form, setForm] = useState({
    name: "",
    description: "",
    lists: [],
  });

  const [loading, setLoading] = useState(false);

  const toggleList = (id) => {
    setForm((prev) => ({
      ...prev,
      lists: prev.lists.includes(id)
        ? prev.lists.filter((l) => l !== id)
        : [...prev.lists, id],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    const res = await createCollection(form);

    if (res?.success) {
      setCreateCollectionModalOpen(false);
      setForm({ name: "", description: "", lists: [] });
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
      
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl flex flex-col max-h-[90vh] overflow-hidden">

        {/* HEADER */}
        <div className="bg-emerald-600 text-white p-4">
          <h2 className="text-lg font-semibold">Crear colección</h2>
          <p className="text-sm text-emerald-100">
            Organiza tus listas en colecciones de forma sencilla y visual.
          </p>
        </div>

        {/* CONTENT */}
        <div className="p-5 space-y-4 overflow-y-auto">

          {/* NAME */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              placeholder="Ej: Mis proyectos"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="w-full mt-1 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 p-2 rounded-lg outline-none"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Descripción
            </label>
            <input
              placeholder="Describe el propósito de la colección"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full mt-1 border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 p-2 rounded-lg outline-none"
            />
          </div>

          {/* LISTS */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">
                Listas disponibles
              </label>
              <span className="text-xs text-gray-400">
                Selecciona las listas que quieres incluir
              </span>
            </div>

            <div className="border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">

              {lists?.length > 0 ? (
                lists.map((l) => (
                  <label
                    key={l._id}
                    className="flex items-center gap-2 text-sm py-2 px-2 rounded hover:bg-emerald-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.lists.includes(l._id)}
                      onChange={() => toggleList(l._id)}
                      className="accent-emerald-600"
                    />
                    <span className="text-gray-700">{l.name}</span>
                  </label>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-6">
                  No hay listas creadas aún.  
                  Puedes crear listas primero para organizarlas aquí.
                </div>
              )}

            </div>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="p-4 border-t flex justify-end gap-2 bg-white">

          <button
            onClick={() => setCreateCollectionModalOpen(false)}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear colección"}
          </button>

        </div>

      </div>
    </div>
  );
};

export default CreateCollection;