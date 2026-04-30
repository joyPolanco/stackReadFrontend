import { Edit, Trash, List, Archive, ArchiveRestore, EyeIcon } from "lucide-react";
import React, { useEffect, useRef } from "react";

const CollectionCardMenu = ({
  onViewCollection,
  onClose,
  onViewLists,
  onEdit,
  onArchive,
  onDelete,
  isArchived,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden"
    >

        <button
        onClick={onViewCollection}
        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full"
      >
        <EyeIcon size={16} /> Ver colección
      </button>

    
      <button
        onClick={onViewLists}
        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full"
      >
        <List size={16} /> Ver listas
      </button>

      <button
        onClick={onEdit}
        className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 w-full"
      >
        <Edit size={16} /> Editar
      </button>

      <button
        onClick={onArchive}
        className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 w-full"
      >
        <Archive size={16} />
        {isArchived ? "Desarchivar" : "Archivar"}
      </button>

      <button
        onClick={onDelete}
        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
      >
        <Trash size={16} /> Eliminar
      </button>
    </div>
  );
};

export default CollectionCardMenu;