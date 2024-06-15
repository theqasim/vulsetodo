"use client";
import React, { useState, useEffect } from "react";
import {
  fetchTodoLists,
  createTodoList,
  deleteTodoList,
  addItemToList,
  removeItemFromList,
  updateTodoItemStatus,
} from "../services/api";
import { TodoList as TodoListType } from "../types";
import Trash2Icon from "./icons/Trash2Icon";
import DeleteConfirmation from "./Modals/DeleteConfirmation";

const Dashboard = () => {
  const [todoLists, setTodoLists] = useState<TodoListType[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [newListName, setNewListName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState<number | null>(null);

  useEffect(() => {
    const getTodoLists = async () => {
      const lists = await fetchTodoLists();
      setTodoLists(lists);
      if (lists.length > 0) {
        setSelectedListId(lists[0].id);
      }
    };
    getTodoLists();
  }, []);

  const handleAddList = async () => {
    if (newListName.trim()) {
      const newList = await createTodoList(newListName);
      setTodoLists([...todoLists, { ...newList, items: [] }]);
      setNewListName("");
      setSelectedListId(newList.id);
      setIsPopupOpen(false); // Close the popup after adding the list
    }
  };

  const handleDeleteList = async (id: number) => {
    setIsDeleteModalOpen(true);
    setListToDelete(id);
  };

  const confirmDeleteList = async () => {
    if (listToDelete !== null) {
      await deleteTodoList(listToDelete.toString());
      setTodoLists(todoLists.filter((list) => list.id !== listToDelete));
      if (selectedListId === listToDelete) {
        setSelectedListId(todoLists.length > 0 ? todoLists[0].id : null);
      }
      setIsDeleteModalOpen(false);
      setListToDelete(null);
    }
  };

  const handleAddItem = async () => {
    if (newItemName.trim() && selectedListId !== null) {
      const newItem = await addItemToList(
        selectedListId.toString(),
        newItemName
      );
      setTodoLists(
        todoLists.map((list) =>
          list.id === selectedListId
            ? { ...list, items: [...list.items, newItem] }
            : list
        )
      );
      setNewItemName("");
    }
  };

  const handleRemoveItem = async (listId: number, itemId: number) => {
    await removeItemFromList(listId.toString(), itemId.toString());
    setTodoLists(
      todoLists.map((list) =>
        list.id === listId
          ? { ...list, items: list.items.filter((item) => item.id !== itemId) }
          : list
      )
    );
  };

  const handleToggleItemCompletion = async (
    listId: number,
    itemId: number,
    completed: boolean
  ) => {
    const updatedItem = await updateTodoItemStatus(
      listId.toString(),
      itemId.toString(),
      !completed
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
  };

  const selectedList = todoLists.find((list) => list.id === selectedListId);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <div className=" list-wrapper w-full md:w-1/4  p-4  overflow-y-visible">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-black">To-Do Lists</h1>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="bg-blue-500 text-white px-2 py-1 tracking-tighter rounded hover:bg-blue-600 transition-colors duration-300 ease-in-out"
          >
            Add List
          </button>
        </div>
        <ul className="mb-4 max-h-[30vh] md:max-h-full overflow-y-auto">
          {todoLists.map((list) => (
            <li
              key={list.id}
              className={`p-2 hover:shadow transition-colors duration-300 ease-in-out mb-2 rounded cursor-pointer ${
                selectedListId === list.id ? "bg-blue-200" : "bg-white"
              }`}
              onClick={() => setSelectedListId(list.id)}
            >
              <div className="flex justify-between text-black font-bold items-center">
                {list.name}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteList(list.id);
                  }}
                  className="text-red-500 flex items-center justify-center h-8 w-8"
                >
                  <Trash2Icon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        {selectedList && (
          <>
            <h2 className="text-2xl font-bold text-black mb-4">
              {selectedList.name}
            </h2>
            <ul className="mb-4 max-h-[40vh] md:max-h-full overflow-y-auto">
              {selectedList.items.map((item) => (
                <li
                  key={item.id}
                  className={`p-2 mb-2 flex justify-between items-center rounded  ${
                    item.completed ? "bg-green-100" : "bg-gray-200"
                  }`}
                >
                  <div className="flex items-center">
                    <label
                      className="relative flex items-center p-3 rounded-full cursor-pointer"
                      htmlFor={`checkbox-${item.id}`}
                    >
                      <input
                        type="checkbox"
                        className="before:content[''] peer relative border border-dashed border-black h-5 w-5 cursor-pointer appearance-none rounded-md border border-blue-gray-200 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-green-500 checked:bg-green-500 checked:before:bg-green-500 hover:before:opacity-10"
                        id={`checkbox-${item.id}`}
                        checked={item.completed}
                        onChange={() =>
                          handleToggleItemCompletion(
                            selectedList.id,
                            item.id,
                            item.completed
                          )
                        }
                      />
                      <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3.5 w-3.5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </label>
                    <span
                      className={`${
                        item.completed
                          ? "line-through text-gray-500"
                          : "text-black"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(selectedList.id, item.id)}
                    className="text-red-500 flex items-center justify-center h-8 w-8"
                  >
                    <Trash2Icon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="border p-2 text-black rounded-l-lg flex-grow tracking-tighter"
                placeholder="New item"
              />
              <button
                onClick={handleAddItem}
                className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition-colors duration-300 ease-in-out"
              >
                Add Item
              </button>
            </div>
          </>
        )}
      </div>
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
              className="border p-2 rounded text-black tracking-tighter w-full mb-4"
              placeholder="List title"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsPopupOpen(false)}
                className="bg-red-500 text-white px-4 tracking-tighter py-2 rounded mr-2 hover:bg-red-600 transition-colors duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={handleAddList}
                className="bg-blue-500 text-white tracking-tighter px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300 ease-in-out"
              >
                Add List
              </button>
            </div>
          </div>
        </div>
      )}
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteList}
      />
    </div>
  );
};

export default Dashboard;
