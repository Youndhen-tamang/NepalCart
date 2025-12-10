import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
export const runtime = "nodejs";

export async function POST(req) {
  try {
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Cloudinary is not configured. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET environment variables.",
        },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("file");

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files uploaded" },
        { status: 400 }
      );
    }

    const uploadSingle = async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "ecommerce" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(buffer);
      });
    };

    const results = await Promise.all(files.map(uploadSingle));

    // If only one file, return `url`, else return `urls`
    const urls = results.map((r) => r.secure_url);
    const response = urls.length === 1 ? { url: urls[0] } : { urls };

    return NextResponse.json({ success: true, ...response });
  } catch (err) {
    console.error("Upload failed:", err);
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Upload failed",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

