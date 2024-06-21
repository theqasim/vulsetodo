import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new NextResponse(JSON.stringify({ error: "No token provided" }), {
      status: 401,
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, secret as string) as jwt.JwtPayload & {
      id: string;
    };

    const userId = parseInt(decoded.id, 10);
    if (isNaN(userId)) {
      throw new Error("Invalid user ID in token");
    }

    const todoLists = await prisma.todoList.findMany({
      where: { userId },
      include: { items: true },
    });

    return new NextResponse(JSON.stringify(todoLists), { status: 200 });
  } catch (error) {
    return new NextResponse(
      JSON.stringify({ error: "Invalid token or failed to fetch todo lists" }),
      { status: 401 }
    );
  }
}
