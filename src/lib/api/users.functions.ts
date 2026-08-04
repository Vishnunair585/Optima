import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";


export const syncUserFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      uid: z.string(),
      email: z.string().email(),
      name: z.string(),
      avatar: z.string().optional().nullable(),
    })
  )
  .handler(async ({ data }) => {
    const { adminDb } = await import("../firebase-admin");
    if (!adminDb) {
      throw new Error("Firebase Admin not initialized.");
    }

    const userRef = adminDb.collection("users").doc(data.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      // Check if this is the very first user in the collection
      const allUsers = await adminDb.collection("users").limit(1).get();
      const isFirstUser = allUsers.empty;
      
      const role = isFirstUser ? "super_admin" : "user";

      await userRef.set({
        id: data.uid,
        email: data.email,
        name: data.name,
        avatar: data.avatar || null,
        role: role,
        onboarded: false,
        created_at: Date.now(),
        updated_at: Date.now(),
      });

      return { success: true, role, isNew: true, onboarded: false };
    } else {
      // User exists, just update name/avatar if they changed, or update last login
      const existingData = userDoc.data();
      await userRef.update({
        updated_at: Date.now(),
      });
      return { success: true, role: existingData?.role || "user", isNew: false, onboarded: existingData?.onboarded || false };
    }
  });
