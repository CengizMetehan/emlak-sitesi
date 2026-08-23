import { NextResponse } from "next/server";

export async function GET() {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const instagramUserId = process.env.INSTAGRAM_USER_ID;

  if (!accessToken || !instagramUserId) {
    return NextResponse.json(
      {
        error:
          "Instagram API bilgileri eksik. INSTAGRAM_ACCESS_TOKEN ve INSTAGRAM_USER_ID tanımlanmalı.",
      },
      {
        status: 500,
      },
    );
  }

  try {
    const fields = [
      "id",
      "caption",
      "media_type",
      "media_url",
      "permalink",
      "thumbnail_url",
      "timestamp",
    ].join(",");

    const url =
      `https://graph.facebook.com/v23.0/${instagramUserId}/media` +
      `?fields=${encodeURIComponent(fields)}` +
      `&limit=1` +
      `&access_token=${encodeURIComponent(accessToken)}`;

    const response = await fetch(url, {
      next: {
        revalidate: 900,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Instagram Graph API error:", data);

      return NextResponse.json(
        {
          error: data?.error?.message ?? "Instagram içeriği alınamadı.",
        },
        {
          status: response.status,
        },
      );
    }

    const post = data?.data?.[0];

    if (!post) {
      return NextResponse.json({
        post: null,
      });
    }

    return NextResponse.json({
      post: {
        id: post.id,
        caption: post.caption ?? "",
        mediaType: post.media_type ?? "",
        mediaUrl: post.media_url ?? "",
        thumbnailUrl: post.thumbnail_url ?? "",
        permalink: post.permalink ?? "",
        timestamp: post.timestamp ?? "",
      },
    });
  } catch (error) {
    console.error("Instagram latest post error:", error);

    return NextResponse.json(
      {
        error: "Instagram içeriği alınırken bir hata oluştu.",
      },
      {
        status: 500,
      },
    );
  }
}
