import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const fetchTodoLists = async () => {
  const response = await api.get("/todo-lists");
  return response.data;
};

export const createTodoList = async (name: string) => {
  const response = await api.post("/todo-lists", { name });
  return response.data;
};

export const deleteTodoList = async (id: string) => {
  await api.delete(`/todo-lists/${id}`);
};

export const addItemToList = async (listId: string, itemName: string) => {
  const response = await api.post(`/todo-lists/${listId}/items`, {
    name: itemName,
  });
  return response.data;
};

export const removeItemFromList = async (listId: string, itemId: string) => {
  await api.delete(`/todo-lists/${listId}/items/${itemId}`);
};

export const updateTodoItemStatus = async (
  listId: string,
  itemId: string,
  completed: boolean
) => {
  const response = await api.patch(`/todo-lists/${listId}/items/${itemId}`, {
    completed,
  });
  return response.data;
};
