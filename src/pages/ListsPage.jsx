import React, { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { PlusIcon, FolderPlus, BookOpen, Edit, Trash2, Grid3x3, List, FolderMinus, ChevronRight, AlertTriangle, X } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useActionsStore } from "../store/useActionsStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

const ListsPage = () => {
  const { 
    lists, 
    getLists, 
    setAnyModalOpen, 
    setIsCreateListModalOpen,
    collections,
    getCollections
  } = useAppStore();

  const { addListToCollection, removeListFromCollection, deleteList } = useActionsStore();

  const [view, setView] = useState("grid");
  const [addingToList, setAddingToList] = useState(null);
  const [removingFromList, setRemovingFromList] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const [deleteConfirmList, setDeleteConfirmList] = useState(null);
  
  const menuRef = useRef(null);
  const buttonRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickInsideMenu = menuRef.current && menuRef.current.contains(e.target);
      const isClickOnButton = buttonRefs.current[openMenuId] && buttonRefs.current[openMenuId].contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnButton && openMenuId) {
        closeMenu();
      }
    };

    const handleEscKey = (e) => {
      if (e.key === 'Escape' && openMenuId) {
        closeMenu();
      }
    };

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [openMenuId]);

  const closeMenu = () => {
    setOpenMenuId(null);
    setExpandedSection(null);
  };

  const loadData = async () => {
    try {
      await Promise.all([
        getLists?.(), 
        getCollections?.()
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleAddToCollection = async (collectionId, list) => {
    setAddingToList(list._id);
    try {
      await addListToCollection(collectionId, list._id);
      toast.success(`"${list.name}" agregada a la colección`);
      await loadData();
      closeMenu();
    } catch {
      toast.error("Error al agregar a colección");
    } finally {
      setAddingToList(null);
    }
  };

  const handleRemoveFromCollection = async (collectionId, list) => {
    setRemovingFromList(list._id);
    try {
      await removeListFromCollection(collectionId, list._id);
      toast.success(`"${list.name}" removida de la colección`);
      await loadData();
      closeMenu();
    } catch {
      toast.error("Error al quitar de colección");
    } finally {
      setRemovingFromList(null);
    }
  };

  const handleDeleteList = async () => {
    if (!deleteConfirmList) return;
    
    const result = await deleteList(deleteConfirmList._id);
    if (result.success) {
      setDeleteConfirmList(null);
      closeMenu();
    }
  };

  const isListInCollection = (list, id) =>
    list.collectionIds?.includes(id) || false;

  const getAvailableCollections = (list) =>
    collections?.filter(c => !isListInCollection(list, c._id)) || [];

  const getMemberCollections = (list) =>
    collections?.filter(c => list.collectionIds?.includes(c._id)) || [];

  const hasCollections = collections?.length > 0;

  const MenuContent = ({ list }) => {
    const available = getAvailableCollections(list);
    const members = getMemberCollections(list);
    const isAddExpanded = expandedSection === 'add';
    const isRemoveExpanded = expandedSection === 'remove';

    const toggleAdd = (e) => {
      e.stopPropagation();
      setExpandedSection(isAddExpanded ? null : 'add');
    };

    const toggleRemove = (e) => {
      e.stopPropagation();
      setExpandedSection(isRemoveExpanded ? null : 'remove');
    };

    const addScroll = available.length > 3;
    const removeScroll = members.length > 3;

    return (
      <div 
        ref={menuRef}
        className="bg-white rounded-xl shadow-2xl border border-slate-200 min-w-[220px] max-w-[280px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="py-1 max-h-[400px] overflow-y-auto">
          <button 
            onClick={() => { 
              navigate(`${list._id}`);
              closeMenu();
            }}
            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm flex items-center gap-3 text-slate-700 transition-colors"
          >
            <BookOpen size={16} />
            Ver lista
          </button>

          <button 
            onClick={() => {               
            navigate(`${list._id}/edit`);
closeMenu(); }}
            className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm flex items-center gap-3 text-slate-700 transition-colors"
          >
            <Edit size={16} />
            Editar lista
          </button>

          {hasCollections && available.length > 0 && (
            <div className="border-t border-slate-100">
              <button 
                onClick={toggleAdd}
                className="w-full text-left px-4 py-2.5 hover:bg-emerald-50 text-sm flex items-center justify-between text-emerald-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FolderPlus size={16} />
                  Agregar a colección ({available.length})
                </div>
                <ChevronRight size={14} className={`transition-transform duration-200 ${isAddExpanded ? 'rotate-90' : ''}`} />
              </button>

              {isAddExpanded && (
                <div className={`bg-emerald-50/30 border-l-2 border-emerald-200 ml-3 ${addScroll ? 'max-h-32 overflow-y-auto' : ''}`}>
                  {available.map((col) => (
                    <button
                      key={col._id}
                      onClick={() => handleAddToCollection(col._id, list)}
                      disabled={addingToList === list._id}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-100 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                        <span className="text-slate-700">{col.name}</span>
                      </div>
                      {addingToList === list._id ? (
                        <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <PlusIcon size={12} className="text-emerald-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {members.length > 0 && (
            <div className="border-t border-slate-100">
              <button 
                onClick={toggleRemove}
                className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm flex items-center justify-between text-red-600 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FolderMinus size={16} />
                  Quitar de colección ({members.length})
                </div>
                <ChevronRight size={14} className={`transition-transform duration-200 ${isRemoveExpanded ? 'rotate-90' : ''}`} />
              </button>

              {isRemoveExpanded && (
                <div className={`bg-red-50/30 border-l-2 border-red-200 ml-3 ${removeScroll ? 'max-h-32 overflow-y-auto' : ''}`}>
                  {members.map((col) => (
                    <button
                      key={col._id}
                      onClick={() => handleRemoveFromCollection(col._id, list)}
                      disabled={removingFromList === list._id}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-red-100 flex items-center justify-between transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                        <span className="text-slate-700">{col.name}</span>
                      </div>
                      {removingFromList === list._id ? (
                        <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Trash2 size={12} className="text-red-500" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="border-t border-slate-100 my-1"></div>

          <button 
            onClick={() => {
              setDeleteConfirmList(list);
              closeMenu();
            }}
            className="w-full text-left px-4 py-2.5 hover:bg-red-50 text-sm flex items-center gap-3 text-red-600 transition-colors"
          >
            <Trash2 size={16} />
            Eliminar lista
          </button>
        </div>
      </div>
    );
  };

  const handleMenuClick = (e, listId) => {
    const rect = e.currentTarget.getBoundingClientRect();
    
    setMenuPosition({
      top: rect.bottom + window.scrollY,
      left: rect.right - 260 + window.scrollX
    });
    
    setOpenMenuId(openMenuId === listId ? null : listId);
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 md:p-6 bg-gradient-to-br from-slate-50 to-white min-h-screen">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Mis Listas
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Organiza tus libros en listas personalizadas
          </p>
        </div>

        <div className="flex gap-2 bg-white rounded-lg shadow-sm border border-slate-200 p-1">
          <button
            onClick={() => setView("grid")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-all duration-200
              ${view === "grid" 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-50"
              }
            `}
          >
            <Grid3x3 size={16} />
            Grid
          </button>
          <button
            onClick={() => setView("list")}
            className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-all duration-200
              ${view === "list" 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "text-slate-600 hover:bg-slate-50"
              }
            `}
          >
            <List size={16} />
            Lista
          </button>
        </div>
      </div>

      {/* LISTS - Grid View */}
      {view === "grid" && (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {lists?.map((list) => {
            const memberCollections = getMemberCollections(list);
            
            return (
              <div
                key={list._id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-emerald-200"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="text-base font-bold text-slate-800 line-clamp-1">
                        {list.name}
                      </h4>
                      <p className="text-xs text-emerald-600 font-medium mt-1">
                        {list.totalBooks || 0} {list.totalBooks === 1 ? 'libro' : 'libros'}
                      </p>
                      {memberCollections.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {memberCollections.map(col => (
                            <span key={col._id} className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                              {col.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <button
                        ref={el => { if (el) buttonRefs.current[list._id] = el; }}
                        onClick={(e) => handleMenuClick(e, list._id)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {(list.covers?.length ? list.covers : [null, null, null])
                      .slice(0, 3)
                      .map((img, i) => (
                        <div key={i} className="flex-1">
                          {img ? (
                            <img src={img} alt="Book cover" className="h-28 w-full object-cover rounded-lg shadow-sm" />
                          ) : (
                            <div className="h-28 w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center">
                              <BookOpen size={24} className="text-slate-300" />
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* CREAR LISTA */}
          <div
            onClick={() => {
              setAnyModalOpen(true);
              setIsCreateListModalOpen(true);
            }}
            className="group flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl cursor-pointer min-h-[280px] hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-300"
          >
            <div className="w-14 h-14 rounded-full bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-all duration-300 group-hover:scale-110">
              <PlusIcon size={28} className="text-slate-400 group-hover:text-emerald-600" />
            </div>
            <p className="text-sm font-medium text-slate-500 group-hover:text-emerald-600 mt-3 transition-colors">
              Crear nueva lista
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Organiza tus lecturas
            </p>
          </div>
        </div>
      )}

      {/* LISTS - List View */}
      {view === "list" && (
        <div className="space-y-3">
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-3 bg-white rounded-xl shadow-sm border border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <div className="col-span-5">Nombre</div>
            <div className="col-span-2">Libros</div>
            <div className="col-span-4">Colecciones</div>
            <div className="col-span-1">Acciones</div>
          </div>

          {lists?.map((list) => {
            const memberCollections = getMemberCollections(list);
            
            return (
              <div
                key={list._id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-all p-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-5">
                    <h4 className="font-semibold text-slate-800">{list.name}</h4>
                  </div>
                  <div className="md:col-span-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                      {list.totalBooks || 0} libros
                    </span>
                  </div>
                  <div className="md:col-span-4">
                    <div className="flex flex-wrap gap-1">
                      {memberCollections.length > 0 ? (
                        memberCollections.map((col) => (
                          <span key={col._id} className="text-xs bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">
                            {col.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">Sin colecciones</span>
                      )}
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <button
                      ref={el => { if (el) buttonRefs.current[list._id] = el; }}
                      onClick={(e) => handleMenuClick(e, list._id)}
                      className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div
            onClick={() => {
              setAnyModalOpen(true);
              setIsCreateListModalOpen(true);
            }}
            className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-4 cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all flex items-center justify-center gap-3"
          >
            <PlusIcon size={20} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-500">Crear nueva lista</span>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN PARA ELIMINAR */}
      {deleteConfirmList && createPortal(
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]" onClick={() => setDeleteConfirmList(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={32} className="text-red-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-center text-slate-800 mb-2">
                ¿Eliminar lista?
              </h3>
              <p className="text-slate-500 text-center mb-6">
                ¿Estás seguro de que quieres eliminar la lista "{deleteConfirmList.name}"?<br />
                <span className="text-sm text-red-500">Esta acción no se puede deshacer.</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmList(null)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteList}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* PORTAL - Menú flotante */}
      {openMenuId && createPortal(
        <div
          style={{
            position: "absolute",
            top: menuPosition.top,
            left: menuPosition.left,
            zIndex: 9999
          }}
        >
          <MenuContent list={lists?.find(l => l._id === openMenuId)} />
        </div>,
        document.body
      )}
    </div>
  );
};

export default ListsPage;