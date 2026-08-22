import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,

      onBeforeGenerateToken: async (pathname) => {
        // Sadece Sahibinden görsellerine izin ver
        if (!pathname.startsWith("sahibinden/")) {
          throw new Error("Geçersiz yükleme yolu.");
        }

        return {
          allowedContentTypes: [
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif",
          ],

          // Sahibinden dosya adlarını değiştirmiyoruz
          addRandomSuffix: false,

          // Aynı görsel daha önce yüklenmişse güncellenmesine izin ver
          allowOverwrite: true,
        };
      },

      onUploadCompleted: async ({ blob }) => {
        console.log("Blob upload tamamlandı:", blob.pathname);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Blob upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Blob yükleme yetkisi oluşturulamadı.",
      },
      {
        status: 400,
      },
    );
  }
}
