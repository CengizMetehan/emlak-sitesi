import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.YOUTUBE_API_KEY;
  const channelId = process.env.YOUTUBE_CHANNEL_ID;

  if (!apiKey || !channelId) {
    return NextResponse.json(
      { error: "YouTube API ayarları eksik." },
      { status: 500 },
    );
  }

  try {
    // 1. Kanalın uploads playlist ID'sini bul
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${apiKey}`,
      {
        next: {
          revalidate: 900,
        },
      },
    );

    if (!channelResponse.ok) {
      throw new Error("YouTube kanal bilgisi alınamadı.");
    }

    const channelData = await channelResponse.json();

    const uploadsPlaylistId =
      channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error("Uploads playlist bulunamadı.");
    }

    // 2. Son yüklenen videoyu al
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=1&key=${apiKey}`,
      {
        next: {
          revalidate: 900,
        },
      },
    );

    if (!playlistResponse.ok) {
      throw new Error("Son YouTube videosu alınamadı.");
    }

    const playlistData = await playlistResponse.json();

    const latestItem = playlistData.items?.[0];

    if (!latestItem) {
      return NextResponse.json(
        { error: "Kanala ait video bulunamadı." },
        { status: 404 },
      );
    }

    const snippet = latestItem.snippet;
    const videoId = snippet.resourceId.videoId;

    return NextResponse.json({
      videoId,
      title: snippet.title,
      description: snippet.description,
      publishedAt: snippet.publishedAt,
      thumbnail:
        snippet.thumbnails?.maxres?.url ??
        snippet.thumbnails?.standard?.url ??
        snippet.thumbnails?.high?.url ??
        snippet.thumbnails?.medium?.url ??
        snippet.thumbnails?.default?.url,
      url: `https://www.youtube.com/watch?v=${videoId}`,
    });
  } catch (error) {
    console.error("YouTube latest video error:", error);

    return NextResponse.json(
      { error: "YouTube içeriği alınırken bir hata oluştu." },
      { status: 500 },
    );
  }
}
