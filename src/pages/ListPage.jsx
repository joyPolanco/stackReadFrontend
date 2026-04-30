// pages/ListPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit2, 
  Save, 
  X, 
  BookOpen, 
  CheckCircle, 
  Clock,
  Calendar,
  TrendingUp,
  Library,
  Check,
  Trash2,
  Loader,
  Star,
  User,
  Layers
} from 'lucide-react';
import { useActionsStore } from '../store/useActionsStore';
import { useAppStore } from '../store/useAppStore';
import toast from 'react-hot-toast';

const ListPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListWithBooks, updateList, updateListBooks, deleteList } = useActionsStore();
  const { getBooks } = useAppStore();
  
  const [list, setList] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingBooks, setIsEditingBooks] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedBooks, setSelectedBooks] = useState(new Set());
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadList();
    loadAllBooks();
  }, [id]);

  const loadList = async () => {
    setLoading(true);
    try {
      const result = await getListWithBooks(id);
      setList(result);
      setFormData({
        name: result.name,
        description: result.description || ''
      });
      // Inicializar libros seleccionados
      const initialSelected = new Set(result.books.map(book => book._id.toString()));
      setSelectedBooks(initialSelected);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar la lista');
      navigate('/lists');
    } finally {
      setLoading(false);
    }
  };

  const loadAllBooks = async () => {
    try {
      await getBooks();
      const allBooksState = useAppStore.getState().books;
      setAllBooks(allBooksState);
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSaveListInfo = async () => {
    if (!formData.name.trim()) {
      setErrors({ name: 'El nombre es requerido' });
      return;
    }

    setSaving(true);
    const result = await updateList(id, formData);
    
    if (result.success) {
      setList(prev => ({ ...prev, ...result.list }));
      setIsEditing(false);
    } else if (result.errors) {
      setErrors(result.errors);
    }
    setSaving(false);
  };

  const handleToggleBook = (bookId) => {
    const newSelected = new Set(selectedBooks);
    if (newSelected.has(bookId)) {
      newSelected.delete(bookId);
    } else {
      newSelected.add(bookId);
    }
    setSelectedBooks(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedBooks.size === allBooks.length) {
      setSelectedBooks(new Set());
    } else {
      const allIds = new Set(allBooks.map(book => book._id.toString()));
      setSelectedBooks(allIds);
    }
  };

  const handleSaveBooks = async () => {
    setSaving(true);
    const bookIds = Array.from(selectedBooks);
    const result = await updateListBooks(id, bookIds);
    
    if (result.success) {
      // Actualizar la lista localmente
      const updatedBooks = allBooks.filter(book => selectedBooks.has(book._id.toString()));
      setList(prev => ({ 
        ...prev, 
        books: updatedBooks,
        totalBooks: updatedBooks.length 
      }));
      setIsEditingBooks(false);
    }
    setSaving(false);
  };

  const handleCancelBooks = () => {
    // Resetear a los libros originales
    const originalSelected = new Set(list.books.map(book => book._id.toString()));
    setSelectedBooks(originalSelected);
    setIsEditingBooks(false);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta lista?')) {
      const result = await deleteList(id);
      if (result.success) {
        navigate('/lists');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando lista...</p>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Library className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Lista no encontrada</h2>
          <button
            onClick={() => navigate('/lists')}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Volver a listas
          </button>
        </div>
      </div>
    );
  }

  const readingProgress = list.totalBooks > 0 
    ? (list.books.filter(b => b.status === 'read').length / list.totalBooks) * 100 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/lists')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              
              {!isEditing ? (
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{list.name}</h1>
                  {list.description && (
                    <p className="text-gray-500 text-sm mt-1">{list.description}</p>
                  )}
                </div>
              ) : (
                <div className="flex-1 max-w-md space-y-2">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nombre de la lista"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {!isEditing && !isEditingBooks ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Editar info</span>
                  </button>
                  <button
                    onClick={() => setIsEditingBooks(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Gestionar libros</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </>
              ) : isEditing ? (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ name: list.name, description: list.description || '' });
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    onClick={handleSaveListInfo}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Guardar</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancelBooks}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    onClick={handleSelectAll}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <Layers className="w-4 h-4" />
                    <span>{selectedBooks.size === allBooks.length ? 'Deseleccionar todos' : 'Seleccionar todos'}</span>
                  </button>
                  <button
                    onClick={handleSaveBooks}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                  >
                    {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Guardar cambios</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total libros</p>
                <p className="text-3xl font-bold text-gray-800">{list.totalBooks || 0}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completados</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {list.books?.filter(b => b.status === 'read').length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Leyendo</p>
                <p className="text-3xl font-bold text-teal-600">
                  {list.books?.filter(b => b.status === 'reading').length || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Progreso</p>
                <p className="text-3xl font-bold text-emerald-600">{readingProgress.toFixed(0)}%</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso de lectura</span>
            <span className="text-sm font-medium text-emerald-600">{readingProgress.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
              style={{ width: `${readingProgress}%` }}
            />
          </div>
        </div>

        {/* Description Edit Mode */}
        {isEditing && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              placeholder="Añade una descripción para esta lista..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Colecciones info */}
        {list.collectionIds && list.collectionIds.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Library className="w-4 h-4 text-emerald-600" />
              Esta lista está en las siguientes colecciones:
            </h3>
            <div className="flex flex-wrap gap-2">
              {list.collectionIds.map(collection => (
                <button
                  key={collection._id}
                  onClick={() => navigate(`/collections/${collection._id}`)}
                  className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-sm hover:bg-emerald-100 transition-colors"
                >
                  {collection.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Books Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              Libros en esta lista
              <span className="ml-2 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-600 rounded-full">
                {list.totalBooks || 0}
              </span>
            </h2>
            {isEditingBooks && (
              <p className="text-sm text-gray-500 mt-2">
                {selectedBooks.size} de {allBooks.length} libros seleccionados
              </p>
            )}
          </div>

          {allBooks.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No hay libros disponibles</p>
              <button
                onClick={() => navigate('/books')}
                className="mt-3 px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
              >
                Agregar libros primero
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {allBooks.map((book) => {
                const isSelected = selectedBooks.has(book._id.toString());
                
                return (
                  <div 
                    key={book._id}
                    className={`px-6 py-4 transition-colors ${isEditingBooks ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                    onClick={() => isEditingBooks && handleToggleBook(book._id.toString())}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {/* Selection indicator */}
                        {isEditingBooks && (
                          <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-emerald-500 border-emerald-500' 
                              : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="w-4 h-4 text-white" />}
                          </div>
                        )}
                        
                        {/* Book cover */}
                        {book.cover ? (
                          <img 
                            src={book.cover} 
                            alt={book.title}
                            className="w-12 h-16 object-cover rounded-md shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-16 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-md flex items-center justify-center">
                            <BookOpen className="w-6 h-6 text-emerald-600" />
                          </div>
                        )}
                        
                        {/* Book info */}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800">{book.title}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                            <User className="w-3 h-3" />
                            {book.author}
                          </p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              book.status === 'read' ? 'bg-emerald-100 text-emerald-700' :
                              book.status === 'reading' ? 'bg-teal-100 text-teal-700' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {book.status === 'read' ? 'Leído' :
                               book.status === 'reading' ? 'Leyendo' :
                               'Por leer'}
                            </span>
                            {book.rating > 0 && (
                              <span className="text-xs text-amber-600 flex items-center gap-1">
                                <Star className="w-3 h-3 fill-amber-500" />
                                {book.rating}
                              </span>
                            )}
                            <span className="text-xs text-gray-400">
                              {book.pagesRead || 0}/{book.total_pages} páginas
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Added date (only in view mode) */}
                      {!isEditingBooks && list.books.find(b => b._id === book._id) && (
                        <div className="text-xs text-gray-400">
                          Agregado: {new Date(list.books.find(b => b._id === book._id)?.addedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="mt-6 flex justify-between items-center text-xs text-gray-400">
          <p>Creada: {new Date(list.createdAt).toLocaleDateString()}</p>
          <p>Última actualización: {new Date(list.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ListPage;