import { useActionsStore } from "../../store/useActionsStore";
import { useAppStore } from "../../store/useAppStore";

const DeleteCollectionModal = () => {
  const {
    collectionToDelete,
    setAnyModalOpen,
    clearCollectionToDelete,
  } = useAppStore();

  const { deleteCollection } = useActionsStore();

  if (!collectionToDelete) return null;

  const handleDelete = async () => {
    const res = await deleteCollection(collectionToDelete._id);

    if (res.success) {
      clearCollectionToDelete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[420px] p-6 rounded-2xl shadow-xl">

        <h2 className="text-lg font-semibold">
          Eliminar colección
        </h2>

        <p className="text-sm text-gray-600 mt-2">
          ¿Seguro que deseas eliminar{" "}
          <b>{collectionToDelete.name}</b>?
        </p>

        <div className="flex justify-end gap-2 mt-5">

          <button
            onClick={()=>{clearCollectionToDelete()
              setAnyModalOpen(false)

            }}
            className="px-4 py-2 bg-gray-100 rounded-lg"
          >
            Cancelar
          </button>

          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Eliminar
          </button>

        </div>
      </div>
    </div>
  );
};

export default DeleteCollectionModal;