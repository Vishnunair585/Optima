import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getSessionFn } from "./auth.functions";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSessionFn();
  if (!session || !session.userId) {
    throw new Error("Unauthorized");
  }
  return next({ context: { session } });
});

export const adminMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSessionFn();
  if (!session || !session.userId) {
    throw new Error("Unauthorized");
  }
  
  // Basic admin check (could be expanded based on schema role)
  // We assume admin.com or role=admin for this project
  const isAdmin = session.role === "admin" || session.email?.endsWith("@admin.com");
  if (!isAdmin) {
    throw new Error("Forbidden");
  }

  return next({ context: { session } });
});

export const createProtectedServerFn = (options: { method: "GET" | "POST" }) => 
  createServerFn(options).middleware([authMiddleware]);

export const createAdminServerFn = (options: { method: "GET" | "POST" }) => 
  createServerFn(options).middleware([adminMiddleware]);
