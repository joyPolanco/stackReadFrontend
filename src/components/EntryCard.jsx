// components/modals/AddEntryModal.jsx
import React, { useState } from "react";
import { X, Plus, BookOpen, CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router";

const EntryCard = ({ entry, onDelete }) => {
  const navigate = useNavigate();
  const book = entry.book;
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    });
  };
  
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-slate-100">
      <div className="flex gap-4">
        <div className="w-14 h-20 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm">
          {book?.cover ? (
            <img src={book.cover} alt={book.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen size={20} className="text-slate-300" />
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4 className="font-semibold text-slate-800 truncate">{book?.title}</h4>
              <p className="text-xs text-slate-500 mt-0.5">{book?.author}</p>
            </div>
            <button
              onClick={() => navigate(`/entries/${entry._id}`)}
              className="p-1.5 text-slate-400 hover:text-emerald-600 transition rounded-lg"
            >
              Ver detalles
            </button>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-2 text-xs">
            <span className="flex items-center gap-1 text-slate-500">
              <CalendarIcon size={12} />
              {formatDate(entry.date)}
            </span>
            <span className="text-emerald-600 font-medium">
              {entry.startPage} - {entry.endPage}
            </span>
            <span className="text-slate-500">
              {entry.readPages} páginas
            </span>
          </div>
          
          {entry.cite && (
            <p className="text-xs text-amber-600 mt-2 italic line-clamp-1">
              "{entry.cite}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EntryCard;