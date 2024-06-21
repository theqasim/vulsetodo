import { TodoList, TodoItem } from "../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchTodoLists = async (token: string): Promise<TodoList[]> => {
  try {
    const res = await fetch(`${API_URL}/todo-lists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch todo lists: ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error: any) {
    throw new Error(`Error fetching todo lists: ${(error as any).message}`);
  }
};

export const createTodoList = async (accessToken: string, name: string) => {
  try {
    const response = await fetch(`${API_URL}/todo-lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create todo list");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const deleteTodoList = async (
  id: string,
  token: string
): Promise<void> => {
  const res = await fetch(`${API_URL}/todo-lists/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to delete todo list");
  }
};

export const addItemToList = async (
  listId: string,
  name: string,
  token: string
): Promise<TodoItem> => {
  const res = await fetch(`${API_URL}/todo-lists/${listId}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    throw new Error("Failed to add item to list");
  }
  return res.json();
};

export const removeItemFromList = async (
  listId: string,
  itemId: string,
  token: string
): Promise<void> => {
  const res = await fetch(`${API_URL}/todo-lists/${listId}/items/${itemId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to remove item from list");
  }
};

export const updateTodoItemStatus = async (
  listId: string,
  itemId: string,
  completed: boolean,
  token: string
): Promise<TodoItem> => {
  const res = await fetch(`${API_URL}/todo-lists/${listId}/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) {
    throw new Error("Failed to update item status");
  }
  return res.json();
};
