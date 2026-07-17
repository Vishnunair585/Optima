import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "../db";
import { users, userProfiles, userPreferences } from "../db/schema";
import { eq } from "drizzle-orm";
const generateId = () => crypto.randomUUID();

async function getSession() {
  const { getCurrentSession } = await import("../../server/auth/session.server");
  return getCurrentSession();
}

async function rateLimit(key: string, limit: number, windowMs: number) {
  const { checkRateLimit } = await import("../../server/auth/rate-limit.server");
  return checkRateLimit(key, limit, windowMs);
}
import { getRequestHeader } from "@tanstack/react-start/server";

export const completeOnboardingFn = createServerFn({ method: "POST" })
  .validator(z.object({
    fullName: z.string().min(2),
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
    avatarUrl: z.string().optional(),
    userType: z.string(),
    experienceLevel: z.string(),
    goals: z.array(z.string()),
    favoriteTools: z.array(z.string()),
    categories: z.array(z.string()),
  }).strict())
  .handler(async ({ data }) => {
    const authData = await getSession();
    if (!authData) {
      throw new Error("Unauthorized");
    }

    if (!await rateLimit(`onboarding:${authData.user.id}`, 3, 1000 * 60 * 60)) {
      throw new Error("Too many onboarding attempts. Please try again later.");
    }
    
    if (authData.user.onboarded) {
      throw new Error("User is already onboarded.");
    }

    const userId = authData.user.id;

    // Check if username is already taken
    const existing = await db.select().from(userProfiles).where(eq(userProfiles.username, data.username));
    if (existing.length > 0) {
      throw new Error("Username is already taken.");
    }

    // Create user profile
    await db.insert(userProfiles).values({
      id: generateId(),
      user_id: userId,
      full_name: data.fullName,
      username: data.username,
      avatar_url: data.avatarUrl || null,
      user_type: data.userType,
      experience_level: data.experienceLevel,
    });

    // Create user preferences
    await db.insert(userPreferences).values({
      id: generateId(),
      user_id: userId,
      goals: JSON.stringify(data.goals),
      favorite_tools: JSON.stringify(data.favoriteTools),
      categories: JSON.stringify(data.categories),
    });

    // Update user's name, avatar, and onboarded status
    await db.update(users).set({
      name: data.fullName,
      avatar: data.avatarUrl || null,
      onboarded: true,
    }).where(eq(users.id, userId));

    const { qualifyReferral, ensureUserReferralCode } = await import("./referral.functions");
    await ensureUserReferralCode(userId);
    await qualifyReferral(userId);

    return { success: true };
  });

export const checkUsernameFn = createServerFn({ method: "GET" })
  .validator(z.object({ username: z.string() }).strict())
  .handler(async ({ data }) => {
    const ip = getRequestHeader("x-forwarded-for") || "unknown";
    if (!await rateLimit(`check-username:${ip}`, 20, 1000 * 60)) {
      return { available: false, error: "Too many requests" };
    }

    if (!data.username || data.username.length < 3) {
      return { available: false };
    }
    const existing = await db.select().from(userProfiles).where(eq(userProfiles.username, data.username));
    return { available: existing.length === 0 };
  });

export const getOnboardingStatusFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const authData = await getSession();
    if (!authData) return { onboarded: false };
    return { onboarded: authData.user.onboarded };
  });

export const getUserProfileFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const authData = await getSession();
    if (!authData) return null;

    const profiles = await db.select().from(userProfiles).where(eq(userProfiles.user_id, authData.user.id));
    const prefs = await db.select().from(userPreferences).where(eq(userPreferences.user_id, authData.user.id));

    if (profiles.length === 0) return null;

    return {
      profile: profiles[0],
      preferences: prefs.length > 0 ? {
        ...prefs[0],
        goals: JSON.parse(prefs[0].goals) as string[],
        favorite_tools: JSON.parse(prefs[0].favorite_tools) as string[],
        categories: JSON.parse(prefs[0].categories) as string[],
      } : null,
    };
  });
