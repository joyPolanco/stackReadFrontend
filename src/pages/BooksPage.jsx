import React, { useState } from "react";
import BookCard from "../components/BookCard";
import NoImage from "../components/NoImage";
import { useAppStore } from "../store/useAppStore.js";
import { PlusIcon } from "lucide-react";

/* Filtros */
const mainFilters = [
  { label: "Todos", value: "all" },
  { label: "Leyendo", value: "reading" },
  { label: "Leídos", value: "read" },
  { label: "Quiero leer", value: "to-read" },
  { label: "Abandonados", value: "abandoned" },
];

const BooksPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedStates, setSelectedStates] = useState([]);
  const {
    books,
    setCurrentDeleteBook,
    setAnyModalOpen,
    setDeleteBookModalOpen,
    setIsAddBookModalOpen,
  } = useAppStore();

  const toggleState = (value) => {
    setSelectedStates((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const handleDelete = (book) => {
    setCurrentDeleteBook(book);
    setAnyModalOpen(true);
    setDeleteBookModalOpen(true);
    
  };

  /* FILTRO */
  let filteredBooks = books || [];

  if (activeTab !== "all") {
    filteredBooks = filteredBooks.filter(
      (b) => b.status === activeTab
    );
  }

  if (selectedStates.length > 0) {
    filteredBooks = filteredBooks.filter((b) =>
      selectedStates.includes(b.status)
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-90px)] p-6">

      {/* HEADER */}
      <h2 className="text-2xl font-semibold text-gray-800">
        Biblioteca
      </h2>

      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-200 overflow-x-auto">
        {mainFilters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveTab(filter.value)}
            className={`pb-2 text-sm font-medium transition ${
              activeTab === filter.value
                ? "text-emerald-700 border-b-2 border-emerald-600"
                : "text-gray-500"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 overflow-hidden">

        {/* LIBROS */}
        <div className="flex-[2] flex flex-col overflow-hidden">

          <p className="text-sm text-gray-500 mb-4">
            {filteredBooks.length} libros
          </p>

          <div className="flex-1 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

              {filteredBooks.length === 0 ? (
                <p className="text-gray-400 col-span-full text-center">
                  No hay libros
                </p>
              ) : (
                filteredBooks.map((book) => (
                  <BookCard
                    key={book._id}
                    book={book}
                    onDelete={() => handleDelete(book)}
                  />
                ))
              )}

            </div>
          </div>

        </div>

        {/* PANEL DERECHO */}
        <div className="md:w-56 flex flex-col gap-4 shrink-0">

          {/* BOTÓN AGREGAR (DESKTOP) */}
          <button
            className="w-full py-2 rounded-lg bg-emerald-600 text-white text-sm"
            onClick={() => {
              setAnyModalOpen(true);
              setIsAddBookModalOpen(true);
            }}
          >
            + Agregar libro
          </button>

          {/* FILTROS */}
          <div className="hidden md:flex flex-col gap-4 bg-white rounded-xl p-4 shadow-sm">

            <div className="flex justify-between">
              <h3 className="text-sm font-semibold text-gray-700">
                Filtros
              </h3>

              <button
                onClick={() => {
                  setSelectedStates([]);
                  setActiveTab("all");
                }}
                className="text-xs text-emerald-600"
              >
                Limpiar
              </button>
            </div>

            {mainFilters.slice(1).map((filter) => (
              <label
                key={filter.value}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                <input
                  type="checkbox"
                  checked={selectedStates.includes(filter.value)}
                  onChange={() => toggleState(filter.value)}
                />
                {filter.label}
              </label>
            ))}

          </div>
        </div>

      </div>

      {/* BOTÓN MOBILE */}
      <button
        onClick={() => {
          setAnyModalOpen(true);
          setIsAddBookModalOpen(true);
        }}
        className="md:hidden fixed bottom-20 right-5 w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg"
      >
        <PlusIcon />
      </button>

    </div>
  );
};

export default BooksPage;