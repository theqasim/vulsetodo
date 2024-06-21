"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import TodoListsSection from "./Dashboard/TodoListsSection";
import TodoItemSection from "./Dashboard/TodoListItemSection";
import DeleteConfirmation from "./Modals/DeleteConfirmation";
import ErrorPopup from "./Modals/ErrorPopup";
import useTodoFunctions from "../hooks/todoListFuctions";

const Dashboard = () => {
  const { status } = useSession();
  const router = useRouter();

  const {
    todoLists,
    selectedListId,
    setSelectedListId,
    newListName,
    setNewListName,
    newItemName,
    setNewItemName,
    isPopupOpen,
    setIsPopupOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    listToDelete,
    setListToDelete,
    error,
    setError,
    handleAddList,
    handleDeleteList,
    confirmDeleteList,
    handleAddItem,
    handleRemoveItem,
    handleToggleItemCompletion,
  } = useTodoFunctions();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const { data: session } = useSession();

  const selectedList = todoLists.find(
    (list: { id: any }) => list.id === selectedListId
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <TodoListsSection
        todoLists={todoLists}
        selectedListId={selectedListId}
        setSelectedListId={setSelectedListId}
        handleDeleteList={handleDeleteList}
        session={session}
        setIsPopupOpen={setIsPopupOpen}
        signOut={signOut}
      />
      <TodoItemSection
        selectedList={selectedList}
        newItemName={newItemName}
        setNewItemName={setNewItemName}
        handleAddItem={handleAddItem}
        handleToggleItemCompletion={handleToggleItemCompletion}
        handleRemoveItem={handleRemoveItem}
        setError={setError}
      />
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300 z-50">
            <h2 className="text-xl font-bold text-black tracking-tighter mb-4">
              New List
            </h2>
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              onFocus={() => setError(null)}
              className="border p-2 rounded text-black tracking-tighter w-full mb-4"
              placeholder="List title"
            />
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setIsPopupOpen(false);
                  setError(null);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded mr-2 hover:bg-red-600 font-bold transition-colors duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleAddList}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold transition-colors duration-300 ease-in-out"
              >
                Add List
              </button>
            </div>
          </div>
        </div>
      )}
      {error && <ErrorPopup message={error} onClose={() => setError(null)} />}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteList}
      />
    </div>
  );
};

export default Dashboard;
