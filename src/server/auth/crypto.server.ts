import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

/**
 * OWASP Recommended Argon2id parameters:
 * type: argon2id
 * memoryCost: 19456 KiB (19 MiB)
 * timeCost: 2 iterations
 * parallelism: 1 lane
 */
export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    return false;
  }
}

export function generateId(): string {
  return uuidv4();
}

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generateSecureToken(byteLength = 32): string {
  return crypto.randomBytes(byteLength).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
