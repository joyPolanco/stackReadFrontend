// pages/EntriesPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { PlusIcon, BookOpen, Flame, Calendar as CalendarIcon, ChevronLeft, ChevronRight, Trash2, Edit2, Heart } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useActionsStore } from "../store/useActionsStore";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from "react-hot-toast";
import EntryCard from "../components/EntryCard";

const EntriesPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [streak, setStreak] = useState(0);
  
  const { setAddEntryModalOpen } = useAppStore();
  const { getEntriesPaginated, getStreakStats, deleteEntry } = useActionsStore();

  // Función para recargar todas las entradas (resetear paginación)
  const refreshEntries = useCallback(async () => {
    setPage(1);
    setLoading(true);
    try {
      const result = await getEntriesPaginated(1, 10);
      setEntries(result.entries);
      setHasMore(result.hasMore);
      setTotalEntries(result.total);
      setPage(result.page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar primeras entradas
  const loadEntries = useCallback(async (pageNum = 1, append = false) => {
    if (pageNum === 1) setLoading(true);
    else setLoadingMore(true);
    
    try {
      const result = await getEntriesPaginated(pageNum, 10);
      
      if (append) {
        setEntries(prev => [...prev, ...result.entries]);
      } else {
        setEntries(result.entries);
      }
      
      setHasMore(result.hasMore);
      setTotalEntries(result.total);
      setPage(result.page);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  // Cargar estadísticas de racha
  const loadStreak = useCallback(async () => {
    const stats = await getStreakStats();
    setStreak(stats.streak);
  }, []);

  useEffect(() => {
    loadEntries(1, false);
    loadStreak();
  }, []);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadEntries(page + 1, true);
    }
  };

  const handleDeleteEntry = async (id) => {
    if (window.confirm('¿Eliminar esta entrada?')) {
      const result = await deleteEntry(id);
      if (result.success) {
        // Recargar la lista después de eliminar
        refreshEntries();
        loadStreak();
        toast.success('Entrada eliminada');
      }
    }
  };

  // Filtrar entradas por fecha seleccionada
  const filteredEntries = useMemo(() => {
    if (!selectedDate) return entries;
    return entries.filter(entry => 
      isSameDay(new Date(entry.date), selectedDate)
    );
  }, [entries, selectedDate]);

  // Obtener días del mes con entradas
  const daysWithEntries = useMemo(() => {
    const dates = new Set();
    entries.forEach(entry => {
      const dateKey = format(new Date(entry.date), 'yyyy-MM-dd');
      dates.add(dateKey);
    });
    return dates;
  }, [entries]);

  // Generar días del mes actual
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  }, [currentMonth]);

  const previousMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date());
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4 md:p-6 overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Mis Lecturas</h2>
          <p className="text-sm text-slate-500 mt-1">Registra y gestiona tu progreso de lectura</p>
        </div>
        
        <button 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition shadow-sm"
          onClick={() => setAddEntryModalOpen(true)}
        >
          <PlusIcon size={18} />
          Nueva entrada
        </button>
      </div>

      <div className="flex flex-1 min-h-0 gap-6 flex-col xl:flex-row">
        
        {/* MAIN CONTENT - ENTRADAS */}
        <div className="flex-[2] flex flex-col min-h-0 gap-4">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total lecturas</p>
                  <p className="text-2xl font-bold text-slate-800">{totalEntries}</p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Racha actual</p>
                  <p className="text-2xl font-bold text-orange-500 flex items-center gap-1">
                    <Flame className="w-5 h-5 fill-orange-500 text-orange-500" />
                    {streak}
                  </p>
                </div>
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-500" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Entradas</p>
                  <p className="text-2xl font-bold text-slate-800">{entries.length}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Selected Date Indicator */}
          {selectedDate && (
            <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-slate-700">
                  Mostrando: {format(selectedDate, "d 'de' MMMM 'de' yyyy", { locale: es })}
                </span>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs text-slate-400 hover:text-slate-600"
              >
                Mostrar todas
              </button>
            </div>
          )}
          
          {/* ENTRADAS LIST */}
          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-3 pr-1">
            
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <BookOpen size={48} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">No hay entradas para mostrar</p>
                <button
                  onClick={() => setAddEntryModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                >
                  Crear primera entrada
                </button>
              </div>
            ) : (
              <>
                {filteredEntries.map((entry) => (
                  <EntryCard 
                    key={entry._id} 
                    entry={entry} 
                    onDelete={handleDeleteEntry}
                  />
                ))}
                
                {/* Load More Button */}
                {hasMore && !selectedDate && (
                  <div className="flex justify-center py-4">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                      ) : (
                        'Cargar más entradas'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* SIDEBAR - STREAK & CALENDAR */}
        <div className="xl:w-80 flex flex-col gap-4">
          
          {/* Streak Card */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-5 shadow-sm border border-orange-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-200 rounded-xl flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-orange-700 font-medium">Racha de lectura</p>
                <p className="text-2xl font-bold text-orange-600">{streak} días</p>
              </div>
            </div>
            <div className="pt-3 border-t border-orange-200">
              <p className="text-xs text-orange-600">
                {streak === 0 ? '¡Comienza una nueva racha hoy!' : `¡Sigue así! Llevas ${streak} días seguidos leyendo`}
              </p>
            </div>
          </div>

          {/* Calendar Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                Calendario
              </h3>
              <button
                onClick={goToToday}
                className="text-xs text-emerald-600 hover:text-emerald-700"
              >
                Hoy
              </button>
            </div>
            
            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={previousMonth}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <ChevronLeft className="w-5 h-5 text-slate-500" />
              </button>
              <span className="font-medium text-slate-700">
                {format(currentMonth, 'MMMM yyyy', { locale: es })}
              </span>
              <button
                onClick={nextMonth}
                className="p-1 hover:bg-slate-100 rounded-lg transition"
              >
                <ChevronRight className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            {/* Week days */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(day => (
                <div key={day} className="text-center text-xs text-slate-400 py-1">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {monthDays.map((day, idx) => {
                const dateKey = format(day, 'yyyy-MM-dd');
                const hasEntry = daysWithEntries.has(dateKey);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const isTodayDate = isToday(day);
                
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      aspect-square rounded-lg flex items-center justify-center text-sm transition-all
                      ${hasEntry ? 'font-medium' : ''}
                      ${isSelected ? 'bg-emerald-600 text-white shadow-sm' : ''}
                      ${isTodayDate && !isSelected ? 'border border-emerald-400 bg-emerald-50' : ''}
                      ${!isSelected && !isTodayDate ? 'hover:bg-slate-100 text-slate-700' : ''}
                    `}
                  >
                    <div className="relative">
                      {format(day, 'd')}
                      {hasEntry && !isSelected && (
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-emerald-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
            
            {/* Legend */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-slate-500">Con lecturas</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-600 rounded-full"></div>
                <span className="text-slate-500">Seleccionado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntriesPage;