import { createServerFn } from "@tanstack/react-start";
import { db } from "../db";
import { changelogReleases, changelogSubscribers } from "../db/schema";
import { eq, desc, and, or, like } from "drizzle-orm";
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

// ─── Public: Get published releases ────────────────────────────

export const getChangelogReleasesFn = createServerFn({ method: "GET" })
  .validator(z.object({
    type: z.string().optional(),
    category: z.string().optional(),
    status: z.enum(["draft", "published", "archived", "all"]).optional(),
    limit: z.number().optional(),
    search: z.string().optional(),
  }).optional())
  .handler(async ({ data: args }) => {
    const session = await getSession();
    const isAdminUser = session ? await checkAdmin(session.user.id) : false;
    
    const statusFilter = args?.status || "published";
    
    let conditions: any[] = [];
    
    if (!isAdminUser) {
      conditions.push(eq(changelogReleases.status, "published"));
    } else if (statusFilter !== "all") {
      conditions.push(eq(changelogReleases.status, statusFilter));
    }
    
    if (args?.type && args.type !== "all") {
      conditions.push(eq(changelogReleases.type, args.type));
    }
    
    if (args?.search) {
      conditions.push(
        or(
          like(changelogReleases.release_name, `%${args.search}%`),
          like(changelogReleases.version, `%${args.search}%`)
        )
      );
    }
    
    let query = db.select().from(changelogReleases);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    const results = await query.orderBy(desc(changelogReleases.release_date)).limit(args?.limit || 50);
    
    if (args?.category && args.category !== "all") {
      return results.filter((r: any) => {
        try {
          const cats = JSON.parse(r.categories);
          return cats.includes(args.category);
        } catch { return false; }
      });
    }
    
    return results;
  });

// ─── Public: Get single release by version ────────────────────

export const getChangelogByVersionFn = createServerFn({ method: "GET" })
  .validator(z.object({ version: z.string() }))
  .handler(async ({ data }) => {
    const release = await db.select().from(changelogReleases).where(eq(changelogReleases.version, data.version)).get();
    if (!release) throw new Error("Release not found");
    
    const session = await getSession();
    const isAdminUser = session ? await checkAdmin(session.user.id) : false;
    
    if (release.status !== "published" && !isAdminUser) {
      throw new Error("Release not found");
    }
    
    return release;
  });

// ─── Admin: Create release ─────────────────────────────────────

export const createChangelogReleaseFn = createServerFn({ method: "POST" })
  .validator(z.object({
    version: z.string().min(1),
    release_name: z.string().min(1),
    release_date: z.string(),
    type: z.string(),
    impact: z.string(),
    status: z.string().optional(),
    overview: z.string().min(1),
    new_features: z.string().optional(),
    improvements: z.string().optional(),
    bug_fixes: z.string().optional(),
    performance_optimizations: z.string().optional(),
    security_enhancements: z.string().optional(),
    breaking_changes: z.string().optional(),
    migration_notes: z.string().optional(),
    deprecated_features: z.string().optional(),
    known_issues: z.string().optional(),
    upcoming_features: z.string().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    seo_title: z.string().optional(),
    meta_description: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    
    const id = generateId();
    const now = Date.now();
    
    await db.insert(changelogReleases).values({
      id,
      version: data.version,
      release_name: data.release_name,
      release_date: new Date(data.release_date) as any,
      type: data.type,
      impact: data.impact,
      author_id: session.user.id,
      status: data.status || "draft",
      overview: data.overview,
      new_features: data.new_features || "",
      improvements: data.improvements || "",
      bug_fixes: data.bug_fixes || "",
      performance_optimizations: data.performance_optimizations || "",
      security_enhancements: data.security_enhancements || "",
      breaking_changes: data.breaking_changes || "",
      migration_notes: data.migration_notes || "",
      deprecated_features: data.deprecated_features || "",
      known_issues: data.known_issues || "",
      upcoming_features: data.upcoming_features || "",
      categories: JSON.stringify(data.categories || []),
      tags: JSON.stringify(data.tags || []),
      seo_title: data.seo_title || data.release_name,
      meta_description: data.meta_description || data.overview.substring(0, 150),
      created_at: now as any,
      updated_at: now as any,
    });
    
    return { success: true, id, version: data.version };
  });

// ─── Admin: Update release ──────────────────────────────────────

export const updateChangelogReleaseFn = createServerFn({ method: "POST" })
  .validator(z.object({
    id: z.string(),
    version: z.string().optional(),
    release_name: z.string().optional(),
    release_date: z.string().optional(),
    type: z.string().optional(),
    impact: z.string().optional(),
    status: z.string().optional(),
    overview: z.string().optional(),
    new_features: z.string().optional(),
    improvements: z.string().optional(),
    bug_fixes: z.string().optional(),
    performance_optimizations: z.string().optional(),
    security_enhancements: z.string().optional(),
    breaking_changes: z.string().optional(),
    migration_notes: z.string().optional(),
    deprecated_features: z.string().optional(),
    known_issues: z.string().optional(),
    upcoming_features: z.string().optional(),
    categories: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    seo_title: z.string().optional(),
    meta_description: z.string().optional(),
  }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) throw new Error("Unauthorized");
    if (!(await checkAdmin(session.user.id))) throw new Error("Unauthorized");
    
    const updateData: any = { updated_at: Date.now() };
    if (data.version) updateData.version = data.version;
    if (data.release_name) updateData.release_name = data.release_name;
    if (data.release_date) updateData.release_date = new Date(data.release_date);
    if (data.type) updateData.type = data.type;
    if (data.impact) updateData.impact = data.impact;
    if (data.status) updateData.status = data.status;
    if (data.overview) updateData.overview = data.overview;
    if (data.new_features !== undefined) updateData.new_features = data.new_features;
    if (data.improvements !== undefined) updateData.improvements = data.improvements;
    if (data.bug_fixes !== undefined) updateData.bug_fixes = data.bug_fixes;
    if (data.breaking_changes !== undefined) updateData.breaking_changes = data.breaking_changes;
    if (data.categories) updateData.categories = JSON.stringify(data.categories);
    if (data.tags) updateData.tags = JSON.stringify(data.tags);
    
    await db.update(changelogReleases).set(updateData).where(eq(changelogReleases.id, data.id));
    
    return { success: true, id: data.id };
  });

// ─── Public: Subscribe to changelog ─────────────────────────────

export const subscribeToChangelogFn = createServerFn({ method: "POST" })
  .validator(z.object({ email: z.string().email() }))
  .handler(async ({ data }) => {
    const session = await getSession();
    
    try {
      await db.insert(changelogSubscribers).values({
        id: generateId(),
        email: data.email,
        user_id: session?.user?.id || null,
        active: true,
        created_at: Date.now() as any,
      });
      return { success: true };
    } catch (err: any) {
      if (err.message?.includes("UNIQUE")) {
        return { success: true };
      }
      throw new Error("Failed to subscribe");
    }
  });
