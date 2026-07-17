import { createAPIFileRoute } from "@tanstack/start/api";
import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "application/pdf",
  "application/zip",
];
const ALLOWED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".pdf", ".zip"];

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

      if (!file) {
        return new Response(JSON.stringify({ error: "No file uploaded" }), { status: 400 });
      }

      if (file.size > MAX_FILE_SIZE) {
        return new Response(JSON.stringify({ error: "File exceeds 10MB limit" }), { status: 400 });
      }

      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return new Response(JSON.stringify({ error: "Invalid file type. Only PNG, JPEG, WEBP, PDF, and ZIP are allowed." }), { status: 400 });
      }

      const ext = path.extname(file.name).toLowerCase();
      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return new Response(JSON.stringify({ error: "Invalid file extension." }), { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      // Virus Scan
      const isClean = await scanFileForViruses(buffer);
      if (!isClean) {
        return new Response(JSON.stringify({ error: "Malware detected. Upload rejected." }), { status: 400 });
      }

      // Secure Storage (Local for demo)
      const uploadDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const safeFilename = `${crypto.randomUUID()}${ext}`;
      const filePath = path.join(uploadDir, safeFilename);

      await fs.writeFile(filePath, buffer);

      // Generate "signed URL" (simulated via static hosting path)
      const url = `/uploads/${safeFilename}?signature=${crypto.randomBytes(16).toString("hex")}`;

      return Response.json({
        success: true,
        file_url: url,
        file_type: file.type,
        file_name: file.name
      });
    } catch (err: any) {
      console.error("[UPLOAD ERROR]", err);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
  },
});
