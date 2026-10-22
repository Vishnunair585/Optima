import { createMiddleware, createServerFn } from "@tanstack/react-start";
import { getSessionFn } from "./auth.functions";

export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSessionFn();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return next({ context: { session, userId, user: session.user } });
});

export const adminMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await getSessionFn();
  const userId = session?.user?.id;
  if (!userId) {
    throw new Error("Unauthorized");
  }
  
  const { isAdmin } = await import("../security/authz");
  const hasAdmin = session.user?.role === "Admin" || (await isAdmin(userId));
  if (!hasAdmin) {
    throw new Error("Forbidden: Admin privileges required.");
  }

  return next({ context: { session, userId, user: session.user } });
});

export const createProtectedServerFn = (options: { method: "GET" | "POST" }) => 
  createServerFn(options).middleware([authMiddleware]);

export const createAdminServerFn = (options: { method: "GET" | "POST" }) => 
  createServerFn(options).middleware([adminMiddleware]);
