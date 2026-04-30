// pages/EntryPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Heart, 
  Edit2, 
  Save, 
  X,
  Quote,
  MessageCircle,
  Eye,
  Plus,
  Trash2
} from 'lucide-react';
import { useActionsStore } from '../store/useActionsStore';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

const EntryPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getEntryDetail, updateEntry } = useActionsStore();
  
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEntry, setEditedEntry] = useState(null);
  const [newComment, setNewComment] = useState({ texto: '', color: '#10b981' });
  const [editingCommentIndex, setEditingCommentIndex] = useState(null);
  const [saving, setSaving] = useState(false);

  const colors = [
    { value: '#10b981', name: 'Verde' },
    { value: '#3b82f6', name: 'Azul' },
    { value: '#f59e0b', name: 'Ámbar' },
    { value: '#ef4444', name: 'Rojo' },
    { value: '#8b5cf6', name: 'Púrpura' },
    { value: '#ec4899', name: 'Rosa' }
  ];

  useEffect(() => {
    loadEntry();
  }, [id]);

  const loadEntry = async () => {
    try {
      setLoading(true);
      const data = await getEntryDetail(id);
      setEntry(data);
      setEditedEntry(data);
    } catch (error) {
      console.error('Error loading entry:', error);
      toast.error('Error al cargar la entrada');
      navigate('/entries');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedData = {
        cite: editedEntry.cite,
        isFavoriteMoment: editedEntry.isFavoriteMoment,
        comments: editedEntry.comments
      };
      const result = await updateEntry(id, updatedData);
      setEntry(result);
      setIsEditing(false);
      toast.success('Entrada actualizada');
    } catch (error) {
      console.error(error);
      toast.error('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedEntry(entry);
    setIsEditing(false);
    setEditingCommentIndex(null);
  };

  const addComment = () => {
    if (!newComment.texto.trim()) return;
    
    const updatedComments = [...(editedEntry.comments || []), { 
      texto: newComment.texto, 
      color: newComment.color 
    }];
    setEditedEntry({ ...editedEntry, comments: updatedComments });
    setNewComment({ texto: '', color: '#10b981' });
  };

  const updateComment = (index, texto, color) => {
    const updatedComments = [...editedEntry.comments];
    updatedComments[index] = { texto, color };
    setEditedEntry({ ...editedEntry, comments: updatedComments });
    setEditingCommentIndex(null);
  };

  const deleteComment = (index) => {
    const updatedComments = editedEntry.comments.filter((_, i) => i !== index);
    setEditedEntry({ ...editedEntry, comments: updatedComments });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), "d 'de' MMMM 'de' yyyy", { locale: es });
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Cargando entrada...</p>
        </div>
      </div>
    );
  }

  if (!entry) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center">
          <BookOpen size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">Entrada no encontrada</p>
          <button
            onClick={() => navigate('/entries')}
            className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
          >
            Volver a entradas
          </button>
        </div>
      </div>
    );
  }

  const currentData = isEditing ? editedEntry : entry;
  const book = entry.book;

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/entries')}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-0.5 transition-transform" />
              <span className="font-medium">Volver</span>
            </button>
            
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-sm"
              >
                <Edit2 size={16} />
                <span>Editar</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
                >
                  <X size={16} />
                  <span>Cancelar</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition shadow-sm disabled:opacity-50"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  <span>Guardar</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        
        {/* Información del libro */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="flex gap-4">
            <div className="w-24 h-32 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 shadow-md">
              {book?.cover ? (
                <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen size={32} className="text-slate-300" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h1 className="text-xl font-bold text-slate-800 mb-1">{book?.title}</h1>
              <p className="text-slate-500 mb-3">{book?.author}</p>
              
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1 text-slate-500">
                  <Calendar size={14} />
                  <span>{formatDate(entry.date)}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <BookOpen size={14} />
                  <span>Páginas {entry.startPage} - {entry.endPage}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-medium">
                  <Eye size={14} />
                  <span>{entry.readPages} páginas leídas</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cita favorita */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200 p-6 mb-6">
          <div className="flex items-start gap-3">
            <Quote size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-amber-800 mb-2">Cita destacada</h3>
              {isEditing ? (
                <textarea
                  value={currentData.cite || ''}
                  onChange={(e) => setEditedEntry({ ...editedEntry, cite: e.target.value })}
                  placeholder="Agrega una cita memorable..."
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 outline-none transition"
                />
              ) : (
                <p className="text-amber-800 italic">
                  {currentData.cite ? `"${currentData.cite}"` : "Sin cita agregada"}
                </p>
              )}
            </div>
            {isEditing ? (
              <button
                onClick={() => setEditedEntry({ ...editedEntry, isFavoriteMoment: !editedEntry.isFavoriteMoment })}
                className={`p-2 rounded-full transition ${editedEntry.isFavoriteMoment ? 'text-red-500' : 'text-slate-300'}`}
              >
                <Heart size={20} fill={editedEntry.isFavoriteMoment ? 'currentColor' : 'none'} />
              </button>
            ) : (
              currentData.isFavoriteMoment && (
                <Heart size={18} className="text-red-500 fill-red-500 flex-shrink-0" />
              )
            )}
          </div>
        </div>

        {/* Comentarios */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageCircle size={18} className="text-emerald-500" />
              <h3 className="font-semibold text-slate-800">
                Comentarios {currentData.comments?.length > 0 && `(${currentData.comments.length})`}
              </h3>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {currentData.comments?.length === 0 && (
              <div className="px-6 py-12 text-center">
                <MessageCircle size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-400">No hay comentarios aún</p>
                {isEditing && (
                  <p className="text-sm text-slate-400 mt-1">Usa el formulario de abajo para agregar uno</p>
                )}
              </div>
            )}

            {currentData.comments?.map((comment, index) => (
              <div key={index} className="px-6 py-4 hover:bg-slate-50 transition">
                {isEditing && editingCommentIndex === index ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={comment.texto}
                        onChange={(e) => {
                          const updated = [...currentData.comments];
                          updated[index].texto = e.target.value;
                          setEditedEntry({ ...editedEntry, comments: updated });
                        }}
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none"
                        placeholder="Texto del comentario"
                        autoFocus
                      />
                      <select
                        value={comment.color}
                        onChange={(e) => {
                          const updated = [...currentData.comments];
                          updated[index].color = e.target.value;
                          setEditedEntry({ ...editedEntry, comments: updated });
                        }}
                        className="px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-400 outline-none"
                      >
                        {colors.map(c => (
                          <option key={c.value} value={c.value}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => updateComment(index, comment.texto, comment.color)}
                        className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingCommentIndex(null)}
                        className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300 transition"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between group">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div 
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: comment.color }}
                        />
                        <p className="text-slate-700 leading-relaxed">{comment.texto}</p>
                      </div>
                    </div>
                    {isEditing && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button
                          onClick={() => setEditingCommentIndex(index)}
                          className="p-1 text-slate-400 hover:text-emerald-500 transition"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteComment(index)}
                          className="p-1 text-slate-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Agregar comentario */}
            {isEditing && (
              <div className="px-6 py-4 bg-slate-50">
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <textarea
                      value={newComment.texto}
                      onChange={(e) => setNewComment({ ...newComment, texto: e.target.value })}
                      placeholder="Escribe un comentario..."
                      rows="2"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 outline-none resize-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <select
                      value={newComment.color}
                      onChange={(e) => setNewComment({ ...newComment, color: e.target.value })}
                      className="px-2 py-1.5 rounded-lg border border-slate-200 text-sm focus:border-emerald-400 outline-none"
                    >
                      {colors.map(c => (
                        <option key={c.value} value={c.value}>{c.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={addComment}
                      disabled={!newComment.texto.trim()}
                      className="flex items-center justify-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm hover:bg-emerald-600 transition disabled:opacity-50"
                    >
                      <Plus size={14} />
                      <span>Agregar</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tarjeta de resumen */}
        <div className="mt-6 bg-gradient-to-r from-emerald-50 to-sky-50 rounded-2xl p-6 border border-emerald-100">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-emerald-600">{entry.readPages}</p>
              <p className="text-xs text-slate-500">Páginas leídas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{entry.endPage - entry.startPage + 1}</p>
              <p className="text-xs text-slate-500">Rango de páginas</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{entry.comments?.length || 0}</p>
              <p className="text-xs text-slate-500">Comentarios</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {entry.isFavoriteMoment ? '❤️' : '📖'}
              </p>
              <p className="text-xs text-slate-500">Momento favorito</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;