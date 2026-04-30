// HomePage.jsx
import React, { useEffect, useState } from "react";
import {
  BookOpen, TrendingUp, List, FolderOpen, Star, Clock,
  Award, Calendar, Users, PieChart, ChevronRight,
  Sparkles, Target, BarChart4, Library, BookMarked, BookCheck,
  Eye, User, BookCopy, Layers, FolderKanban, Trophy
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

const HomePage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadStats = async () => {
    try {
      const res = await axiosInstance.get("/stats/dashboard");
      setStats(res.data);
    } catch (error) {
      console.error("Error loading stats:", error);
      toast.error("Error al cargar estadísticas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="h flex items-center justify-center bg-gradient-to-br from-slate-50 to-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const { stats: data, charts, insights, goals } = stats;
  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  const statusColors = {
    "reading": "bg-amber-500",
    "read": "bg-emerald-500",
    "to-read": "bg-blue-500",
    "abandoned": "bg-red-500"
  };

  const statusIcons = {
    "reading": <BookOpen size={12} />,
    "read": <BookCheck size={12} />,
    "to-read": <BookMarked size={12} />,
    "abandoned": <BookCopy size={12} />
  };

  const statusLabels = {
    "reading": "Leyendo",
    "read": "Leído",
    "to-read": "Por leer",
    "abandoned": "Abandonado"
  };

  return (
    <div className="h-[calc(100vh-0px)]  p-2 overflow-y-auto bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart4 size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
                Panel de Estadísticas
              </h1>
              <p className="text-sm text-slate-500">
                Visualiza tu progreso y actividad como lector
              </p>
            </div>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-slate-100 hover:border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Library size={20} className="text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{data.books.total}</span>
            </div>
            <p className="text-sm font-medium text-slate-700">Total de libros</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-xs">
                <BookOpen size={12} /> {data.books.reading} leyendo
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs">
                <BookMarked size={12} /> {data.books.toRead} por leer
              </span>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-slate-100 hover:border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <TrendingUp size={20} className="text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{data.books.overallProgress}%</span>
            </div>
            <p className="text-sm font-medium text-slate-700">Progreso general</p>
            <div className="mt-3">
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500" style={{ width: `${data.books.overallProgress}%` }} />
              </div>
              <p className="text-xs text-slate-400 mt-2">{data.books.pagesRead.toLocaleString()} / {data.books.totalPages.toLocaleString()} páginas</p>
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-slate-100 hover:border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Star size={20} className="text-amber-500" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{data.books.averageRating || 0}</span>
            </div>
            <p className="text-sm font-medium text-slate-700">Rating promedio</p>
            <div className="flex items-center gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={14} className={star <= (data.books.averageRating || 0) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
              ))}
            </div>
          </div>

          <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 border border-slate-100 hover:border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy size={20} className="text-emerald-600" />
              </div>
              <span className="text-2xl font-bold text-slate-800">{goals.completedBooks}</span>
            </div>
            <p className="text-sm font-medium text-slate-700">Libros completados</p>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Meta anual (24 libros)</span>
                <span className="font-medium text-emerald-600">{goals.readingGoal}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${goals.readingGoal}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* GRÁFICOS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Distribución por estado */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <PieChart size={16} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Distribución por estado</h3>
            </div>
            <div className="space-y-3">
              {charts.statusDistribution.map((item) => {
                const percentage = ((item.count / data.books.total) * 100).toFixed(1);
                return (
                  <div key={item.status}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="flex items-center gap-1 text-slate-600">
                        {statusIcons[item.status]}
                        {statusLabels[item.status]}
                      </span>
                      <span className="text-slate-700 font-medium">{item.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${statusColors[item.status]} rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Libros por mes */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Calendar size={16} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Libros agregados por mes</h3>
            </div>
            <div className="h-52 flex items-end gap-2">
              {charts.booksByMonth.map((item, index) => {
                const maxCount = Math.max(...charts.booksByMonth.map(m => m.count), 1);
                const height = (item.count / maxCount) * 100;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="text-xs font-medium text-slate-600">{item.count}</div>
                    <div className="w-full bg-emerald-100 rounded-lg transition-all duration-500 relative" style={{ height: `${height}%`, minHeight: 30 }}>
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-lg" style={{ height: `${height}%` }} />
                    </div>
                    <div className="text-xs text-slate-400 font-medium">{monthNames[item._id.month - 1]}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* INSIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Top autores */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Users size={16} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Autores favoritos</h3>
            </div>
            <div className="space-y-3">
              {insights.topAuthors.map((author, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-emerald-600">#{idx + 1}</span>
                    </div>
                    <span className="text-sm text-slate-700 font-medium">{author._id}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BookOpen size={14} className="text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-600">{author.count}</span>
                  </div>
                </div>
              ))}
              {insights.topAuthors.length === 0 && (
                <div className="text-center py-8">
                  <User size={40} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-400 text-sm">Aún no hay autores registrados</p>
                </div>
              )}
            </div>
          </div>

          {/* Mejores calificados */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star size={16} className="text-amber-500" />
              </div>
              <h3 className="font-semibold text-slate-800">Mejor calificados</h3>
            </div>
            <div className="space-y-3">
              {insights.topRatedBooks.map((book) => (
                <div 
                  key={book._id} 
                  onClick={() => navigate(`/books/${book._id}`)}
                  className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen size={16} className="text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate">{book.title}</p>
                      <p className="text-xs text-slate-500 truncate">{book.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold text-slate-700">{book.rating}</span>
                    <Eye size={14} className="text-slate-300 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
              {insights.topRatedBooks.length === 0 && (
                <div className="text-center py-8">
                  <Star size={40} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-slate-400 text-sm">Aún no hay libros calificados</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actividad reciente */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Clock size={16} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Actividad reciente</h3>
            </div>
          </div>
          <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {insights.recentActivity.map((book) => {
              const activityIcons = {
                "reading": <BookOpen size={14} className="text-amber-500" />,
                "read": <BookCheck size={14} className="text-emerald-500" />,
                "to-read": <BookMarked size={14} className="text-blue-500" />,
                "abandoned": <BookCopy size={14} className="text-red-500" />
              };
              const activityLabels = {
                "reading": "actualizó",
                "read": "completó",
                "to-read": "agregó",
                "abandoned": "abandonó"
              };
              const date = new Date(book.updatedAt);
              const formattedDate = `${date.toLocaleDateString()}`;
              
              return (
                <div 
                  key={book._id}
                  onClick={() => navigate(`/books/${book._id}`)}
                  className="px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {activityIcons[book.status]}
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">{book.title}</span>
                      <span className="text-slate-400"> - {activityLabels[book.status] || "actualizó"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">{formattedDate}</span>
                    <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              );
            })}
            {insights.recentActivity.length === 0 && (
              <div className="px-5 py-8 text-center">
                <Clock size={40} className="mx-auto text-slate-300 mb-2" />
                <p className="text-slate-400 text-sm">No hay actividad reciente</p>
              </div>
            )}
          </div>
        </div>

        {/* Resumen de listas y colecciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <List size={16} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Listas</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-slate-800">{data.lists.total}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600">{data.lists.withBooks}</p>
                <p className="text-xs text-emerald-600">Con libros</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-slate-400">{data.lists.empty}</p>
                <p className="text-xs text-slate-500">Vacías</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <FolderKanban size={16} className="text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-800">Colecciones</h3>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-2xl font-bold text-slate-800">{data.collections.total}</p>
                <p className="text-xs text-slate-500">Total</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <p className="text-2xl font-bold text-emerald-600">{data.collections.withLists}</p>
                <p className="text-xs text-emerald-600">Con listas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Espacio extra al final */}
        <div className="h-6" />
      </div>
    </div>
  );
};

export default HomePage;