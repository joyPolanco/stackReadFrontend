import React from "react";
import MenuBar from "../components/MenuBar";
import { useAppStore } from "../store/useAppStore";
import { Outlet } from "react-router-dom";
import DeleteBookModal from "../components/modals/DeleteBookModal";
import AddBookModal from "../components/modals/AddBookModal";
import EditProfileModal from "../components/modals/EditProfileModal";
import { useEffect } from "react";
import CreateListModal from "../components/modals/CreateListModal";
import CreateCollection from "../components/modals/CreateCollection";
import AddEntryModal from "../components/modals/AddEntryModal";
import DeleteCollectionModal from "../components/modals/DeleteCollectionModal";

const AppContainer = () => {
  const {
    isMenuOpen,
    isAnyModalOpen,
    isDeleteBookModalOpen,
    isAddBookModalOpen,
    isEditProfileModalOpen,
    isCreateListModalOpen,
    isCreateCollectionModalOpen,
    isAddEntryModalOpen,
    collectionToDelete,
    getBooks,
    getLists,
    getCollections,
  } = useAppStore();

  useEffect(() => {
    getBooks();
    getLists();
    getCollections();
  }, [getBooks, getLists, getCollections]);

  return (
    <div
      className={`
        min-h-screen flex bg-slate-50 relative
        ${isAnyModalOpen ? "overflow-hidden" : ""}
      `}
    >
      {/* CONTENIDO */}
      <div
        className={`
          flex w-full transition-all duration-300
          ${isAnyModalOpen ? "blur-sm scale-[0.99] pointer-events-none" : ""}
        `}
      >
        {/* SIDEBAR */}
        <aside
          className={`
            hidden md:flex transition-all duration-300
            ${isMenuOpen ? "w-72 lg:w-90" : "w-20"}
          `}
        >
          <MenuBar />
        </aside>

        {/* MAIN (AQUÍ VA ROUTER) */}
        <main className="flex-1 p-4 pb-20 md:pb-6 overflow-y-auto">
          <Outlet />
        </main>

        {/* MOBILE */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
          <MenuBar mobile />
        </div>
      </div>

      {/* MODALES */}
      {isAnyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

          <div className="relative z-10 w-full flex justify-center">
            {isDeleteBookModalOpen && <DeleteBookModal />}
            {isAddBookModalOpen && <AddBookModal />}
            {isEditProfileModalOpen && <EditProfileModal />}
            {isCreateListModalOpen && <CreateListModal />}
            {isCreateCollectionModalOpen && <CreateCollection />}
            {isAddEntryModalOpen && <AddEntryModal />}
            {collectionToDelete && <DeleteCollectionModal />}


          </div>
        </div>
      )}
    </div>
  );
};

export default AppContainer;
