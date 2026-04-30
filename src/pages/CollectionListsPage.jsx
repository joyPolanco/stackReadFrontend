// pages/CollectionListsPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { 
  ArrowLeft, 
  Save, 
  Edit2, 
  Eye, 
  Check, 
  X, 
  List,
  BookOpen,
  User,
  Calendar,
  Loader,
  Bookmark,
  Library,
  TrendingUp
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../store/useAppStore';
import { useActionsStore } from '../store/useActionsStore';

const CollectionListsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedLists, setSelectedLists] = useState([]);
  const [availableLists, setAvailableLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [collectionInfo, setCollectionInfo] = useState(null);
  
  const { collections } = useAppStore();
  const { getCollectionLists, updateCollectionLists } = useActionsStore();
  
  useEffect(() => {
    loadData();
  }, [id]);
  
  const loadData = async () => {
    setLoading(true);
    try {
      const allLists = useAppStore.getState().lists;
      const collectionData = await getCollectionLists(id);
      
      setCollectionInfo(collectionData.collection);
      setAvailableLists(allLists);
      setSelectedLists(collectionData.lists.map(list => list._id));
    } catch (error) {
      toast.error('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };
  
  const handleToggleList = (listId) => {
    if (selectedLists.includes(listId)) {
      setSelectedLists(selectedLists.filter(id => id !== listId));
    } else {
      setSelectedLists([...selectedLists, listId]);
    }
  };
  
  const handleSave = async () => {
    setSaving(true);
    const result = await updateCollectionLists(id, selectedLists);
    if (result.success) {
      setIsEditMode(false);
      toast.success('Listas actualizadas correctamente');
    }
    setSaving(false);
  };
  
  const handleCancel = () => {
    const originalLists = collections.find(c => c._id === id)?.lists || [];
    setSelectedLists(originalLists.map(list => list._id));
    setIsEditMode(false);
  };
  
  // Calcular estadísticas
  const selectedListsData = availableLists.filter(list => selectedLists.includes(list._id));
  const totalBooks = selectedListsData.reduce((total, list) => total + (list.books?.length || 0), 0);
  const totalReadBooks = selectedListsData.reduce((total, list) => 
    total + (list.books?.filter(b => b.status === 'read').length || 0), 0
  );
  const readingProgress = totalBooks > 0 ? (totalReadBooks / totalBooks) * 100 : 0;
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-500">Cargando listas...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/collections')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  {collectionInfo?.name}
                </h1>
                {collectionInfo?.description && (
                  <p className="text-sm text-gray-500 mt-1">{collectionInfo.description}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {!isEditMode ? (
                <button
                  onClick={() => setIsEditMode(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span>Eliminar listas</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancelar</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    <span>{saving ? 'Guardando...' : 'Guardar cambios'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {!isEditMode && selectedLists.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Listas incluidas</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{selectedLists.length}</p>
                </div>
                <Library className="w-8 h-8 text-emerald-600 opacity-60" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total libros</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{totalBooks}</p>
                </div>
                <BookOpen className="w-8 h-8 text-emerald-600 opacity-60" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Libros leídos</p>
                  <p className="text-2xl font-semibold text-emerald-600 mt-1">{totalReadBooks}</p>
                </div>
                <Check className="w-8 h-8 text-emerald-600 opacity-60" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Progreso</p>
                  <p className="text-2xl font-semibold text-gray-900 mt-1">{readingProgress.toFixed(0)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-600 opacity-60" />
              </div>
            </div>
          </div>
        )}
        
        {/* Lists Grid */}
        {availableLists.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <List className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay listas disponibles</h3>
            <p className="text-gray-500 mb-4">Comienza creando una nueva lista</p>
            <button
              onClick={() => navigate('/lists/create')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Crear lista
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                {availableLists.length} listas disponibles • {selectedLists.length} seleccionadas
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableLists.map((list) => {
                const isSelected = selectedLists.includes(list._id);
                const bookCount = list.books?.length || 0;
                const readCount = list.books?.filter(b => b.status === 'read').length || 0;
                
                return (
                  <div
                    key={list._id}
                    className={`group bg-white rounded-lg border transition-all duration-200 overflow-hidden ${
                      isEditMode 
                        ? 'cursor-pointer hover:border-emerald-300 hover:shadow-md' 
                        : 'border-gray-200 hover:shadow-md'
                    } ${isSelected && isEditMode ? 'border-emerald-500 bg-emerald-50/20' : 'border-gray-200'}`}
                    onClick={() => isEditMode && handleToggleList(list._id)}
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Bookmark className="w-4 h-4 text-emerald-600" />
                            <h3 className="font-semibold text-gray-900 line-clamp-1">
                              {list.name}
                            </h3>
                          </div>
                          {list.description && (
                            <p className="text-sm text-gray-500 line-clamp-2">
                              {list.description}
                            </p>
                          )}
                        </div>
                        
                        {/* Selection indicator */}
                        {isEditMode && (
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected 
                              ? 'bg-emerald-600 border-emerald-600' 
                              : 'border-gray-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                        )}
                      </div>
                      
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{bookCount} libros</span>
                        </div>
                        {bookCount > 0 && (
                          <div className="flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span>{readCount} leídos</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="truncate">{list.user?.name || list.user?.email?.split('@')[0]}</span>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      {bookCount > 0 && !isEditMode && isSelected && (
                        <div className="mt-3">
                          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-600 rounded-full transition-all"
                              style={{ width: `${(readCount / bookCount) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* View button (only in view mode) */}
                      {!isEditMode && isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/lists/${list._id}`);
                          }}
                          className="mt-4 w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-emerald-200 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Ver lista</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        
        {/* Empty state when no lists selected */}
        {!isEditMode && selectedLists.length === 0 && availableLists.length > 0 && (
          <div className="mt-8 bg-white rounded-lg border border-gray-200 p-8 text-center">
            <Library className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Esta colección no contiene listas</p>
            <button
              onClick={() => setIsEditMode(true)}
              className="mt-3 text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Agregar listas →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionListsPage;