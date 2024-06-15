import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

// Get all to-do lists
router.get('/todo-lists', async (req, res) => {
  const todoLists = await prisma.todoList.findMany({ include: { items: true } });
  res.json(todoLists);
});

// Create a new to-do list
const createTodoListSchema = z.object({ name: z.string() });
router.post('/todo-lists', async (req, res) => {
  try {
    createTodoListSchema.parse(req.body);
    const newList = await prisma.todoList.create({ data: req.body });
    res.json({ ...newList, items: [] });
  } catch (e: any) {
    res.status(400).json({ error: e.errors });
  }
});

// Delete a to-do list and its items
router.delete('/todo-lists/:id', async (req, res) => {
  const listId = parseInt(req.params.id);
  await prisma.todoItem.deleteMany({ where: { listId } });
  await prisma.todoList.delete({ where: { id: listId } });
  res.status(204).end();
});

// Add an item to a to-do list
const createTodoItemSchema = z.object({ name: z.string() });
router.post('/todo-lists/:id/items', async (req, res) => {
  try {
    createTodoItemSchema.parse(req.body);
    const newItem = await prisma.todoItem.create({
      data: {
        name: req.body.name,
        listId: parseInt(req.params.id),
      },
    });
    res.json(newItem);
  } catch (e: any) {
    res.status(400).json({ error: e.errors });
  }
});

// Remove an item from a to-do list
router.delete('/todo-lists/:listId/items/:itemId', async (req, res) => {
  await prisma.todoItem.delete({ where: { id: parseInt(req.params.itemId) } });
  res.status(204).end();
});

// Update the completion status of a to-do item
const updateTodoItemSchema = z.object({
  completed: z.boolean(),
});

router.patch('/todo-lists/:listId/items/:itemId', async (req, res) => {
  try {
    const { listId, itemId } = req.params;
    const { completed } = updateTodoItemSchema.parse(req.body);
    const updatedItem = await prisma.todoItem.update({
      where: { id: parseInt(itemId) },
      data: { completed },
    });
    res.json(updatedItem);
  } catch (e: any) {
    res.status(400).json({ error: e.errors });
  }
});

export default router;
