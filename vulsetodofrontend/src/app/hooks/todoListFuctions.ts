import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  fetchTodoLists,
  createTodoList,
  deleteTodoList,
  addItemToList,
  removeItemFromList,
  updateTodoItemStatus,
} from "../services/api";
import { TodoList as TodoListType } from "../types";

const useTodoFunctions = () => {
  const { data: session, status } = useSession();
  const [todoLists, setTodoLists] = useState<TodoListType[]>([]);
  const router = useRouter();
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const getTodoLists = async () => {
      if (session) {
        try {
          const lists = await fetchTodoLists(session.accessToken ?? "");
          setTodoLists(lists);
          if (lists.length > 0) {
            setSelectedListId(lists[0].id);
          }
        } catch (error) {
          setError(
            `Failed to fetch todo lists. Please try again. Error: ${error}`
          );
        }
      }
    };
    getTodoLists();
  }, [session]);

  const handleAddList = async () => {
    if (!newListName.trim()) {
      setError("A name is needed for the list.");
      return;
    }

    if (session) {
      try {
        const newList = await createTodoList(
          session.accessToken ?? "",
          newListName
        );
        setTodoLists([...todoLists, { ...newList, items: [] }]);
        setNewListName("");
        setSelectedListId(newList.id);
        setIsPopupOpen(false);
      } catch (error) {
        setError("Failed to create todo list. Please try again.");
      }
    }
  };

  const handleDeleteList = (id: number) => {
    setIsDeleteModalOpen(true);
    setListToDelete(id);
  };

  const confirmDeleteList = async () => {
    if (listToDelete !== null && session) {
      try {
        await deleteTodoList(
          listToDelete.toString(),
          session.accessToken ?? ""
        );
        setTodoLists(todoLists.filter((list) => list.id !== listToDelete));
        if (selectedListId === listToDelete) {
          setSelectedListId(todoLists.length > 0 ? todoLists[0].id : null);
        }
        setIsDeleteModalOpen(false);
        setListToDelete(null);
      } catch (error) {
        setError("Failed to delete todo list. Please try again.");
      }
    }
  };

  const handleAddItem = async () => {
    if (newItemName.trim() && selectedListId !== null && session) {
      try {
        const newItem = await addItemToList(
          selectedListId.toString(),
          newItemName,
          session.accessToken ?? ""
        );
        setTodoLists(
          todoLists.map((list) =>
            list.id === selectedListId
              ? { ...list, items: [...list.items, newItem] }
              : list
          )
        );
        setNewItemName("");
      } catch (error) {
        setError("Failed to add item to list. Please try again.");
      }
    } else {
      setError("A name is needed for the list item.");
    }
  };

  const handleRemoveItem = async (listId: number, itemId: number) => {
    if (session) {
      try {
        await removeItemFromList(
          listId.toString(),
          itemId.toString(),
          session.accessToken ?? ""
        );
        setTodoLists(
          todoLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.filter((item) => item.id !== itemId),
                }
              : list
          )
        );
      } catch (error) {
        setError("Failed to remove item from list. Please try again.");
      }
    }
  };

  const handleToggleItemCompletion = async (
    listId: number,
    itemId: number,
    completed: boolean
  ) => {
    if (session) {
      try {
        const updatedItem = await updateTodoItemStatus(
          listId.toString(),
          itemId.toString(),
          !completed,
          session.accessToken ?? ""
        );
        setTodoLists(
          todoLists.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  items: list.items.map((item) =>
                    item.id === itemId ? updatedItem : item
                  ),
                }
              : list
          )
        );
      } catch (error) {
        setError(
          `Failed to update item status. Please try again. Error: ${error}`
        );
      }
    }
  };

  return {
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
  };
};

export default useTodoFunctions;
