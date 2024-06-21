"use client";
import React from "react";
import Trash2Icon from "../icons/Trash2Icon";

type TodoItemSectionProps = {
  selectedList: any;
  newItemName: string;
  setNewItemName: (name: string) => void;
  handleAddItem: () => void;
  handleToggleItemCompletion: (
    listId: number,
    itemId: number,
    completed: boolean
  ) => void;
  handleRemoveItem: (listId: number, itemId: number) => void;
  setError: (error: any) => void;
};

const TodoItemSection = ({
  selectedList,
  newItemName,
  setNewItemName,
  handleAddItem,
  handleToggleItemCompletion,
  handleRemoveItem,
  setError,
}: TodoItemSectionProps) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto bg-white flex flex-col">
      {selectedList ? (
        <>
          <h2 className="text-2xl font-bold text-black mb-4">
            {selectedList.name}
          </h2>
          <div className="flex-grow overflow-y-auto">
            <ul className="mb-4 sm:max-h-[65vh] md:max-h-[85vh] overflow-y-auto">
              {selectedList.items.map((item: any) => (
                <li
                  key={item.id}
                  className={`p-2 mb-2 flex justify-between items-center rounded ${
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
          </div>
          <div className="flex mt-auto mt-4">
            <input
              type="text"
              value={newItemName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewItemName(e.target.value)
              }
              onFocus={() => setError(null)}
              className="border p-2 text-black rounded-l-lg flex-grow tracking-tighter"
              placeholder="New list item"
            />
            <button
              onClick={handleAddItem}
              className="bg-green-500 text-white px-4 py-2 font-bold rounded-r-lg hover:bg-green-600 transition-colors duration-300 ease-in-out"
            >
              Add Item
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center flex-grow">
          <p className="text-gray-500">Select a list to view its items.</p>
        </div>
      )}
    </div>
  );
};

export default TodoItemSection;
