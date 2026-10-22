import { z } from "zod";

const MAX_STRING_LENGTH = 5000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_URL_LENGTH = 2048;

export const sanitizeString = (val: string): string => {
  if (typeof val !== "string") return "";
  return val
    .replace(/\0/g, "") // Strip null bytes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "") // Strip non-printable control chars except \t, \n, \r
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/[<>]/g, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/vbscript\s*:/gi, "")
    .replace(/data\s*:\s*text\/html/gi, "")
    .replace(/on\w+\s*=/gi, "")
    .trim();
};

export const sanitizeFileName = (val: string): string => {
  if (typeof val !== "string") return "file";
  // Strip path traversal and directory separators
  const base = val.split(/[/\\]/).pop() || "file";
  return base
    .replace(/[\0\x00-\x1F\x7F]/g, "")
    .replace(/[<>:"|?*]/g, "")
    .trim()
    .slice(0, 255) || "file";
};

export const isSafeRedirectUrl = (url: unknown): boolean => {
  if (typeof url !== "string") return false;
  const trimmed = url.trim();
  // Must start with a single slash, not double slash or backslash
  if (!trimmed.startsWith("/") || trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
    return false;
  }
  // No protocol or control chars
  return !/[:\r\n\t]/.test(trimmed);
};

export const safeUrlSchema = z.string().max(MAX_URL_LENGTH).refine(
  (val) => {
    if (!val) return true;
    try {
      const parsed = new URL(val);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  },
  { message: "Must be a valid HTTP or HTTPS URL" }
);

export const safeAvatarSchema = z.string().max(200_000).refine(
  (val) => {
    if (!val) return true;
    if (val.startsWith("data:image/")) {
      return /^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/.test(val);
    }
    try {
      const parsed = new URL(val);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  },
  { message: "Avatar must be a valid HTTP(S) URL or base64 image data URI" }
);

const urlOrEmpty = safeUrlSchema.optional().or(z.literal("").optional());

export const sanitizedString = (maxLen: number, minLen = 0) => {
  const createSchema = (min: number, isOptional = false) => {
    const base = min > 0 ? z.string().min(min).max(maxLen) : z.string().max(maxLen);
    const transformed = base.transform((v) => sanitizeString(v));
    const schema = isOptional ? transformed.optional() : transformed;
    return Object.assign(schema, {
      min: (m: number) => createSchema(m, isOptional),
      optional: () => createSchema(min, true),
    });
  };
  return createSchema(minLen, false);
};

export const authSchemas = {
  login: z.object({
    email: z.string().trim().toLowerCase().max(MAX_EMAIL_LENGTH).email(),
    password: z.string().min(8).max(128),
  }),

  signup: z.object({
    name: sanitizedString(MAX_NAME_LENGTH).min(2),
    email: z.string().trim().toLowerCase().max(MAX_EMAIL_LENGTH).email(),
    password: z
      .string()
      .min(8)
      .max(128)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and a number"),
    confirmPassword: z.string(),
  }).refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }),

  passwordReset: z.object({
    email: z.string().trim().toLowerCase().max(MAX_EMAIL_LENGTH).email(),
  }),

  passwordUpdate: z.object({
    token: z.string().min(1).max(1024),
    password: z
      .string()
      .min(8)
      .max(128)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and a number"),
  }),

  verifyEmail: z.object({
    email: z.string().trim().toLowerCase().max(MAX_EMAIL_LENGTH).email(),
    code: z.string().length(6).regex(/^\d{6}$/),
  }),

  resendVerification: z.object({
    email: z.string().trim().toLowerCase().max(MAX_EMAIL_LENGTH).email(),
  }),
};

export const profileSchemas = {
  update: z.object({
    fullName: sanitizedString(MAX_NAME_LENGTH).min(2).optional(),
    username: z
      .string()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, hyphens, underscores")
      .optional(),
    avatarUrl: urlOrEmpty,
    userType: z.enum(["student", "developer", "founder", "designer", "other"]).optional(),
    experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  }),
};

export const stackSchemas = {
  create: z.object({
    name: sanitizedString(100).min(2),
    description: sanitizedString(2000).min(10),
    goal: sanitizedString(500).min(5),
    category: z.string().min(2).max(50),
    difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]),
    isPublic: z.boolean().default(true),
    tools: z
      .array(
        z.object({
          toolId: sanitizedString(100).min(1),
          position: z.number().int().min(0),
          purpose: sanitizedString(500).min(2),
        }),
      )
      .min(1)
      .max(50),
  }),

  update: z.object({
    name: sanitizedString(100).min(2).optional(),
    description: sanitizedString(2000).min(10).optional(),
    goal: sanitizedString(500).min(5).optional(),
    category: z.string().min(2).max(50).optional(),
    difficultyLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
    isPublic: z.boolean().optional(),
  }),
};

