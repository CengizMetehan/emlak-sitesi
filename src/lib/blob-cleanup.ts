import { del } from "@vercel/blob";

const VERCEL_BLOB_HOST = ".blob.vercel-storage.com";

function isVercelBlobUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    return (
      parsedUrl.protocol === "https:" &&
      parsedUrl.hostname.endsWith(VERCEL_BLOB_HOST)
    );
  } catch {
    return false;
  }
}

export async function deleteUnusedBlobImages(
  oldImageUrls: string[],
  newImageUrls: string[],
) {
  const newImages = new Set(newImageUrls);

  const unusedImages = oldImageUrls.filter(
    (url) => isVercelBlobUrl(url) && !newImages.has(url),
  );

  if (unusedImages.length === 0) {
    return {
      deleted: 0,
    };
  }

  await del(unusedImages);

  return {
    deleted: unusedImages.length,
  };
}
