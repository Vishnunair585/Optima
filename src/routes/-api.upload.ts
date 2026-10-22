import { createAPIFileRoute } from "@tanstack/start/api";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import {
  ALLOWED_FILE_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  validateFileMagicBytes,
  sanitizeFileName,
} from "../lib/security/validation";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MIN_FILE_SIZE = 1; // Disallow empty files

// Dangerous inner extensions to prevent double-extension bypasses (e.g., payload.php.png)
const DANGEROUS_EXTENSIONS_PATTERN = /\.(php|phtml|php3|php4|php5|phps|cgi|pl|asp|aspx|jsp|sh|bash|exe|bat|cmd|vbs|svg|html|htm|js|jsx|ts|tsx)(\.|$)/i;

// Simulated virus scanner
async function scanFileForViruses(buffer: Buffer): Promise<boolean> {
  // In a real enterprise app, we'd use ClamAV or an API like VirusTotal.
  // We'll simulate a 50ms scan.
  await new Promise((resolve) => setTimeout(resolve, 50));
  return true; // Clean
}

export const APIRoute = createAPIFileRoute("/api/upload")({
  POST: async ({ request }) => {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;

      if (!file || typeof file.size !== "number" || typeof file.name !== "string") {
        return new Response(JSON.stringify({ error: "No file uploaded or invalid file object." }), { status: 400 });
      }

      if (file.size < MIN_FILE_SIZE) {
        return new Response(JSON.stringify({ error: "File is empty." }), { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return new Response(JSON.stringify({ error: "File exceeds 10MB limit." }), { status: 400 });
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type as any)) {
        return new Response(
          JSON.stringify({ error: "Invalid file type. Only PNG, JPEG, WEBP, PDF, and ZIP are allowed." }),
          { status: 400 },
        );
      }

      const sanitizedOriginalName = sanitizeFileName(file.name);
      const ext = path.extname(sanitizedOriginalName).toLowerCase();

      if (!ALLOWED_FILE_EXTENSIONS.includes(ext as any)) {
        return new Response(JSON.stringify({ error: "Invalid file extension." }), { status: 400 });
      }

      // Check for dangerous double extension (e.g., shell.php.png)
      if (DANGEROUS_EXTENSIONS_PATTERN.test(sanitizedOriginalName.slice(0, -ext.length))) {
        return new Response(JSON.stringify({ error: "Disallowed secondary extension detected." }), { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      // Magic byte / File header signature verification
      const isValidMagicBytes = validateFileMagicBytes(buffer, file.type, ext);
      if (!isValidMagicBytes) {
        return new Response(
          JSON.stringify({ error: "File content signature does not match declared type." }),
          { status: 400 },
        );
      }

      // Virus Scan
      const isClean = await scanFileForViruses(buffer);
      if (!isClean) {
        return new Response(JSON.stringify({ error: "Malware detected. Upload rejected." }), { status: 400 });
      }

      // Secure Storage (Local for demo)
      const uploadDir = path.resolve(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const safeFilename = `${crypto.randomUUID()}${ext}`;
      const filePath = path.resolve(uploadDir, safeFilename);

      // Verify no directory traversal occurred
      if (!filePath.startsWith(uploadDir)) {
        return new Response(JSON.stringify({ error: "Invalid upload destination." }), { status: 400 });
      }

      await fs.writeFile(filePath, buffer);

      // Generate "signed URL" (simulated via static hosting path)
      const url = `/uploads/${safeFilename}?signature=${crypto.randomBytes(16).toString("hex")}`;

      return Response.json({
        success: true,
        file_url: url,
        file_type: file.type,
        file_name: sanitizedOriginalName,
      });
    } catch (err: any) {
      console.error("[UPLOAD ERROR]", err);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  },
});
