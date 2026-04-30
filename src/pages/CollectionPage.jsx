// pages/CollectionDetailPage.jsx
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
  Archive,
  RefreshCw,
  Loader,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useActionsStore } from '../store/useActionsStore';
import { useAppStore } from '../store/useAppStore';

const CollectionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCollectionById, updateCollection, archiveCollection, deleteCollection } = useActionsStore();
  const { setCollectionToDelete, setAnyModalOpen } = useAppStore();
  
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCollection();
  }, [id]);

  const loadCollection = async () => {
    setLoading(true);
    try {
      const result = await getCollectionById(id);
      setCollection(result.collection);
      setFormData({
        name: result.collection.name,
        description: result.collection.description || ''
      });
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar la colección');
      navigate('/collections');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setErrors({ name: 'El nombre es requerido' });
      return;
    }

    setSaving(true);
    const result = await updateCollection(id, formData);
    
    if (result.success) {
      setCollection(prev => ({ ...prev, ...result.collection }));
      setIsEditing(false);
    } else if (result.errors) {
      setErrors(result.errors);
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setFormData({
      name: collection.name,
      description: collection.description || ''
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleArchive = async () => {
    const result = await archiveCollection(id);
    if (result.success) {
      setCollection(prev => ({ ...prev, isArchived: !prev.isArchived }));
      toast.success(collection.isArchived ? 'Colección restaurada' : 'Colección archivada');
    }
  };

  const handleDelete = () => {
    setCollectionToDelete(collection);
    setAnyModalOpen(true);
  };

  const progress = collection?.totalBooks > 0 
    ? (collection.readBooks / collection.totalBooks) * 100 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando colección...</p>
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Library className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">Colección no encontrada</h2>
          <button
            onClick={() => navigate('/collections')}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Volver a colecciones
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/collections')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              
              {!isEditing ? (
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{collection.name}</h1>
                  {collection.description && (
                    <p className="text-gray-500 text-sm mt-1">{collection.description}</p>
                  )}
                </div>
              ) : (
                <div className="flex-1 max-w-md">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Nombre de la colección"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-emerald-800 text-white rounded-lg hover:bg-emerald-700 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Editar</span>
                  </button>
                  <button
                    onClick={handleArchive}
                    className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all"
                  >
                    {collection.isArchived ? (
                      <RefreshCw className="w-4 h-4" />
                    ) : (
                      <Archive className="w-4 h-4" />
                    )}
                    <span>{collection.isArchived ? 'Restaurar' : 'Archivar'}</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Eliminar</span>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>Guardar</span>
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
                <p className="text-3xl font-bold text-gray-800">{collection.totalBooks || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Libros leídos</p>
                <p className="text-3xl font-bold text-emerald-600">{collection.readBooks || 0}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Por leer</p>
                <p className="text-3xl font-bold text-amber-600">
                  {(collection.totalBooks || 0) - (collection.readBooks || 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Progreso</p>
                <p className="text-3xl font-bold text-purple-600">{progress.toFixed(0)}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progreso general</span>
            <span className="text-sm font-medium text-purple-600">{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>{collection.readBooks || 0} leídos</span>
            <span>{(collection.totalBooks || 0) - (collection.readBooks || 0)} restantes</span>
            <span>{collection.totalBooks || 0} total</span>
          </div>
        </div>

        {/* Description Section (Edit mode) */}
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
              placeholder="Añade una descripción para esta colección..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Lists Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Library className="w-5 h-5 text-purple-600" />
              Listas en esta colección
              <span className="ml-2 px-2 py-0.5 text-xs bg-purple-100 text-purple-600 rounded-full">
                {collection.listsInfo?.length || 0}
              </span>
            </h2>
          </div>

          {collection.listsInfo && collection.listsInfo.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {collection.listsInfo.map((list) => (
                <div 
                  key={list._id}
                  onClick={() => navigate(`/lists/${list._id}`)}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{list.name}</h3>
                      {list.description && (
                        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{list.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          {list.bookCount || 0} libros
                        </span>
                        {list.createdAt && (
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(list.createdAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      {list.cover ? (
                        <img 
                          src={list.cover} 
                          alt={list.name}
                          className="w-12 h-16 object-cover rounded-md shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-16 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-md flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-emerald-700" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Library className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Esta colección aún no tiene listas</p>
              <button
                onClick={() => navigate(`/collections/${id}/lists`)}
                className="mt-3 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Agregar listas
              </button>
            </div>
          )}
        </div>

        {/* Action Buttons Footer */}
        <div className="mt-8 flex justify-between items-center">
          <button
            onClick={() => navigate(`/collections/${id}/lists`)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-all"
          >
            Gestionar listas
          </button>
          
          <p className="text-xs text-gray-400">
            Última actualización: {new Date(collection.updatedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;