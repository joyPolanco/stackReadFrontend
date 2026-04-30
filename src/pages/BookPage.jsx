// pages/BookPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { useActionsStore } from "../store/useActionsStore";
import {
  ArrowLeft,
  Save,
  Eye,
  Pencil,
  X,
  Check,
  Upload,
  Star,
  Calendar,
  Heart,
  BookOpen,
  TrendingUp,
  MessageCircle,
  Quote
} from "lucide-react";
import toast from "react-hot-toast";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const BookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { lists, getBooks, fetchLists, getBookById } = useAppStore();
  const { updateBook } = useActionsStore();

  const [mode, setMode] = useState("view");
  const [form, setForm] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  
  // Datos del libro con entradas
  const [bookData, setBookData] = useState(null);
  const [entries, setEntries] = useState([]);
  const [favoriteMoments, setFavoriteMoments] = useState([]);
  const [cites, setCites] = useState([]);
  const [stats, setStats] = useState({ totalEntries: 0, totalFavorites: 0, totalCites: 0 });
  const [loading, setLoading] = useState(true);

  // Cargar libro y entradas
  useEffect(() => {
    loadBookData();
  }, [id]);

  const loadBookData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await getBookById(id);
      setBookData(data.book);
      setForm({
        ...data.book,
        listIds: data.book.listIds || [],
      });
      setEntries(data.entries || []);
      setFavoriteMoments(data.favoriteMoments || []);
      setCites(data.cites || []);
      setStats(data.stats || { totalEntries: 0, totalFavorites: 0, totalCites: 0 });
    } catch (error) {
      console.error("Error loading book:", error);
      toast.error("Error al cargar el libro");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Cargando libro...</p>
        </div>
      </div>
    );
  }

  const handleNumericChange = (e, fieldName) => {
    let value = e.target.value;
    value = value.replace(/\./g, '');
    value = value.replace(/[^\d]/g, '');
    let intValue = value === '' ? 0 : parseInt(value, 10);
    
    if (fieldName === 'pagesRead') {
      if (intValue < 0) intValue = 0;
      if (form.total_pages && intValue > form.total_pages) {
        intValue = form.total_pages;
        setErrors(prev => ({ ...prev, pagesRead: `No puede superar las ${form.total_pages} páginas totales` }));
      } else {
        setErrors(prev => ({ ...prev, pagesRead: null }));
      }
    }
    
    if (fieldName === 'total_pages') {
      if (intValue < 1) intValue = 1;
      if (form.pagesRead && intValue < form.pagesRead) {
        setErrors(prev => ({ ...prev, total_pages: 'Las páginas totales no pueden ser menores a las leídas' }));
      } else {
        setErrors(prev => ({ ...prev, total_pages: null }));
      }
    }
    
    setForm({ ...form, [fieldName]: intValue });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const toggleList = (listId) => {
    if (mode !== "edit") return;
    setForm((prev) => {
      const newListIds = prev.listIds?.includes(listId)
        ? prev.listIds.filter((id) => id !== listId)
        : [...(prev.listIds || []), listId];
      return { ...prev, listIds: newListIds };
    });
  };

  const handleCoverClick = () => {
    if (mode !== "edit") return;
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, cover: "La imagen no puede superar los 5MB" }));
        return;
      }
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, cover: "Solo se permiten imágenes" }));
        return;
      }
      setUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, coverPreview: reader.result, coverFile: file });
        setUploading(false);
        setErrors(prev => ({ ...prev, cover: null }));
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleSave = async () => {
    const validationErrors = {};
    if (!form.title?.trim()) validationErrors.title = "El título es obligatorio";
    if (!form.author?.trim()) validationErrors.author = "El autor es obligatorio";
    if (form.pagesRead < 0) validationErrors.pagesRead = "Las páginas leídas no pueden ser negativas";
    if (form.total_pages < 1) validationErrors.total_pages = "Las páginas totales deben ser al menos 1";
    if (form.pagesRead > form.total_pages) {
      validationErrors.pagesRead = `Las páginas leídas (${form.pagesRead}) no pueden superar las totales (${form.total_pages})`;
    }
    if (form.rating < 0 || form.rating > 5) {
      validationErrors.rating = "La calificación debe estar entre 0 y 5";
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("author", form.author);
      formData.append("status", form.status);
      formData.append("rating", form.rating || 0);
      formData.append("pagesRead", form.pagesRead);
      formData.append("total_pages", form.total_pages);
      formData.append("listIds", JSON.stringify(form.listIds || []));
      if (form.coverFile) formData.append("cover", form.coverFile);
      
      await updateBook(id, formData);
      await loadBookData(); // Recargar datos
      await getBooks();
      if (fetchLists) await fetchLists();
      
      setMode("view");
      setErrors({});
      toast.success("Libro actualizado correctamente");
    } catch (error) {
      console.error("Error al guardar:", error);
      setErrors({ general: "Error al guardar los cambios. Intenta nuevamente." });
      toast.error("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const progress = form.total_pages > 0 ? Math.round((form.pagesRead / form.total_pages) * 100) : 0;

  const getStatusText = (status) => {
    const statusMap = {
      "to-read": "📚 Por leer",
      reading: "📖 Leyendo",
      read: "✅ Leído",
      abandoned: "⏸ Abandonado",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      "to-read": "bg-blue-100 text-blue-700 border-blue-200",
      reading: "bg-amber-100 text-amber-700 border-amber-200",
      read: "bg-emerald-100 text-emerald-700 border-emerald-200",
      abandoned: "bg-red-100 text-red-700 border-red-200",
    };
    return colorMap[status] || "bg-gray-100 text-gray-700";
  };

  const coverUrl = form.coverPreview || form.cover;

  const getDisplayLists = () => {
    if (mode === "edit") return lists;
    return lists?.filter(list => form.listIds?.includes(list._id)) || [];
  };

  const displayLists = getDisplayLists();

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), "d MMM yyyy", { locale: es });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200">
          <button
            onClick={() => navigate("/books")}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-all duration-200"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">Volver a mis libros</span>
          </button>

          <div className="flex items-center gap-2 bg-white rounded-full shadow-sm border border-slate-200 p-1">
            <button
              onClick={() => { setMode("view"); setErrors({}); }}
              className={`px-5 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-200
                ${mode === "view" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
            >
              <Eye size={15} /> Ver detalles
            </button>
            <button
              onClick={() => {
                setMode("edit");
                setForm({ ...bookData, listIds: bookData?.listIds || [] });
                setErrors({});
              }}
              className={`px-5 py-2 rounded-full flex items-center gap-2 text-sm font-medium transition-all duration-200
                ${mode === "edit" ? "bg-emerald-600 text-white shadow-md" : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"}`}
            >
              <Pencil size={15} /> Editar libro
            </button>
          </div>
        </div>

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            {errors.general}
          </div>
        )}

        {/* CONTENIDO PRINCIPAL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMNA IZQUIERDA - PORTADA */}
          <div className="lg:col-span-1">
            <div
              onClick={handleCoverClick}
              className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-xl transition-all duration-300
                ${mode === "edit" ? "cursor-pointer ring-2 ring-emerald-500 ring-offset-2 hover:scale-[1.02]" : ""}`}
            >
              <div className="aspect-[3/4] relative">
                {coverUrl ? (
                  <img src={coverUrl} alt={form.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-100 to-slate-200">
                    <svg className="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    <p className="text-sm font-medium">Sin portada</p>
                    {mode === "edit" && (
                      <p className="text-xs mt-2 flex items-center gap-1 text-emerald-600">
                        <Upload size={12} /> Haz clic para subir
                      </p>
                    )}
                  </div>
                )}

                {mode === "edit" && !uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2 text-emerald-700 font-medium">
                      <Upload size={16} /> Cambiar portada
                    </div>
                  </div>
                )}

                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
            {errors.cover && <p className="text-xs text-red-500 mt-2">{errors.cover}</p>}
          </div>

          {/* COLUMNA DERECHA - INFORMACIÓN */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="p-6 md:p-8 space-y-6">
                {/* Título */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Título</label>
                  {mode === "view" ? (
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 leading-tight">{form.title}</h1>
                  ) : (
                    <>
                      <input name="title" value={form.title} onChange={handleChange}
                        className={`w-full text-3xl md:text-4xl font-bold text-slate-800 border-b-2 outline-none transition-colors bg-transparent px-0
                          ${errors.title ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
                        placeholder="Título del libro"/>
                      {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                    </>
                  )}
                </div>

                {/* Autor */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Autor</label>
                  {mode === "view" ? (
                    <p className="text-lg text-slate-600">{form.author}</p>
                  ) : (
                    <>
                      <input name="author" value={form.author} onChange={handleChange}
                        className={`w-full text-lg text-slate-600 border-b-2 outline-none transition-colors bg-transparent px-0
                          ${errors.author ? 'border-red-400 focus:border-red-500' : 'border-slate-200 focus:border-emerald-500'}`}
                        placeholder="Nombre del autor"/>
                      {errors.author && <p className="text-xs text-red-500 mt-1">{errors.author}</p>}
                    </>
                  )}
                </div>

                {/* Grid de datos */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado de lectura</label>
                    {mode === "view" ? (
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(form.status)}`}>
                        {getStatusText(form.status)}
                      </span>
                    ) : (
                      <select name="status" value={form.status} onChange={handleChange}
                        className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all">
                        <option value="to-read">📚 Por leer</option>
                        <option value="reading">📖 Leyendo</option>
                        <option value="read">✅ Leído</option>
                        <option value="abandoned">⏸️ Abandonado</option>
                      </select>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <Star size={12} /> Calificación
                    </label>
                    {mode === "view" ? (
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={20}
                            className={`${star <= (form.rating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}/>
                        ))}
                        <span className="ml-2 text-sm text-slate-500">({form.rating || 0}/5)</span>
                      </div>
                    ) : (
                      <>
                        <input type="number" step="0.5" min="0" max="5" name="rating" value={form.rating || 0} onChange={handleChange}
                          className={`w-24 p-2.5 border rounded-xl outline-none transition-all
                            ${errors.rating ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'}`}/>
                        {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
                      </>
                    )}
                  </div>
                </div>

                {/* Progreso de lectura */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Progreso de lectura</label>
                  {mode === "view" ? (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-600 mb-1">
                        <span>Páginas leídas</span>
                        <span className="font-medium">{form.pagesRead} / {form.total_pages}</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}/>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{progress}% completado</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex-1 min-w-[120px]">
                          <label className="text-xs text-slate-500 block mb-1">Páginas leídas</label>
                          <input type="text" inputMode="numeric" value={form.pagesRead} onChange={(e) => handleNumericChange(e, 'pagesRead')}
                            className={`w-full p-2.5 border-2 rounded-xl outline-none transition-all
                              ${errors.pagesRead ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'}`}
                            placeholder="0"/>
                          {errors.pagesRead && <p className="text-xs text-red-500 mt-1">{errors.pagesRead}</p>}
                        </div>
                        <div className="flex-1 min-w-[120px]">
                          <label className="text-xs text-slate-500 block mb-1">Páginas totales</label>
                          <input type="text" inputMode="numeric" value={form.total_pages} onChange={(e) => handleNumericChange(e, 'total_pages')}
                            className={`w-full p-2.5 border-2 rounded-xl outline-none transition-all
                              ${errors.total_pages ? 'border-red-400 focus:border-red-500 bg-red-50' : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'}`}
                            placeholder="1"/>
                          {errors.total_pages && <p className="text-xs text-red-500 mt-1">{errors.total_pages}</p>}
                        </div>
                      </div>
                      {form.total_pages > 0 && (
                        <div className="mt-3">
                          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
                              style={{ width: `${Math.min(100, (form.pagesRead / form.total_pages) * 100)}%` }}/>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">
                            {Math.min(100, Math.round((form.pagesRead / form.total_pages) * 100))}% completado
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* LISTAS */}
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {mode === "view" ? "Aparece en estas listas" : "Listas disponibles"}
                  </label>
                  {displayLists.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {displayLists.map((list) => {
                        const active = form.listIds?.includes(list._id) || false;
                        return (
                          <button key={list._id} onClick={() => toggleList(list._id)} disabled={mode !== "edit"}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2
                              ${active ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-300 shadow-sm"
                                : mode === "edit" ? "bg-slate-100 text-slate-600 border-2 border-transparent hover:bg-slate-200"
                                : "bg-slate-50 text-slate-500 border border-slate-200"}
                              ${mode !== "edit" ? "cursor-default" : "cursor-pointer"}`}>
                            {list.name}
                            {mode === "edit" && (active ? <X size={14} /> : <Check size={14} />)}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-slate-50 rounded-xl">
                      <p className="text-sm text-slate-400 italic">
                        {mode === "view" ? "Este libro no pertenece a ninguna lista" : "No hay listas disponibles. Crea una lista desde la página principal."}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE ESTADÍSTICAS RÁPIDAS */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Total sesiones</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalEntries}</p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <BookOpen size={20} className="text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Momentos favoritos</p>
                <p className="text-2xl font-bold text-amber-600">{stats.totalFavorites}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <Heart size={20} className="text-amber-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Citas registradas</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCites}</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Quote size={20} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* SECCIÓN DE ENTRADAS */}
        <div className="mt-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Calendar size={20} className="text-emerald-600" />
                Registro de lecturas
                <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-600 rounded-full">
                  {stats.totalEntries}
                </span>
              </h2>
            </div>

            <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto">
              {entries.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">No hay registros de lectura para este libro</p>
                  <p className="text-xs text-slate-400 mt-1">Las sesiones de lectura aparecerán aquí cuando agregues entradas</p>
                </div>
              ) : (
                entries.map((entry) => (
                  <div
                    key={entry.id || entry._id}
                    onClick={() => navigate(`/entries/${entry.id || entry._id}`)}
                    className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <Calendar size={14} className="text-emerald-500" />
                            <span className="font-medium">{formatDate(entry.date)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-slate-600">
                            <BookOpen size={14} className="text-emerald-500" />
                            <span>Páginas {entry.startPage} - {entry.endPage}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-emerald-600 font-medium">
                            <TrendingUp size={14} />
                            <span>{entry.readPages} páginas</span>
                          </div>
                          {entry.isFavoriteMoment && (
                            <div className="flex items-center gap-1 text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">
                              <Heart size={12} fill="currentColor" />
                              <span>Favorito</span>
                            </div>
                          )}
                        </div>
                        {entry.cite && (
                          <p className="text-sm text-amber-700 italic line-clamp-2 mb-2">"{entry.cite}"</p>
                        )}
                        {entry.comments && entry.comments.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <MessageCircle size={12} />
                            <span>{entry.comments.length} comentario(s)</span>
                          </div>
                        )}
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Eye size={14} className="text-emerald-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* SECCIÓN DE MOMENTOS FAVORITOS */}
        {favoriteMoments.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-orange-50">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Heart size={20} className="text-amber-500 fill-amber-500" />
                  Momentos favoritos
                  <span className="ml-2 px-2 py-0.5 text-xs bg-amber-100 text-amber-600 rounded-full">
                    {stats.totalFavorites}
                  </span>
                </h2>
              </div>

              <div className="divide-y divide-slate-100">
                {favoriteMoments.map((moment) => (
                  <div
                    key={moment.id || moment._id}
                    onClick={() => navigate(`/entries/${moment.id || moment._id}`)}
                    className="px-6 py-4 hover:bg-amber-50/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Heart size={16} className="text-amber-500 fill-amber-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-2">
                          <span className="text-sm text-slate-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(moment.date)}
                          </span>
                          <span className="text-sm text-emerald-600">
                            Páginas {moment.pages?.from} - {moment.pages?.to}
                          </span>
                        </div>
                        {moment.cite && (
                          <p className="text-amber-700 italic">"{moment.cite}"</p>
                        )}
                        {moment.comments && moment.comments.length > 0 && (
                          <div className="flex items-center gap-1 text-xs text-slate-400 mt-2">
                            <MessageCircle size={12} />
                            <span>{moment.comments.length} comentario(s)</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SECCIÓN DE CITAS */}
        {cites.length > 0 && (
          <div className="mt-8">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <Quote size={20} className="text-purple-500" />
                  Citas destacadas
                  <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-600 rounded-full">
                    {stats.totalCites}
                  </span>
                </h2>
              </div>

              <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto">
                {cites.map((cite) => (
                  <div
                    key={cite.id || cite._id}
                    onClick={() => navigate(`/entries/${cite.id || cite._id}`)}
                    className="px-6 py-4 hover:bg-purple-50/30 transition-colors cursor-pointer"
                  >
                    <p className="text-purple-700 italic">"{cite.text}"</p>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(cite.date)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Botón guardar */}
        {mode === "edit" && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-8 py-3 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 disabled:opacity-50"
            >
              {saving ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Guardando...</>
              ) : (
                <><Save size={18} /> Guardar cambios</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPage;