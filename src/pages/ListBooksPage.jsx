import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, BookOpen, TrendingUp, CheckCircle, Clock, Grid3x3, List, Eye, Star, Edit3 } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import toast from "react-hot-toast";

const ListBooksPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getListById } = useAppStore();
  
  const [list, setList] = useState(null);
  const [listBooks, setListBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalPages: 0,
    pagesRead: 0,
    completedBooks: 0,
    readingBooks: 0,
    toReadBooks: 0,
    abandonedBooks: 0,
    averageRating: 0,
    completionPercentage: 0
  });

  useEffect(() => {
    loadListData();
  }, [id]);

  const loadListData = async () => {
    setLoading(true);
    try {
      const listData = await getListById(id);
      setList(listData);
      
      if (listData.books && listData.books.length > 0) {
        const booksData = listData.books.map(item => item.book);
        setListBooks(booksData);
        calculateStats(booksData);
      } else {
        setListBooks([]);
        calculateStats([]);
      }
    } catch (error) {
      console.error("Error loading list:", error);
      toast.error("Error al cargar la lista");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (booksData) => {
    const totalBooks = booksData.length;
    const totalPages = booksData.reduce((sum, book) => sum + (book.total_pages || 0), 0);
    const pagesRead = booksData.reduce((sum, book) => sum + (book.pagesRead || 0), 0);
    const completedBooks = booksData.filter(book => book.status === "read").length;
    const readingBooks = booksData.filter(book => book.status === "reading").length;
    const toReadBooks = booksData.filter(book => book.status === "to-read").length;
    const abandonedBooks = booksData.filter(book => book.status === "abandoned").length;
    
    const booksWithRating = booksData.filter(book => book.rating > 0);
    const averageRating = booksWithRating.length > 0 
      ? (booksWithRating.reduce((sum, book) => sum + (book.rating || 0), 0) / booksWithRating.length).toFixed(1)
      : 0;
    
    const completionPercentage = totalPages > 0 ? Math.round((pagesRead / totalPages) * 100) : 0;

    setStats({
      totalBooks,
      totalPages,
      pagesRead,
      completedBooks,
      readingBooks,
      toReadBooks,
      abandonedBooks,
      averageRating,
      completionPercentage
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      "read": "bg-emerald-100 text-emerald-700",
      "reading": "bg-amber-100 text-amber-700",
      "to-read": "bg-blue-100 text-blue-700",
      "abandoned": "bg-red-100 text-red-700"
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  const getStatusText = (status) => {
    const texts = {
      "read": "✅ Leído",
      "reading": "📖 Leyendo",
      "to-read": "📚 Por leer",
      "abandoned": "⏸️ Abandonado"
    };
    return texts[status] || status;
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Cargando lista...</p>
        </div>
      </div>
    );
  }

  if (!list) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center">
          <p className="text-slate-500">Lista no encontrada</p>
          <button onClick={() => navigate("/lists")} className="mt-4 text-emerald-600 hover:text-emerald-700">
            Volver a listas
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        {/* HEADER - Compacto */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate("/lists")}
            className="group flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-all duration-200 mb-3"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Volver a listas</span>
          </button>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                  {list.name}
                </h1>
                <button
                  onClick={() => navigate(`/lists/${id}/edit`)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                  title="Editar lista"
                >
                  <Edit3 size={16} className="text-slate-400" />
                </button>
              </div>
              {list.description && (
                <p className="text-sm text-slate-500 mt-1 line-clamp-2">{list.description}</p>
              )}
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  📚 {stats.totalBooks} {stats.totalBooks === 1 ? 'libro' : 'libros'}
                </span>
                {list.collectionIds?.length > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    📁 {list.collectionIds.length} colección(es)
                  </span>
                )}
              </div>
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
                <Grid3x3 size={14} />
                <span className="hidden sm:inline">Grid</span>
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
                <List size={14} />
                <span className="hidden sm:inline">Lista</span>
              </button>
            </div>
          </div>
        </div>

        {/* STATS CARDS - Compactos */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Total</p>
                <p className="text-xl font-bold text-slate-800">{stats.totalBooks}</p>
              </div>
              <BookOpen size={24} className="text-emerald-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Páginas leídas</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{stats.pagesRead} / {stats.totalPages}</p>
                <p className="text-xs text-emerald-600">{stats.completionPercentage}%</p>
              </div>
              <TrendingUp size={24} className="text-emerald-500 opacity-50 flex-shrink-0" />
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2">
              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" style={{ width: `${stats.completionPercentage}%` }} />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Leyendo</p>
                <p className="text-xl font-bold text-slate-800">{stats.readingBooks}</p>
                <p className="text-xs text-slate-400">por leer: {stats.toReadBooks}</p>
              </div>
              <Clock size={24} className="text-emerald-500 opacity-50" />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Completados</p>
                <p className="text-xl font-bold text-slate-800">{stats.completedBooks}</p>
                {stats.averageRating > 0 && (
                  <div className="flex items-center gap-0.5 mt-0.5">
                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-slate-600">{stats.averageRating}</span>
                  </div>
                )}
              </div>
              <CheckCircle size={24} className="text-emerald-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* BOOKS SECTION - Con scroll interno */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-3 sm:p-4 border-b border-slate-100">
            <h3 className="text-sm font-semibold text-slate-700">
              Libros en esta lista
              <span className="ml-2 text-xs text-slate-400 font-normal">({stats.totalBooks})</span>
            </h3>
          </div>
          
          <div className="max-h-[calc(100vh-380px)] overflow-y-auto">
            {listBooks.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-sm text-slate-500">Esta lista aún no tiene libros</p>
                <button 
                  onClick={() => navigate(`/lists/${id}/edit`)}
                  className="mt-2 text-xs text-emerald-600 hover:text-emerald-700"
                >
                  Agregar libros
                </button>
              </div>
            ) : view === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-3 sm:p-4">
                {listBooks.map((book) => {
                  const progress = Math.round((book.pagesRead / book.total_pages) * 100);
                  return (
                    <div
                      key={book._id}
                      onClick={() => navigate(`/books/${book._id}`)}
                      className="group bg-slate-50 rounded-xl hover:shadow-md transition-all duration-200 overflow-hidden border border-slate-100 hover:border-emerald-200 cursor-pointer"
                    >
                      <div className="aspect-[3/4] relative">
                        {book.cover ? (
                          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                            <BookOpen size={28} className="text-slate-300" />
                          </div>
                        )}
                        <div className="absolute top-1 right-1">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${getStatusColor(book.status)}`}>
                            {getStatusText(book.status).replace(/[✅📖📚⏸️]/g, '').trim()}
                          </span>
                        </div>
                        {book.rating > 0 && (
                          <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm rounded px-1.5 py-0.5">
                            <div className="flex items-center gap-0.5">
                              <Star size={10} className="fill-yellow-400 text-yellow-400" />
                              <span className="text-[10px] text-white">{book.rating}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="p-2">
                        <h4 className="font-medium text-xs text-slate-800 line-clamp-1">{book.title}</h4>
                        <p className="text-[10px] text-slate-400 truncate">{book.author}</p>
                        <div className="mt-1.5">
                          <div className="flex justify-between text-[9px] text-slate-400 mb-0.5">
                            <span>Progreso</span>
                            <span>{progress}%</span>
                          </div>
                          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all" style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {listBooks.map((book) => {
                  const progress = Math.round((book.pagesRead / book.total_pages) * 100);
                  return (
                    <div
                      key={book._id}
                      onClick={() => navigate(`/books/${book._id}`)}
                      className="group flex items-center gap-3 p-3 hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      <div className="w-10 h-14 rounded overflow-hidden bg-slate-100 flex-shrink-0">
                        {book.cover ? (
                          <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <BookOpen size={16} className="text-slate-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-slate-800 truncate">{book.title}</h4>
                        <p className="text-xs text-slate-400 truncate">{book.author}</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(book.status)}`}>
                          {getStatusText(book.status)}
                        </span>
                      </div>
                      <div className="hidden md:block w-24">
                        <div className="flex items-center gap-1">
                          <div className="flex-1">
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 w-8">{progress}%</span>
                        </div>
                      </div>
                      <div className="hidden lg:flex items-center gap-1 w-16">
                        {book.rating > 0 ? (
                          <>
                            <Star size={12} className="fill-yellow-400 text-yellow-400" />
                            <span className="text-sm text-slate-600">{book.rating}</span>
                          </>
                        ) : (
                          <span className="text-xs text-slate-400">--</span>
                        )}
                      </div>
                      <Eye size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListBooksPage;