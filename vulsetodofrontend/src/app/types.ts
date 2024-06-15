// src/types.ts
export interface TodoItem {
    id: number;
    name: string;
    completed: boolean;
  }

  export interface TodoList {
    id: number;
    name: string;
    items: TodoItem[];
  }
