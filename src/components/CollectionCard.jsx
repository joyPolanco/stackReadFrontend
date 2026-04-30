// components/CollectionCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, MoreVertical, Archive, ArchiveRestore, Trash2 } from 'lucide-react';
import { useActionsStore } from '../store/useActionsStore';
import { useAppStore } from '../store/useAppStore';
import CollectionCardMenu from './menus/CollectionCardMenu';

const CollectionCard = ({ collection, view = 'grid' }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);
  
  const { archiveCollection } = useActionsStore();
  const { setCollectionToDelete, setAnyModalOpen } = useAppStore();

  // Usar datos del endpoint directamente
  const totalBooks = collection.totalBooks || 0;
  const readBooks = collection.readBooks || 0;
  const progress = totalBooks > 0 ? (readBooks / totalBooks) * 100 : 0;
  const covers = collection.covers || [];

  const handleDeleteClick = () => {
    setCollectionToDelete(collection);
    setAnyModalOpen(true);
    setOpenMenu(false);
  };

  const handleArchive = async () => {
    await archiveCollection(collection._id);
    setOpenMenu(false);
  };

  const handleViewLists = () => {
    navigate(`/collections/${collection._id}/lists`);
  };

  const Menu = (
    <CollectionCardMenu
      onClose={() => setOpenMenu(false)}
      onEdit={() => {}} // Puedes agregar función de edición si la tienes
      onArchive={handleArchive}
      onDelete={handleDeleteClick}
      onViewLists={handleViewLists}
      isArchived={collection.isArchived}
      onViewCollection={()=>navigate(`collections/${collection._id}`)}
    />
  );

  if (view === 'list') {
    return (
      <div 
        className="relative bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
        onClick={()=>navigate(`${collection._id}`)}
      >
        {/* MENU BUTTON */}
        <div className="absolute top-3 right-3 z-10">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setOpenMenu((prev) => !prev);
            }}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical size={18} className="text-gray-500" />
          </button>
          {openMenu && Menu}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3">
              {/* Covers preview */}
              <div className="flex -space-x-2">
                {covers.slice(0, 3).map((cover, idx) => (
                  <div key={idx} className="w-10 h-14 rounded-md overflow-hidden shadow-sm border-2 border-white">
                    {cover ? (
                      <img src={cover} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400" />
                    )}
                  </div>
                ))}
                {covers.length === 0 && (
                  <div className="w-10 h-14 rounded-md bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{collection.name}</h3>
                {collection.description && (
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                    {collection.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    {totalBooks} libros
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    {readBooks} leídos
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" />
                    {totalBooks - readBooks} restantes
                  </span>
                  <span className="flex items-center gap-1">
                    <Archive className="w-3 h-3 text-gray-400" />
                    {collection.lists?.length || 0} listas
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-24">
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1 text-center">{progress.toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div 
      className="relative group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100"
      onClick={()=>navigate(`${collection._id}`)}
    >
      {/* MENU BUTTON */}
      <div className="absolute top-3 right-3 z-10">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu((prev) => !prev);
          }}
          className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm hover:bg-white transition-all"
        >
          <MoreVertical size={16} className="text-gray-600" />
        </button>
        {openMenu && Menu}
      </div>

      {/* Cover section */}
      <div className="relative h-32 bg-gradient-to-r from-purple-400 to-pink-400">
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          {covers.slice(0, 3).map((cover, idx) => (
            <div key={idx} className="w-12 h-16 rounded-md overflow-hidden shadow-md transform -rotate-6 hover:rotate-0 transition-transform">
              {cover ? (
                <img src={cover} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white/50" />
                </div>
              )}
            </div>
          ))}
          {covers.length === 0 && (
            <div className="w-16 h-20 rounded-md bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
          )}
        </div>
        
        {/* Archive badge */}
        {collection.isArchived && (
          <div className="absolute top-2 left-2 bg-amber-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <Archive className="w-3 h-3" />
            Archivada
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">
          {collection.name}
        </h3>
        
        {collection.description && (
          <p className="text-xs text-gray-500 mb-2 line-clamp-2">
            {collection.description}
          </p>
        )}
        
        {/* Stats */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progreso</span>
            <span className="font-medium text-gray-700">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <div className="flex justify-between text-xs pt-1">
            <div className="text-center">
              <p className="text-gray-500">Libros</p>
              <p className="font-semibold text-gray-800">{totalBooks}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Leídos</p>
              <p className="font-semibold text-emerald-600">{readBooks}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Restantes</p>
              <p className="font-semibold text-amber-600">
                {totalBooks - readBooks}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-500">Listas</p>
              <p className="font-semibold text-purple-600">
                {collection.lists?.length || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCard;