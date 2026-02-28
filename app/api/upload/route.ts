import { NextRequest, NextResponse } from "next/server";

const GITHUB_OWNER = "safo-124";
const GITHUB_REPO = "pichess";
const GITHUB_BRANCH = "master";
const UPLOAD_PATH = "public/uploads"; // folder in your repo

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG, AVIF" },
        { status: 400 },
      );
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 5MB" }, { status: 400 });
    }

    // Generate a clean filename
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const safeName = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 40);
    const filename = `${timestamp}-${safeName}.${ext}`;
    const repoPath = `${UPLOAD_PATH}/${filename}`;

    const token = process.env.GITHUB_TOKEN;

    if (token) {
      // ── GitHub upload (works on Vercel + locally) ──
      const bytes = await file.arrayBuffer();
      const base64 = Buffer.from(bytes).toString("base64");

      const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${repoPath}`;

      const ghRes = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload image: ${filename}`,
          content: base64,
          branch: GITHUB_BRANCH,
        }),
      });

      if (!ghRes.ok) {
        const err = await ghRes.json().catch(() => ({}));
        console.error("GitHub API error:", ghRes.status, err);
        return NextResponse.json(
          { error: `GitHub upload failed: ${(err as { message?: string }).message || ghRes.statusText}` },
          { status: 500 },
        );
      }

      // Return the raw GitHub URL for immediate use
      const rawUrl = `https://raw.githubusercontent.com/${GITHUB_OWNER}/${GITHUB_REPO}/${GITHUB_BRANCH}/${repoPath}`;

      return NextResponse.json({
        url: rawUrl,
        filename,
      });
    } else {
      // ── Local filesystem fallback (dev without token) ──
      const { writeFile, mkdir } = await import("fs/promises");
      const { existsSync } = await import("fs");
      const path = await import("path");

      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const filePath = path.join(uploadsDir, filename);
      await writeFile(filePath, buffer);

      return NextResponse.json({
        url: `/uploads/${filename}`,
        filename,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
