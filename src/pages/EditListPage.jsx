import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Search, BookOpen, Trash2, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useActionsStore } from '../store/useActionsStore';
import toast from 'react-hot-toast';

const EditListPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListForEdit, updateList } = useActionsStore();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [listData, setListData] = useState({
    name: '',
    description: '',
    cover: ''
  });
  const [currentBooks, setCurrentBooks] = useState([]);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadListData();
  }, [id]);

  const loadListData = async () => {
    setLoading(true);
    try {
      const data = await getListForEdit(id);
      setListData({
        name: data.list.name,
        description: data.list.description || '',
        cover: data.list.cover || ''
      });
      setCurrentBooks(data.currentBooks || []);
      setAvailableBooks(data.availableBooks || []);
    } catch (error) {
      console.error('Error loading list:', error);
      toast.error('Error al cargar la lista');
      navigate('/lists');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!listData.name.trim()) {
      toast.error('El nombre de la lista es requerido');
      return;
    }

    setSaving(true);
    try {
      const bookIds = currentBooks.map(book => book.id);
      const result = await updateList(id, {
        name: listData.name,
        description: listData.description,
        bookIds
      });
      
      if (result.success) {
        navigate(`/lists/${id}/books`);
      }
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveBook = (bookId) => {
    const bookToRemove = currentBooks.find(b => b.id === bookId);
    if (bookToRemove) {
      setCurrentBooks(currentBooks.filter(b => b.id !== bookId));
      setAvailableBooks([...availableBooks, bookToRemove]);
    }
  };

  const handleAddBook = (book) => {
    setCurrentBooks([...currentBooks, book]);
    setAvailableBooks(availableBooks.filter(b => b.id !== book.id));
    setShowAddModal(false);
    setSearchTerm('');
  };

  const filteredAvailableBooks = availableBooks.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-4xl flex items-center justify-center bg-gradient-to-br from-slate-50 to-white overflow-y-scroll ">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Cargando lista...</p>
        </div>
      </div>
    );
  }

  return (
<div className="h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-50">
<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col overflow-hidden">        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-200">
          <button
            onClick={() => navigate(`/lists/${id}`)}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-all duration-200"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-medium">Volver a la lista</span>
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 font-medium shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save size={18} />
            )}
            Guardar cambios
          </button>
        </div>

        {/* FORMULARIO DE LISTA */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden mb-8">
          <div className="p-6 md:p-8 space-y-6">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Nombre de la lista
              </label>
              <input
                type="text"
                value={listData.name}
                onChange={(e) => setListData({ ...listData, name: e.target.value })}
                className="w-full text-2xl font-bold text-slate-800 border-b-2 border-slate-200 focus:border-emerald-500 outline-none transition-colors bg-transparent px-0 py-2"
                placeholder="Mi lista increíble"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Descripción
              </label>
              <textarea
                value={listData.description}
                onChange={(e) => setListData({ ...listData, description: e.target.value })}
                className="w-full text-slate-600 border-b-2 border-slate-200 focus:border-emerald-500 outline-none transition-colors bg-transparent px-0 py-2 resize-none"
                rows={3}
                placeholder="¿De qué trata esta lista?"
              />
            </div>
          </div>
        </div>

        {/* SECCIÓN DE LIBROS */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">
                  Libros en esta lista
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  {currentBooks.length} {currentBooks.length === 1 ? 'libro' : 'libros'}
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center gap-2 transition-colors"
              >
                <Plus size={16} />
                Agregar libro
              </button>
            </div>

            {/* Lista de libros actuales */}
            {currentBooks.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">No hay libros en esta lista</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-3 text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Agregar tu primer libro
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                {currentBooks.map((book) => (
                  <div
                    key={book.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                        {book.cover ? (
                          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen size={20} className="text-slate-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800">{book.title}</h4>
                        <p className="text-sm text-slate-500">{book.author}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveBook(book.id)}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL PARA AGREGAR LIBROS */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-800">Agregar libros</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              {/* Buscador */}
              <div className="relative mt-4">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar por título o autor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[50vh]">
              {filteredAvailableBooks.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen size={48} className="mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500">
                    {searchTerm ? 'No se encontraron libros' : 'No hay más libros disponibles'}
                  </p>
                  {!searchTerm && (
                    <p className="text-sm text-slate-400 mt-1">
                      Todos tus libros ya están en esta lista
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid gap-3">
                  {filteredAvailableBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-emerald-50 transition-colors group cursor-pointer"
                      onClick={() => handleAddBook(book)}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0">
                          {book.cover ? (
                            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <BookOpen size={20} className="text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-slate-800">{book.title}</h4>
                          <p className="text-sm text-slate-500">{book.author}</p>
                        </div>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                          <Plus size={16} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <button
                onClick={() => setShowAddModal(false)}
                className="w-full px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditListPage;