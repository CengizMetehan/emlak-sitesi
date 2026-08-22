import { list } from "@vercel/blob";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await list({
      prefix: "sahibinden/",
      limit: 1000,
    });

    const blobs = result.blobs.map((blob) => ({
      pathname: blob.pathname,
      url: blob.url,
      size: blob.size,
    }));

    return NextResponse.json({
      success: true,
      blobs,
    });
  } catch (error) {
    console.error("Blob list error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Blob dosyaları listelenemedi.",
      },
      {
        status: 500,
      },
    );
  }
}
