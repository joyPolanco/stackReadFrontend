import React from "react";
import { useAppStore } from "../../store/useAppStore.js";
import { useActionsStore } from "../../store/useActionsStore.js";
import { useNavigate } from "react-router";

const DeleteBookModal = () => {
    const navigate = useNavigate()
  const {
    isDeleteBookModalOpen,
    setDeleteBookModalOpen,
    setAnyModalOpen,
    currentDeleteBook,
    setCurrentDeleteBook,
    getBooks}=useAppStore()
  const {deleteBook} = useActionsStore()
  if (!isDeleteBookModalOpen) return null;

  const closeModal = () => {
    setDeleteBookModalOpen(false);
    setAnyModalOpen(false);
    setCurrentDeleteBook(null);
  };

 const handleDelete = async () => {
  try {
    await deleteBook(currentDeleteBook._id);

    closeModal();

     await getBooks();

    navigate("/books");
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={closeModal}
    >
      {/* OVERLAY */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* MODAL */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative z-10 w-full max-w-sm
          bg-white rounded-2xl p-6
          shadow-xl border border-gray-100
          animate-in fade-in zoom-in-95 duration-200
        "
      >
        {/* Título */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Eliminar libro
        </h2>

        {/* Descripción */}
        <p className="text-sm text-gray-500 mb-6">
          ¿Seguro que deseas eliminar{" "}
          <span className="font-medium text-gray-700">
            {currentDeleteBook?.title || "este libro"}
          </span>
          ? Esta acción no se puede deshacer.
        </p>

        {/* BOTONES */}
        <div className="flex justify-end gap-3">

          {/* Cancelar */}
          <button
            onClick={()=>{
                closeModal()
                navigate("/books")
            }}
            className="
              px-4 py-2 rounded-lg text-sm
              bg-gray-100 text-gray-600
              hover:bg-gray-200 transition
            "
          >
            Cancelar
          </button>

          {/* Confirmar */}
          <button
            onClick={handleDelete}
            className="
              px-4 py-2 rounded-lg text-sm
              bg-emerald-600 text-white
              hover:bg-emerald-700
              transition
            "
          >
            Eliminar
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteBookModal;