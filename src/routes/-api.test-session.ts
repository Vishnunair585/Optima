import { createAPIFileRoute } from "@tanstack/start/api";
import { db } from "../lib/db";
import { users } from "../lib/db/schema";
import { eq } from "drizzle-orm";
import { createSession, setSessionCookie, deleteSessionCookie } from "../server/auth/session.server";

export const APIRoute = createAPIFileRoute("/api/test-session")({
  POST: async ({ request }) => {
    // Only permit in non-production environments
    if (process.env.NODE_ENV === "production") {
      return new Response(JSON.stringify({ error: "Forbidden in production" }), { status: 403 });
    }

    try {
      const body = await request.json();
      const action = body.action || "create";

      if (action === "destroy") {
        deleteSessionCookie();
        return Response.json({ success: true, message: "Session destroyed" });
      }

      const email = (body.email || "e2e-tester@optima.local").toLowerCase().trim();
      const name = body.name || "E2E Tester";
      const role = body.role || "user";

      // Find or insert test user
      let existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
      let userId: string;

      if (existing.length === 0) {
        userId = crypto.randomUUID();
        await db.insert(users).values({
          id: userId,
          email,
          name,
          password_hash: "e2e_test_hash",
          avatar: null,
          email_verified: true,
          onboarded: true,
          role,
        });
      } else {
        userId = existing[0].id;
        await db.update(users).set({
          email_verified: true,
          onboarded: true,
          role,
          updated_at: new Date(),
        }).where(eq(users.id, userId));
      }

      // Create valid session token in database
      const sessionId = await createSession(userId, {
        ip_address: "127.0.0.1",
        device_info: "Playwright E2E",
      });

      const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      setSessionCookie(sessionId, expiresAt);

      return Response.json({
        success: true,
        sessionId,
        user: {
          id: userId,
          email,
          name,
          role,
          email_verified: true,
          onboarded: true,
        },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message || "Failed to set test session" }), { status: 500 });
    }
  },
});
