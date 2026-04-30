import toast from "react-hot-toast";
import { create } from "zustand";
import { axiosInstance } from "../../lib/axios";

export const useAppStore = create((set) => ({

    isMenuOpen: true,
    setMenuOpen : (value)=>{
        set({isMenuOpen:value})
    },
    isEditProfileModalOpen: false,
    setEditProfileModalOpen: (value)=>{
        set(
            {isEditProfileModalOpen:value,
            isAnyModalOpen: value
            } 
        )
    },

 getBookById: async (id) => {
  try {
    const res = await axiosInstance.get(`/books/${id}`);
    return res.data;
  } catch (err) {
    console.log(err);
    toast.error("Error al cargar el libro");
    throw err;
  }
},
getBooks: async () => {
  try {
    const res = await axiosInstance.get("/books");

    set({ books: res.data.books });

  } catch (err) {
    console.log(err);
    toast.error("Error al cargar libros");
  }
},
  /* MOCK DATA */
  books: [
  ],
getLists: async () => {
  try {
    const res = await axiosInstance.get("/lists");

    set({ lists: res.data.lists });

  } catch (err) {
    console.log(err);
    toast.error("Error al cargar libros");
  }
},
  lists: [

  ],

  collections: [
  ],
  getCollections: async () => {
  try {
    const res = await axiosInstance.get("/collections");

    set({ collections: res.data.collections });

  } catch (err) {
    console.log(err);
    toast.error("Error al cargar colecciones");
  }
},

// Agregar a useAppStore.js

updateCollectionInState: (id, updatedData) =>
  set((state) => ({
    collections: state.collections.map((c) =>
      c._id === id ? { ...c, ...updatedData } : c
    ),
  })),
// useAppStore.js - Agregar
updateCollectionLists: (collectionId, lists) =>
  set((state) => ({
    collections: state.collections.map((c) =>
      c._id === collectionId ? { ...c, lists } : c
    ),
  })),

currentCollection: null,
setCurrentCollection: (collection) => set({ currentCollection: collection }),
  /* UI STATE */
  selectedTab: "books",
  setSelectedTab: (tab) => set({ selectedTab: tab }),

  isAnyModalOpen: false,
  setAnyModalOpen: (value) => set({ isAnyModalOpen: value }),

  //ADD
  isAddBookModalOpen: false,
  setIsAddBookModalOpen: (value) => {
    set({ isAddBookModalOpen: value });
  },

  //

  //    DELETE

  isDeleteBookModalOpen: false,
  setDeleteBookModalOpen: (value) => {
    set({ isDeleteBookModalOpen: value });
  },
setIsCreateListModalOpen: (value)=>{
set({isCreateListModalOpen: value} )
set({isAddBookModalOpen: false} )

},
isCreateListModalOpen: false,
  currentDeleteBook: null,
  setCurrentDeleteBook: (book) => {
    set({ currentDeleteBook: book });
  },

  /* ACTION MOCK */
  addBook: (book) =>
    set((state) => ({
      books: [...state.books, { ...book, _id: Date.now().toString() }],
    })),

isCreateCollectionModalOpen: false,
setCreateCollectionModalOpen : (value)=>
    {
    set({isAnyModalOpen:value,
        isCreateCollectionModalOpen:value }
    
    )
     set({ isAddBookModalOpen: false })
},
updateBookInState: (updatedBook) =>
  set((state) => ({
    books: state.books.map((b) =>
      b._id === updatedBook._id ? updatedBook : b
    ),
  })),

getListById: async (listId) => {
  try {
    console.log("intento")
    const res = await axiosInstance.get(`/lists/${listId}/books`);
    return res.data;
  } catch (err) {
    console.error("Error loading list:", err);
    toast.error("Error al cargar la lista");
    throw err;
  }
},
isAddEntryModalOpen:false,
setAddEntryModalOpen: (value)=>{

  set({
    isAnyModalOpen:value
  })

    set({
    isAddEntryModalOpen:value
  })
}

,
collectionToDelete: null,

setCollectionToDelete: (collection) =>
  set({ collectionToDelete: collection }),

clearCollectionToDelete: () =>
  set({ collectionToDelete: null }),



toggleArchiveCollectionInState: (id) =>
  set((state) => ({
    collections: state.collections.map((c) =>
      c._id === id
        ? { ...c, isArchived: !c.isArchived }
        : c
    ),
  })),

entries: [],

// Agregar la función getEntries
getEntries: async () => {
  try {
    const res = await axiosInstance.get("/entries?limit=100");
    set({ entries: res.data.entries });
    return res.data;
  } catch (err) {
    console.log(err);
    toast.error("Error al cargar entradas");
  }
}

}));