export const comparisonSchemas = {
  create: z.object({
    comparisonName: sanitizedString(200).min(2),
    toolIds: z.array(sanitizedString(100).min(1)).min(2).max(10),
  }),
};

export const generalSchemas = {
  email: z.string().max(MAX_EMAIL_LENGTH).email().transform((v) => v.toLowerCase().trim()),
  id: z.string().uuid(),
  pagination: z.object({
    cursor: z.string().max(500).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    direction: z.enum(["before", "after"]).default("after"),
  }),
};

export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const firstError = result.error.errors[0];
    throw new Error(firstError?.message || "Validation failed");
  }
  return result.data;
}

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.errors.map((e) => e.message).join("; ") };
  }
  return { success: true, data: result.data };
}

export const sqlInjectionPattern =
  /['";\\]|(--)|(\/\*)|(\*\/)|(\b(UNION(\s+ALL)?\s+SELECT|DROP\s+TABLE|DELETE\s+FROM|INSERT\s+INTO|UPDATE\s+.*SET|EXEC(\s+XP_)?|OR\s+['"\d\w]+\s*=\s*['"\d\w]+)\b)/i;

export function detectSqlInjection(input: string): boolean {
  if (typeof input !== "string") return false;
  return sqlInjectionPattern.test(input);
}

export function assertNoSqlInjection(input: string): void {
  if (detectSqlInjection(input)) {
    throw new Error("Potential SQL injection detected");
  }
}

export const commandInjectionPattern =
  /[;&|`$><\r\n]|(\b(exec|spawn|sh|bash|cmd|powershell|curl|wget|nc|chmod|cat|rm|kill)\b)/i;

export function detectCommandInjection(input: string): boolean {
  if (typeof input !== "string") return false;
  return commandInjectionPattern.test(input);
}

export function assertNoCommandInjection(input: string): void {
  if (detectCommandInjection(input)) {
    throw new Error("Potential command injection detected");
  }
}

export function escapeLikeString(input: string): string {
  if (typeof input !== "string") return "";
  // Escape backslash first, then % and _
  return input.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

export function sanitizeFtsQuery(query: string): string {
  if (typeof query !== "string") return "";
  // Extract alphanumeric search tokens (Unicode-aware)
  const tokens = query.match(/[\p{L}\p{N}_-]+/gu) || [];
  if (tokens.length === 0) return "";
  // Wrap each token in double quotes to prevent FTS5 syntax / operator injection (NOT, AND, OR, :, *, etc.)
  return tokens.map((t) => `"${t.replace(/"/g, '""')}"`).join(" ");
}

export const ALLOWED_FILE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".pdf", ".zip"] as const;
export const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "application/zip",
] as const;

export function validateFileMagicBytes(buffer: Buffer, mimeType: string, extension: string): boolean {
  if (!buffer || buffer.length < 4) return false;

  const ext = extension.toLowerCase();
  const mime = mimeType.toLowerCase();

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (ext === ".png" || mime === "image/png") {
    return (
      buffer.length >= 8 &&
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  // JPEG: FF D8 FF
  if (ext === ".jpg" || ext === ".jpeg" || mime === "image/jpeg") {
    return (
      buffer.length >= 3 &&
      buffer[0] === 0xff &&
      buffer[1] === 0xd8 &&
      buffer[2] === 0xff
    );
  }

  // WEBP: RIFF .... WEBP
  if (ext === ".webp" || mime === "image/webp") {
    return (
      buffer.length >= 12 &&
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    );
  }

  // PDF: %PDF- (25 50 44 46 2D)
  if (ext === ".pdf" || mime === "application/pdf") {
    return (
      buffer.length >= 5 &&
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46 &&
      buffer[4] === 0x2d
    );
  }

  // ZIP: 50 4B 03 04 or 50 4B 05 06 or 50 4B 07 08
  if (ext === ".zip" || mime === "application/zip") {
    return (
      buffer.length >= 4 &&
      buffer[0] === 0x50 &&
      buffer[1] === 0x4b &&
      (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07)
    );
  }

  return false;
}
