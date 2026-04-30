// components/modals/AddEntryModal.jsx
import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { useActionsStore } from "../../store/useActionsStore";
import { useAppStore } from "../../store/useAppStore";

const AddEntryModal = () => {
  const { setAddEntryModalOpen } = useAppStore();
  const { books } = useAppStore();
  const { addEntry } = useActionsStore();

  const today = new Date().toISOString().split("T")[0];

  const [bookId, setBookId] = useState("");
  const [fecha, setFecha] = useState(today);
  const [paginaInicial, setPaginaInicial] = useState(1);
  const [paginaFinal, setPaginaFinal] = useState(1);

  const [comentarioActual, setComentarioActual] = useState("");
  const [comentarios, setComentarios] = useState([]);
  const [color, setColor] = useState("bg-yellow-200");

  const [cita, setCita] = useState("");
  const [favorito, setFavorito] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const MAX_COMENTARIOS = 10;

  const colores = [
    "bg-yellow-200",
    "bg-green-200",
    "bg-blue-200",
    "bg-pink-200",
    "bg-purple-200",
  ];

  const palabrasCount = comentarioActual
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
    
  const onClose = () => {
    setAddEntryModalOpen(false);
    // Resetear formulario
    setBookId("");
    setFecha(today);
    setPaginaInicial(1);
    setPaginaFinal(1);
    setComentarios([]);
    setCita("");
    setFavorito(false);
    setError("");
  };

  const handleAddComentario = () => {
    if (!comentarioActual.trim()) return;
    if (palabrasCount > 40) return;
    if (comentarios.length >= MAX_COMENTARIOS) return;

    setComentarios([...comentarios, { texto: comentarioActual, color }]);
    setComentarioActual("");
  };

  const handleSave = async () => {
    setError("");

    if (!bookId) {
      setError("Selecciona un libro");
      return;
    }
    
    const totalPaginas = paginaFinal - paginaInicial + 1;
    if (totalPaginas <= 0) {
      setError("Rango de páginas inválido");
      return;
    }

    const nuevaEntrada = {
      book: bookId,
      date: fecha,
      startPage: paginaInicial,
      endPage: paginaFinal,
      cite: cita,
      isFavoriteMoment: favorito,
      comments: comentarios,
    };

    try {
      setLoading(true);
      const result = await addEntry(nuevaEntrada);
      
      if (result && result.success) {
        onClose();
      } else if (result && result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Error al guardar la entrada");
    } finally {
      setLoading(false);
    }
  };

  const totalPaginas = paginaFinal >= paginaInicial ? paginaFinal - paginaInicial + 1 : 0;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-xl border border-slate-100 flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Nueva entrada</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition">
            <X size={20} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-5 overflow-y-auto space-y-6">
          {/* Error message */}
          {error && (
            <div className="text-sm text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-xl">
              {error}
            </div>
          )}

          {/* LIBRO */}
          <div>
            <label className="text-sm text-slate-500">Libro *</label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition"
            >
              <option value="">Seleccionar libro</option>
              {books?.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.title}
                </option>
              ))}
            </select>
          </div>

          {/* FECHA */}
          <div>
            <label className="text-sm text-slate-500">Fecha *</label>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none transition"
            />
          </div>

          {/* PAGINAS */}
          <div>
            <label className="text-sm text-slate-500">Progreso de lectura (páginas) *</label>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <div className="flex flex-col w-full">
                <span className="text-xs text-slate-400 mb-1">Desde</span>
                <input
                  type="number"
                  min={1}
                  value={paginaInicial}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    setPaginaInicial(value);
                    if (value > paginaFinal) setPaginaFinal(value);
                  }}
                  className="px-3 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>
              <div className="flex flex-col w-full">
                <span className="text-xs text-slate-400 mb-1">Hasta</span>
                <input
                  type="number"
                  min={paginaInicial}
                  value={paginaFinal}
                  onChange={(e) => setPaginaFinal(Number(e.target.value))}
                  className="px-3 py-2.5 border border-slate-200 rounded-xl"
                />
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {totalPaginas > 0 ? `${totalPaginas} páginas` : "Rango inválido"}
            </p>
          </div>

          {/* CITA */}
          <div>
            <label className="text-sm text-slate-500">Cita destacada</label>
            <textarea
              value={cita}
              onChange={(e) => setCita(e.target.value)}
              className="w-full mt-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none focus:ring-2 focus:ring-emerald-400"
              rows={3}
              placeholder="Escribe una cita memorable..."
            />
          </div>

          {/* FAVORITO */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={favorito}
              onChange={() => setFavorito(!favorito)}
              className="accent-emerald-500"
            />
            <span className="text-sm text-slate-500">Momento importante</span>
          </div>

          {/* COMENTARIOS */}
          <div>
            <label className="text-sm text-slate-500">Comentarios</label>
            <div className="flex gap-2 mt-2">
              <input
                value={comentarioActual}
                onChange={(e) => setComentarioActual(e.target.value)}
                className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl"
                placeholder="Comentario..."
              />
              <button
                onClick={handleAddComentario}
                disabled={comentarios.length >= MAX_COMENTARIOS}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white px-3 rounded-xl transition"
              >
                <Plus size={16} />
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {palabrasCount}/40 palabras · {comentarios.length}/{MAX_COMENTARIOS}
            </p>

            {/* COLORES */}
            <div className="flex gap-2 mt-3">
              {colores.map((c) => (
                <div
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-5 h-5 rounded-full cursor-pointer ${c} ${
                    color === c ? "ring-2 ring-slate-700" : ""
                  }`}
                />
              ))}
            </div>

            {/* LISTA COMENTARIOS */}
            <div className="mt-3 max-h-44 overflow-y-auto flex flex-col gap-2 pr-1">
              {comentarios.length === 0 && (
                <p className="text-xs text-slate-400">Sin comentarios</p>
              )}
              {comentarios.map((c, i) => (
                <div key={i} className={`${c.color} text-sm px-3 py-2 rounded-xl shadow-sm`}>
                  {c.texto}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition"
          >
            Cancelar
          </button>
          <button
            disabled={!bookId || totalPaginas <= 0 || loading}
            className="px-4 py-2 bg-emerald-500 disabled:bg-slate-300 text-white rounded-xl transition"
            onClick={handleSave}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEntryModal;