"use client";
import React from "react";
import Trash2Icon from "../icons/Trash2Icon";

interface TodoListsSectionProps {
  todoLists: { id: number; name: string }[];
  selectedListId: number | null;
  setSelectedListId: (id: number | null) => void;
  handleDeleteList: (id: number) => void;
  session: any;
  setIsPopupOpen: (isOpen: boolean) => void;
  signOut: (options: { callbackUrl: string }) => void;
}

const TodoListsSection: React.FC<TodoListsSectionProps> = ({
  todoLists,
  selectedListId,
  setSelectedListId,
  handleDeleteList,
  session,
  setIsPopupOpen,
  signOut,
}) => {
  return (
    <div className="list-wrapper w-full md:w-1/3 p-4 overflow-y-visible">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black mr-2">
          {session?.user?.name}&apos;s To-Do Lists
        </h1>

        <div className="flex space-x-2">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="bg-blue-500 text-white px-2 py-1 rounded font-bold hover:bg-blue-600 transition-colors duration-300 ease-in-out"
          >
            Add List
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="bg-red-500 text-white px-2 py-1 rounded font-bold hover:bg-red-600 transition-colors duration-300 ease-in-out"
          >
            Logout
          </button>
        </div>
      </div>

      {todoLists.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 mb-8">
          No to-do lists found. Add a list to get started.
        </div>
      ) : (
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
      )}
    </div>
  );
};
export default TodoListsSection;
