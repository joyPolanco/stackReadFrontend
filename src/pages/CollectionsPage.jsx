import React, { useState } from "react";
import { PlusIcon, Archive, ArchiveRestore, Trash2, Grid3x3, List, BookOpen, CheckCircle, Clock } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import CollectionCard from "../components/CollectionCard";

const CollectionsPage = () => {
  const { collections, setCreateCollectionModalOpen } = useAppStore();

  const [view, setView] = useState("grid");
  const [tab, setTab] = useState("active");

  /* ================= FILTERS ================= */
  const activeCollections = collections?.filter((c) => !c.isArchived) || [];
  const archivedCollections = collections?.filter((c) => c.isArchived) || [];
  const data = tab === "active" ? activeCollections : archivedCollections;

  /* ================= GLOBAL STATS ================= */
  const totalBooks = activeCollections?.reduce(
    (acc, c) => acc + (c.lists?.reduce((sum, l) => sum + (l.books?.length || 0), 0) || 0),
    0
  ) || 0;

  const readBooks = activeCollections?.reduce(
    (acc, c) => acc + (c.lists?.reduce((sum, l) => sum + (l.books?.filter((b) => b.status === "read").length || 0), 0) || 0),
    0
  ) || 0;

  const remaining = totalBooks - readBooks;
  const globalProgress = totalBooks > 0 ? (readBooks / totalBooks) * 100 : 0;

  // Stats para archivadas
  const archivedTotalBooks = archivedCollections?.reduce(
    (acc, c) => acc + (c.lists?.reduce((sum, l) => sum + (l.books?.length || 0), 0) || 0),
    0
  ) || 0;

  return (
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-90px)] p-4 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
            Mis Colecciones
          </h2>
          <p className="text-sm text-gray-500 mt-1">Organiza y gestiona tus libros</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {/* TABS */}
          <div className="flex gap-1 bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setTab("active")}
              className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
                tab === "active" 
                  ? "bg-emerald-600 text-white shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <BookOpen className="inline w-4 h-4 mr-2" />
              Activas
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
                {activeCollections.length}
              </span>
            </button>

            <button
              onClick={() => setTab("archived")}
              className={`px-4 py-2 rounded-md transition-all text-sm font-medium ${
                tab === "archived" 
                  ? "bg-amber-600 text-white shadow-sm" 
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Archive className="inline w-4 h-4 mr-2" />
              Archivadas
              <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-white/20">
                {archivedCollections.length}
              </span>
            </button>
          </div>

          {/* VIEW TOGGLE */}
          <div className="flex gap-1 bg-white rounded-lg shadow-sm p-1">
            <button
              onClick={() => setView("grid")}
              className={`p-2 rounded-md transition-all ${
                view === "grid" ? "bg-gray-200 text-gray-800" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-2 rounded-md transition-all ${
                view === "list" ? "bg-gray-200 text-gray-800" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">

        {/* LEFT SECTION */}
        <div className="flex-[3] flex flex-col overflow-hidden">
          
          {/* Header with count */}
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              {tab === "archived" && <Archive className="w-5 h-5 text-amber-600" />}
              <span className="text-sm font-medium text-gray-500">
                {data.length} {tab === "active" ? "colecciones activas" : "colecciones archivadas"}
              </span>
            </div>
            {tab === "archived" && data.length > 0 && (
              <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                Vaciar archivo
              </button>
            )}
          </div>

          {/* COLLECTIONS GRID/LIST */}
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {data.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-96 text-center">
                {tab === "active" ? (
                  <>
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No tienes colecciones activas</h3>
                    <p className="text-sm text-gray-400 mb-4">Crea tu primera colección para empezar a organizar tus libros</p>
                    <button
                      onClick={() => setCreateCollectionModalOpen(true)}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      <PlusIcon className="inline w-4 h-4 mr-2" />
                      Crear colección
                    </button>
                  </>
                ) : (
                  <>
                    <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                      <Archive className="w-12 h-12 text-amber-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-600 mb-2">Archivo vacío</h3>
                    <p className="text-sm text-gray-400">No hay colecciones archivadas</p>
                  </>
                )}
              </div>
            ) : view === "grid" ? (
              <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {data.map((col) => (
                  <CollectionCard key={col._id} collection={col} view="grid" />
                ))}
                {tab === "active" && (
                  <div
                    className="group relative flex items-center justify-center min-h-[200px] border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/30 transition-all"
                    onClick={() => setCreateCollectionModalOpen(true)}
                  >
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors mb-2">
                        <PlusIcon className="w-6 h-6 text-gray-400 group-hover:text-emerald-600" />
                      </div>
                      <p className="text-sm text-gray-400 group-hover:text-emerald-600">Nueva colección</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {data.map((col) => (
                  <CollectionCard key={col._id} collection={col} view="list" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR - STATS */}
        <div className="lg:w-80 flex flex-col gap-4 shrink-0">
          
          {/* Main Stats Card */}
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
              Resumen de lectura
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total libros</span>
                <span className="text-xl font-bold text-gray-800">{totalBooks}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Leídos
                </span>
                <span className="text-xl font-bold text-emerald-600">{readBooks}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-600" />
                  Por leer
                </span>
                <span className="text-xl font-bold text-amber-600">{remaining}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progreso</span>
                <span>{globalProgress.toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500"
                  style={{ width: `${globalProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Archived Info Card */}
          {tab === "archived" && archivedCollections.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center shrink-0">
                  <Archive className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-800 text-sm">Colecciones archivadas</h4>
                  <p className="text-xs text-amber-700 mt-1">
                    Tienes {archivedCollections.length} colección(es) archivada(s) con un total de {archivedTotalBooks} libros.
                  </p>
                  <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                    <ArchiveRestore className="w-3 h-3" />
                    Puedes restaurarlas desde cada colección
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tip Card */}
          {tab === "active" && activeCollections.length > 0 && (
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-xs text-blue-700">
                💡 <span className="font-medium">Info:</span> Las colecciones archivadas no afectan tu progreso general
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default CollectionsPage;