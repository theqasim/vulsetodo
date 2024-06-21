import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";


interface AuthenticatedRequest extends Request {
  userId?: string;
}

const prisma = new PrismaClient();
const router = Router();
const secret = process.env.NEXTAUTH_SECRET;


// Middleware to authenticate requests
export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: () => void
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret as jwt.Secret) as JwtPayload & {
      id: string;
    };
    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};


const getUserId = (req: AuthenticatedRequest): number => {
  if (!req.userId) {
    throw new Error("User ID is undefined");
  }
  return parseInt(req.userId, 10);
};

// Get all to-do lists for the authenticated user
router.get(
  "/todo-lists",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = getUserId(req);
      const todoLists = await prisma.todoList.findMany({
        where: { userId },
        include: { items: true },
      });
      res.json(todoLists);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch to-do lists" });
    }
  }
);

// Create a new to-do list
const createTodoListSchema = z.object({ name: z.string() });
router.post(
  "/todo-lists",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      createTodoListSchema.parse(req.body);

      const userId = getUserId(req);

      const userExists = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userExists) {
        throw new Error("User not found");
      }

      const newList = await prisma.todoList.create({
        data: {
          name: req.body.name,
          userId: userId,
        },
      });

      res.json({ ...newList, items: [] });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  }
);

// Delete a to-do list and its items
router.delete(
  "/todo-lists/:id",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    const listId = parseInt(req.params.id, 10);
    try {
      await prisma.todoItem.deleteMany({ where: { listId } });
      await prisma.todoList.delete({ where: { id: listId } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete to-do list" });
    }
  }
);

// Add an item to a to-do list
const createTodoItemSchema = z.object({ name: z.string() });
router.post(
  "/todo-lists/:id/items",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      createTodoItemSchema.parse(req.body);
      const newItem = await prisma.todoItem.create({
        data: {
          name: req.body.name,
          listId: parseInt(req.params.id, 10),
        },
      });
      res.json(newItem);
    } catch (e: any) {
      res.status(400).json({ error: e.errors });
    }
  }
);

// Remove an item from a to-do list
router.delete(
  "/todo-lists/:listId/items/:itemId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      await prisma.todoItem.delete({
        where: { id: parseInt(req.params.itemId, 10) },
      });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete to-do item" });
    }
  }
);

// Update the completion status of a to-do item
const updateTodoItemSchema = z.object({
  completed: z.boolean(),
});

// Add an item to a to-do list
router.patch(
  "/todo-lists/:listId/items/:itemId",
  authenticate,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { itemId } = req.params;
      const { completed } = updateTodoItemSchema.parse(req.body);
      const updatedItem = await prisma.todoItem.update({
        where: { id: parseInt(itemId, 10) },
        data: { completed },
      });
      res.json(updatedItem);
    } catch (e: any) {
      res.status(400).json({ error: e.errors });
    }
  }
);

export default router;
