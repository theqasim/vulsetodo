"use client";
import React, { useState, useEffect } from 'react';
import {
  fetchTodoLists,
  createTodoList,
  deleteTodoList,
  addItemToList,
  removeItemFromList,
  updateTodoItemStatus,
} from '../services/api';
import { TodoList as TodoListType } from '../types';

const Dashboard = () => {
  const [todoLists, setTodoLists] = useState<TodoListType[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [newListName, setNewListName] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);

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
      setNewListName('');
      setSelectedListId(newList.id);
      setIsPopupOpen(false); // Close the popup after adding the list
    }
  };

  const handleDeleteList = async (id: number) => {
    await deleteTodoList(id.toString());
    setTodoLists(todoLists.filter((list) => list.id !== id));
    if (selectedListId === id) {
      setSelectedListId(todoLists.length > 0 ? todoLists[0].id : null);
    }
  };

  const handleAddItem = async () => {
    if (newItemName.trim() && selectedListId !== null) {
      const newItem = await addItemToList(selectedListId.toString(), newItemName);
      setTodoLists(
        todoLists.map((list) =>
          list.id === selectedListId ? { ...list, items: [...list.items, newItem] } : list
        )
      );
      setNewItemName('');
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
    <div className="flex h-screen">
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-1/3 bg-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold tracking-tighter text-black">To-Do Lists</h1>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="bg-blue-500 ml-1 shadow hover:shadow-lg text-white px-2 py-1 rounded transition ease-in duration-150"
            >
              Add List
            </button>
          </div>
          <ul className="mb-4 ">
            {todoLists.map((list) => (
              <li
                key={list.id}
                className={`p-2 mb-4 rounded rounded-lg shadow-[0_3px_10px_rgb(0,0,0,0.1)] hover:scale-105 transform transition-all duration-300 cursor-pointer ${
                  selectedListId === list.id ? 'bg-blue-200' : 'bg-white'
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
                    className="text-red-500 flex items-center justify-center"
                  >
                    {/* <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6.293 9.707a1 1 0 011.414 0L10 12.586l2.293-2.293a1 1 0 011.414 1.414L11.414 14l2.293 2.293a1 1 0 01-1.414 1.414L10 15.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 14 6.293 11.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg> */}
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
              <h2 className="text-2xl font-bold text-black mb-4">{selectedList.name}</h2>
              <ul className="mb-4">
                {selectedList.items.map((item) => (
                  <li
                    key={item.id}
                    className={`p-2 mb-2 flex tracking-tighter justify-between items-center shadow-md rounded ${
                      item.completed ? 'bg-green-100' : 'bg-gray-200'
                    }`}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={item.completed}
                        onChange={() =>
                          handleToggleItemCompletion(selectedList.id, item.id, item.completed)
                        }
                        className="mr-2"
                      />
                      <span
                        className={`${
                          item.completed ? 'line-through text-gray-500 transition ease-in duration-150' : 'text-black'
                        }`}
                      >
                        {item.name}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(selectedList.id, item.id)}
                      className="text-red-500 flex items-center justify-center"
                    >
                      {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6.293 9.707a1 1 0 011.414 0L10 12.586l2.293-2.293a1 1 0 011.414 1.414L11.414 14l2.293 2.293a1 1 0 01-1.414 1.414L10 15.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 14 6.293 11.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg> */}
                   <Trash2Icon className="h-5 w-5 hover:shadow-md " />

                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="border p-2 shadow text-black tracking-tighter rounded-l-lg flex-grow"
                  placeholder="New item"
                />
                <button
                  onClick={handleAddItem}
                  className="bg-green-500 text-white px-4 transition ease-in-out duration-200 hover:shadow hover:shadow-green-500 tracking-tighter py-2 rounded-r-lg"
                >
                  Add Item
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {isPopupOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg transform transition-transform duration-300">
            <h2 className="text-xl font-bold text-black tracking-tighter mb-4">New List</h2>
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
                className="bg-red-500 text-white px-4 tracking-tighter py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleAddList}
                className="bg-blue-500 text-white tracking-tighter px-4 py-2 rounded"
              >
                Add List
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function Trash2Icon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" x2="10" y1="11" y2="17" />
      <line x1="14" x2="14" y1="11" y2="17" />
    </svg>
  )
}

export default Dashboard;
