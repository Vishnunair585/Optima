import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { legalPolicies, consentLogs } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { z } from "zod";

const generateId = () => crypto.randomUUID();

async function getSession() {
  const { getCurrentSession } = await import("../../server/auth/session.server");
  return getCurrentSession();
}

async function checkAdmin(userId: string): Promise<boolean> {
  const { isAdmin } = await import("../security/authz");
  return isAdmin(userId);
}

// ─── Public: Get Policy ──────────────────────────────────

export const getLegalPolicyFn = createServerFn({ method: "GET" })
  .validator(z.object({ type: z.string() }))
  .handler(async ({ data }) => {
    const policy = await db.select().from(legalPolicies).where(eq(legalPolicies.type, data.type)).get();
    if (!policy || policy.status !== "published") throw new Error("Policy not found");
    return policy;
  });

export const getLegalPoliciesListFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return db.select().from(legalPolicies).where(eq(legalPolicies.status, "published")).orderBy(desc(legalPolicies.effective_date));
  });

// ─── Public: Record Consent ──────────────────────────────

export const recordConsentFn = createServerFn({ method: "POST" })
  .validator(z.object({
    consent_type: z.string(),
    consented: z.boolean(),
  }))
  .handler(async ({ data, request }) => {
    const session = await getSession();
    // Use request headers to get IP and User Agent safely
    const ip_address = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    const user_agent = request.headers.get("user-agent") || "unknown";

    await db.insert(consentLogs).values({
      id: generateId(),
      user_id: session?.user?.id || null,
      ip_address,
      user_agent,
      consent_type: data.consent_type,
      consented: data.consented,
      created_at: Date.now() as any,
    });
    
    return { success: true };
  });

// ─── Admin: Get Policies ─────────────────────────────────

export const getAdminPoliciesFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    
    return db.select().from(legalPolicies).orderBy(desc(legalPolicies.updated_at));
  });

// ─── Admin: Update Policy ────────────────────────────────

export const updateLegalPolicyFn = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string().optional(),
    type: z.string(),
    title: z.string(),
    content: z.string(),
    version: z.string(),
    status: z.enum(["draft", "published", "archived"]),
  }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    
    const now = Date.now();
    
    if (data.id) {
      await db.update(legalPolicies).set({
        title: data.title,
        content: data.content,
        version: data.version,
        status: data.status,
        updated_at: now as any,
      }).where(eq(legalPolicies.id, data.id));
      return { success: true, id: data.id };
    } else {
      const id = generateId();
      await db.insert(legalPolicies).values({
        id,
        type: data.type,
        title: data.title,
        content: data.content,
        version: data.version,
        status: data.status,
        effective_date: now as any,
        created_at: now as any,
        updated_at: now as any,
      });
      return { success: true, id };
    }
  });
