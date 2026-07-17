import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { statusServices, statusIncidents, statusSubscribers } from "../db/schema";
import { eq, desc, and, asc } from "drizzle-orm";
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

// ─── Public: Get all services status ────────────────────

export const getStatusServicesFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return db.select().from(statusServices).orderBy(asc(statusServices.sort_order));
  });

// ─── Public: Get recent incidents ───────────────────────

export const getStatusIncidentsFn = createServerFn({ method: "GET" })
  .validator(z.object({ limit: z.number().optional(), status: z.string().optional() }).optional())
  .handler(async ({ data: args }) => {
    let conditions: any[] = [];
    if (args?.status && args.status !== "all") conditions.push(eq(statusIncidents.status, args.status));
    let query = db.select().from(statusIncidents);
    if (conditions.length > 0) query = query.where(and(...conditions)) as any;
    return query.orderBy(desc(statusIncidents.started_at)).limit(args?.limit || 20);
  });

// ─── Public: Get overall status ──────────────────────────

export const getOverallStatusFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const services = await db.select().from(statusServices).orderBy(asc(statusServices.sort_order));
    const activeIncidents = await db.select().from(statusIncidents)
      .where(and(
        eq(statusIncidents.status, "investigating"),
      )).limit(10);
    
    const hasOutage = services.some(s => s.status === "major_outage");
    const hasPartial = services.some(s => s.status === "partial_outage");
    const hasPerf = services.some(s => s.status === "performance_issues");
    const hasMaint = services.some(s => s.status === "maintenance");
    
    let overall = "operational";
    if (hasOutage) overall = "major_outage";
    else if (hasPartial) overall = "partial_outage";
    else if (hasPerf) overall = "performance_issues";
    else if (hasMaint) overall = "maintenance";
    
    return { overall, services, activeIncidents };
  });

// ─── Public: Subscribe to status updates ─────────────────

export const subscribeStatusFn = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const session = await getSession();
    try {
      await db.insert(statusSubscribers).values({
        id: generateId(), email: data.email,
        user_id: session?.user?.id || null, active: true,
        created_at: Date.now() as any,
      });
      return { success: true };
    } catch (err: any) {
      if (err.message?.includes("UNIQUE")) return { success: true };
      throw new Error("Subscription failed");
    }
  });

// ─── Admin: Update service status ────────────────────────

export const updateServiceStatusFn = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string(),
    status: z.enum(["operational", "performance_issues", "partial_outage", "major_outage", "maintenance"]),
  }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    await db.update(statusServices).set({ status: data.status, updated_at: Date.now() as any }).where(eq(statusServices.id, data.id));
    return { success: true };
  });

// ─── Admin: Create incident ─────────────────────────────

export const createIncidentFn = createServerFn({ method: "POST" })
  .validator(z.object({
    title: z.string().min(1), description: z.string().min(1),
    severity: z.enum(["minor", "major", "critical"]),
    affected_services: z.array(z.string()).optional(),
  }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    const id = generateId();
    const now = Date.now();
    await db.insert(statusIncidents).values({
      id, title: data.title, description: data.description,
      severity: data.severity, status: "investigating",
      affected_services: JSON.stringify(data.affected_services || []),
      timeline: JSON.stringify([{ time: now, status: "investigating", message: data.description }]),
      started_at: now as any, created_at: now as any, updated_at: now as any,
    });
    return { success: true, id };
  });

// ─── Admin: Update incident ─────────────────────────────

export const updateIncidentFn = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string(),
    status: z.enum(["investigating", "identified", "monitoring", "resolved"]),
    message: z.string().min(1),
  }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    const incident = await db.select().from(statusIncidents).where(eq(statusIncidents.id, data.id)).get();
    if (!incident) throw new Error("Incident not found");
    const timeline = JSON.parse(incident.timeline);
    timeline.push({ time: Date.now(), status: data.status, message: data.message });
    const updateData: any = { status: data.status, timeline: JSON.stringify(timeline), updated_at: Date.now() };
    if (data.status === "resolved") updateData.resolved_at = Date.now();
    await db.update(statusIncidents).set(updateData).where(eq(statusIncidents.id, data.id));
    return { success: true };
  });
