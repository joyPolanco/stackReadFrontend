import { create } from "zustand";
import { useAppStore } from "./useAppStore";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

export const useActionsStore = create((set) => ({
  isCreatingBook: false,

 createBoook: async (data) => {
  try {
    set({ isCreatingBook: true });

   const res = await axiosInstance.post("/books", data);

useAppStore.getState().addBook(res.data.book);

return { success: true };

  } catch (err) {
    const errors = err?.response?.data?.errors;

    if (errors) {
      return { success: false, errors };
    }

    toast.error("Error al crear el libro");
    return { success: false };
  } finally {
    set({ isCreatingBook: false });
  }
},
deleteBook: async (id) => {
  try {
    await axiosInstance.delete(`/books/${id}`);

    // eliminar del estado
    useAppStore.setState((state) => ({
      books: state.books.filter((b) => b._id !== id),
    }));

    toast.success("Libro eliminado");
      useAppStore.setState(() => ({
     currentDeleteBook : null
    }));

  } catch (err) {
    console.log(err);
    toast.error("Error al eliminar");
  }
},
createList: async (data) => {
  try {
    const res = await axiosInstance.post("/lists", data);

    if (res.status === 201) {
      useAppStore.setState((state) => ({
        lists: [...state.lists, res.data.list],
      }));

      return { success: true };
    }

  } catch (err) {
    const errors = err?.response?.data?.errors;

    if (errors) {
      return { success: false, errors };
    }

    return { success: false };
  }
},

archiveCollection: async (id) => {
  try {
    const res = await axiosInstance.patch(`/collections/${id}/archive`);

    if (res.status === 200) {
      useAppStore.getState().toggleArchiveCollectionInState(id);
      return { success: true };
    }

    return { success: false };

  } catch (err) {
    toast.error("Error al actualizar colección");
    return { success: false };
  }
},

createCollection: async (data) => {
  try {
    const res = await axiosInstance.post("/collections", data);

    if (res.status === 201) {
      await useAppStore.getState().getCollections(); // ✅ REFRESH REAL
      return { success: true };
    }

    return { success: false };

  } catch (err) {
    const errors = err?.response?.data?.errors;

    if (errors) {
      return { success: false, errors };
    }

    toast.error("Error al crear colección");
    return { success: false };
  }
},
deleteCollection: async (id) => {
  try {
    const res = await axiosInstance.delete(`/collections/${id}`);

    if (res.status === 200) {
      useAppStore.setState((state) => ({
        collections: state.collections.filter((c) => c._id !== id),
        collectionToDelete: null,
        isAnyModalOpen: false,
      }));

      toast.success("Colección eliminada");
      return { success: true };
    }

    return { success: false };
  } catch (err) {
    console.log(err);
    toast.error("Error al eliminar colección");
    return { success: false };
  }
},
getCollectionLists: async (collectionId) => {
  try {

    console.log("cargarod listas")
    const res = await axiosInstance.get(`/collections/${collectionId}/lists`);
        console.log("llistas", res)

    return res.data;
  } catch (err) {
    console.error("Error:", err);
    toast.error("Error al cargar las listas");
    throw err;
  }
},
// Agregar a useActionsStore.js

getCollectionById: async (id) => {
  try {
    const res = await axiosInstance.get(`/collections/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error:", err);
    toast.error("Error al cargar la colección");
    throw err;
  }
},

updateCollection: async (id, data) => {
  try {
    const res = await axiosInstance.put(`/collections/${id}`, data);
    
    if (res.status === 200) {
      // Actualizar en el estado local
      useAppStore.getState().updateCollectionInState(id, res.data.collection);
      toast.success("Colección actualizada");
      return { success: true, collection: res.data.collection };
    }
  } catch (err) {
    const errors = err?.response?.data?.errors;
    if (errors) {
      return { success: false, errors };
    }
    toast.error(err.response?.data?.message || "Error al actualizar");
    return { success: false };
  }
},
updateCollectionLists: async (collectionId, listIds) => {
  try {
    const res = await axiosInstance.put(`/collections/${collectionId}/lists`, { listIds });
    
    if (res.status === 200) {
      useAppStore.getState().updateCollectionLists(collectionId, res.data.collection.lists);
      toast.success("Listas actualizadas");
      return { success: true, lists: res.data.collection.lists };
    }
  } catch (err) {
    console.error("Error:", err);
    toast.error(err.response?.data?.message || "Error al actualizar");
    return { success: false };
  }
},
updateBook: async (id, data) => {
  try {
const res =await axiosInstance.put(`/books/${id}`, data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});
 if (res.status === 200) {
      console.log(res.data)

  useAppStore.getState().updateBookInState(res.data.book);
  return { success: true };
}

  } catch (err) {
    console.log("NO DE MODIFICO", err);
    return { success: false };
  }
},

addListToCollection: async (collectionId, listId) => {
    try {
              console.log("SE ENVIO")

      const res = await axiosInstance.post(`/collections/${collectionId}/lists`, {
        listId
      });
      console.log("SE ENVIO")
      
      if (res.status === 200) {
        // Recargar listas para actualizar collectionIds
        await useAppStore.getState().getLists();
        await useAppStore.getState().getCollections();
        return { success: true };
      }
    } catch (err) {
      console.error("Error al agregar lista a colección:", err);
      toast.error(err.response?.data?.message || "Error al agregar a colección");
      return { success: false };
    }
  },

  // NUEVA ACCIÓN: Quitar lista de colección
  removeListFromCollection: async (collectionId, listId) => {
    try {
      const res = await axiosInstance.delete(`/collections/${collectionId}/lists/${listId}`);
      
      if (res.status === 200) {
        // Recargar listas para actualizar collectionIds
        await useAppStore.getState().getLists();
        await useAppStore.getState().getCollections();
        return { success: true };
      }
    } catch (err) {
      console.error("Error al quitar lista de colección:", err);
      toast.error(err.response?.data?.message || "Error al quitar de colección");
      return { success: false };
    }
  },
deleteList: async (listId) => {
  try {
    const res = await axiosInstance.delete(`/lists/${listId}`);
    
    if (res.status === 200) {
      // Eliminar la lista del estado local
      useAppStore.setState((state) => ({
        lists: state.lists.filter((l) => l._id !== listId),
      }));
      
      toast.success("Lista eliminada correctamente");
      return { success: true };
    }
  } catch (err) {
    console.error("Error al eliminar lista:", err);
    toast.error(err.response?.data?.message || "Error al eliminar la lista");
    return { success: false };
  }
},

// useActionsStore.js - Agregar:
// useActionsStore.js - Corregir getListForEdit
getListForEdit: async (listId) => {
  try {
    const res = await axiosInstance.get(`/lists/${listId}`);
    return res.data;
  } catch (err) {
    console.error("Error al obtener lista para editar:", err);
    toast.error(err.response?.data?.message || "Error al cargar datos de la lista");
    throw err;
  }
},

updateList: async (listId, data) => {
  try {
    const res = await axiosInstance.put(`/lists/${listId}`, data);
    if (res.status === 200) {
      // Actualizar la lista en el estado local
      useAppStore.setState((state) => ({
        lists: state.lists.map(l => 
          l._id === listId ? { ...l, name: data.name, description: data.description } : l
        )
      }));
      toast.success("Lista actualizada correctamente");
      return { success: true, list: res.data.list };
    }
  } catch (err) {
    console.error("Error al actualizar lista:", err);
    toast.error(err.response?.data?.message || "Error al actualizar la lista");
    return { success: false };
  }
},

// Agregar a useActionsStore.js

getListWithBooks: async (listId) => {
  try {
    const res = await axiosInstance.get(`/lists/${listId}`);
    return res.data;
  } catch (err) {
    console.error("Error:", err);
    toast.error("Error al cargar la lista");
    throw err;
  }
},

updateListBooks: async (listId, bookIds) => {
  try {
    const res = await axiosInstance.put(`/lists/${listId}/books`, { bookIds });
    
    if (res.status === 200) {
      // Actualizar en el estado local si es necesario
      toast.success(res.data.message);
      return { success: true, books: res.data.books, totalBooks: res.data.totalBooks };
    }
  } catch (err) {
    console.error("Error:", err);
    toast.error(err.response?.data?.message || "Error al actualizar libros");
    return { success: false };
  }
},












//ENTRIES
// Agregar a useActionsStore.js


addEntry: async (data) => {
  try {
    const res = await axiosInstance.post(`/entries`, data);
    if (res.status === 201) {
      toast.success("Entrada creada correctamente");
      // Devolver los datos de la entrada creada
      return { success: true, data: res.data };
    }
    return { success: false };
  } catch (err) {
    console.error("Error al crear entrada:", err);
    const errorMessage = err?.response?.data?.message || "Error al crear la entrada";
    toast.error(errorMessage);
    return { success: false, error: errorMessage };
  }
},

getEntriesPaginated: async (page = 1, limit = 10) => {
  try {
    const res = await axiosInstance.get(`/entries?page=${page}&limit=${limit}`);
    return res.data;
  } catch (err) {
    console.error("Error:", err);
    toast.error("Error al cargar entradas");
    throw err;
  }
},

getStreakStats: async () => {
  try {
    const res = await axiosInstance.get('/entries/stats/streak');
    return res.data;
  } catch (err) {
    console.error("Error:", err);
    return { streak: 0, totalEntries: 0 };
  }
},

deleteEntry: async (id) => {
  try {
    const res = await axiosInstance.delete(`/entries/${id}`);
    if (res.status === 200) {
      toast.success("Entrada eliminada");
      return { success: true };
    }
  } catch (err) {
    console.error("Error:", err);
    toast.error("Error al eliminar entrada");
    return { success: false };
  }

},
// En useActionsStore.js
updateEntry: async (id, data) => {
  try {
    const res = await axiosInstance.put(`/entries/${id}`, data);
    return res.data;
  } catch (error) {
    console.error('Error updating entry:', error);
    throw error;
  }
},

getEntryDetail: async (id) => {
  try {
    const res = await axiosInstance.get(`/entries/${id}`);
    return res.data;
  } catch (error) {
    console.error('Error getting entry detail:', error);
    toast.error('Error al cargar los detalles de la entrada');
    throw error;
  }
},
}));

