import React, { useState, useRef, useEffect } from "react";
import { MoreVertical, Trash2, Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router";

const BookCard = ({ book, onDelete, onView, onEdit }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const statusLabel = {
    reading: "Leyendo",
    read: "Leído",
    "to-read": "Quiero leer",
    abandoned: "Abandonado",
  };

  const statusColor = {
    reading: "bg-amber-100 text-amber-700",
    read: "bg-emerald-100 text-emerald-700",
    "to-read": "bg-blue-100 text-blue-700",
    abandoned: "bg-red-100 text-red-700",
  };

  const progress =
    book.total_pages > 0
      ? Math.round((book.pagesRead / book.total_pages) * 100)
      : 0;

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      const isClickInsideMenu = menuRef.current && menuRef.current.contains(e.target);
      const isClickOnButton = buttonRef.current && buttonRef.current.contains(e.target);
      
      if (!isClickInsideMenu && !isClickOnButton && open) {
        setOpen(false);
      }
    };

    const handleEscKey = (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [open]);

  const handleViewBook = () => {
    if (onView) {
      onView(book);
    }
    navigate(`/books/${book._id}`);
    setOpen(false);
  };

  const handleEditBook = () => {
    if (onEdit) {
      onEdit(book);
    }
    setOpen(false);
  };

  const handleDeleteBook = () => {
    if (onDelete) {
      onDelete(book._id);
    }
    setOpen(false);
    navigate("/")
  };

  return (
    <div
      onClick={handleViewBook}
      className="group relative bg-white rounded-xl p-3 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer hover:scale-[1.02] hover:border-emerald-200 border border-transparent"
    >
      {/* MENU BUTTON */}
      <button
        ref={buttonRef}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((p) => !p);
        }}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white transition-all z-10 opacity-0 group-hover:opacity-100"
      >
        <MoreVertical size={16} className="text-slate-500" />
      </button>

      {/* MENU DROPDOWN */}
      {open && (
        <div 
          ref={menuRef}
          className="absolute top-10 right-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="py-1">
            <button
              onClick={handleViewBook}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Eye size={14} />
              Ver libro
            </button>
            <button
              onClick={handleEditBook}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Edit size={14} />
              Editar libro
            </button>
            <button
              onClick={handleDeleteBook}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              Eliminar
            </button>
          </div>
        </div>
      )}

      {/* COVER */}
      {book.cover ? (
        <img
          src={book.cover}
          alt={book.title}
          className="h-44 w-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
        />
      ) : (
        <div className="h-44 w-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center text-xs text-slate-400">
          Sin portada
        </div>
      )}

      {/* INFO */}
      <h3 className="text-sm font-semibold mt-2 line-clamp-1 text-slate-800">
        {book.title}
      </h3>

      <p className="text-xs text-slate-500">{book.author}</p>

      <p className={`text-xs font-medium mt-1 inline-block px-2 py-0.5 rounded-full ${statusColor[book.status]}`}>
        {statusLabel[book.status]}
      </p>

      <p className="text-xs text-slate-500 mt-1">
        <span className="font-medium">{book.pagesRead || 0}</span> / {book.total_pages} páginas
      </p>

      {/* PROGRESS BAR */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-center mt-1">
        <p className="text-[10px] text-slate-400">
          {progress}% completado
        </p>
        {book.rating > 0 && (
          <div className="flex items-center gap-0.5">
            <span className="text-[10px] text-yellow-500">★</span>
            <span className="text-[10px] text-slate-500">{book.rating}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;