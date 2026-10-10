import { NextResponse } from "next/server";
import { getProperties } from "@/lib/properties-db";

export const runtime = "nodejs";

type SahibindenListing = {
  "İlan no"?: string;
  Başlık?: string;
  Açıklama?: string;
  Kategoriler?: string;
  Fiyat?: string;
  Adres?: string;
  Konum?: string;
  Özellikler?: Record<string, string | null>;
  "Aktif Görsel Listesi"?: string[];
  "Video Listesi"?: string[];
};

type ChangeDetail = {
  field: string;
  oldValue: string;
  newValue: string;
};

type ComparisonItem = {
  id: string;
  title: string;
  status: "new" | "updated" | "unchanged" | "missing";
  changes: ChangeDetail[];
};

function normalizeText(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizeHtml(value: unknown) {
  return String(value ?? "")
    .trim()
    .replace(/\r/g, "")
    .replace(/\s+/g, " ");
}

function parsePrice(value: unknown) {
  const cleaned = String(value ?? "").replace(/[^\d]/g, "");

  if (!cleaned) {
    return undefined;
  }

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : undefined;
}

function parseNumber(value: unknown) {
  const cleaned = String(value ?? "")
    .replace(/\./g, "")
    .replace(",", ".")
    .replace(/[^\d.-]/g, "");

  if (!cleaned) {
    return undefined;
  }

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : undefined;
}

function getBaseName(path: string) {
  return path.replace(/\\/g, "/").split("/").pop()?.trim() ?? "";
}

function normalizeImageList(images: unknown) {
  if (!Array.isArray(images)) {
    return [];
  }

  return images.map((image) => getBaseName(String(image))).filter(Boolean);
}

function normalizeVideoList(videos: unknown) {
  if (!Array.isArray(videos)) {
    return [];
  }

  return videos.map((video) => normalizeText(video)).filter(Boolean);
}

function normalizeFeatures(features: unknown) {
  if (!features || typeof features !== "object" || Array.isArray(features)) {
    return {};
  }

  const entries = Object.entries(features as Record<string, unknown>)
    .map(([key, value]) => [
      normalizeText(key),
      value === null ? null : normalizeText(value),
    ])
    .sort(([a], [b]) => String(a).localeCompare(String(b), "tr"));

  return Object.fromEntries(entries);
}

function areArraysEqual(first: string[], second: string[]) {
  if (first.length !== second.length) {
    return false;
  }

  return first.every((item, index) => item === second[index]);
}

function areObjectsEqual(first: unknown, second: unknown) {
  return JSON.stringify(first) === JSON.stringify(second);
}

function getCategory(categories: string | undefined) {
  const values = String(categories ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (values.includes("Kiralık")) {
    return "Kiralık";
  }

  if (values.includes("Satılık")) {
    return "Satılık";
  }

  return "";
}

function getPropertyType(categories: string | undefined) {
  const values = String(categories ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (values.includes("Daire")) {
    return "Daire";
  }

  if (values.includes("Villa")) {
    return "Villa";
  }

  if (values.includes("Arsa")) {
    return "Arsa";
  }

  return "Ticari";
}

function addChange(
  changes: ChangeDetail[],
  field: string,
  oldValue: unknown,
  newValue: unknown,
) {
  changes.push({
    field,
    oldValue:
      oldValue === undefined || oldValue === null || oldValue === ""
        ? "-"
        : String(oldValue),

    newValue:
      newValue === undefined || newValue === null || newValue === ""
        ? "-"
        : String(newValue),
  });
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as {
      fileName?: unknown;
      fileSize?: unknown;
      totalFiles?: unknown;
      jsonFileCount?: unknown;
      imageFileNames?: unknown;
      ilanBilgileriFile?: unknown;
      listings?: unknown;
    };

    if (typeof payload.fileName !== "string" || !payload.fileName.toLowerCase().endsWith(".zip")) {
      return NextResponse.json(
        {
          error: "Geçerli bir ZIP dosyası seçin.",
        },
        {
          status: 400,
        },
      );
    }

    if (!Array.isArray(payload.listings)) {
      return NextResponse.json(
        {
          error: 'ZIP içerisinde geçerli bir "İlan Listesi" bulunamadı.',
        },
        {
          status: 400,
        },
      );
    }

    if (typeof payload.ilanBilgileriFile !== "string") {
      return NextResponse.json(
        {
          error: "İlan bilgileri JSON dosyası bulunamadı.",
        },
        {
          status: 400,
        },
      );
    }

    const sahibindenListings = payload.listings as SahibindenListing[];
    const imageFiles = Array.isArray(payload.imageFileNames)
      ? payload.imageFileNames.filter((name): name is string => typeof name === "string")
      : [];
    const totalFiles = Number.isFinite(payload.totalFiles) ? Number(payload.totalFiles) : 0;
    const jsonFileCount = Number.isFinite(payload.jsonFileCount) ? Number(payload.jsonFileCount) : 0;
    const fileSize = Number.isFinite(payload.fileSize) ? Number(payload.fileSize) : 0;

    /*
     * MEVCUT İLANLARI NEON'DAN AL
     */
    const existingProperties = await getProperties();

    /*
     * Mevcut site portföylerini
     * sahibindenId üzerinden indeksliyoruz.
     */
    const existingMap = new Map(
      existingProperties.map((property) => [property.sahibindenId, property]),
    );
    const zipIds = new Set<string>();

    const comparison: ComparisonItem[] = [];

    /*
     * ZIP'teki ilanları mevcut
     * portföylerle karşılaştır.
     */
    for (const listing of sahibindenListings) {
      const id = normalizeText(listing["İlan no"]);

      if (!id) {
        continue;
      }

      zipIds.add(id);

      const existing = existingMap.get(id);

      /*
       * Sitede hiç yoksa:
       * YENİ İLAN
       */
      if (!existing) {
        comparison.push({
          id,
          title: normalizeText(listing.Başlık) || "Başlıksız ilan",

          status: "new",

          changes: [],
        });

        continue;
      }

      const changes: ChangeDetail[] = [];

      /*
       * BAŞLIK
       */
      const newTitle = normalizeText(listing.Başlık);

      const oldTitle = normalizeText(existing.title);

      if (oldTitle !== newTitle) {
        addChange(changes, "Başlık", existing.title, listing.Başlık);
      }

      /*
       * FİYAT
       */
      const newPrice = parsePrice(listing.Fiyat);

      const oldPrice = existing.price;

      if (oldPrice !== newPrice) {
        addChange(changes, "Fiyat", existing.priceText, listing.Fiyat);
      }

      /*
       * AÇIKLAMA
       */
      const newDescription = normalizeHtml(listing.Açıklama);

      const oldDescription = normalizeHtml(existing.description);

      if (oldDescription !== newDescription) {
        addChange(changes, "Açıklama", "Mevcut açıklama", "Yeni açıklama");
      }

      /*
       * KATEGORİ
       */
      const newCategory = getCategory(listing.Kategoriler);

      if (newCategory && normalizeText(existing.category) !== newCategory) {
        addChange(changes, "Kategori", existing.category, newCategory);
      }

      /*
       * GAYRİMENKUL TİPİ
       */
      const newPropertyType = getPropertyType(listing.Kategoriler);

      if (
        newPropertyType &&
        normalizeText(existing.propertyType) !== newPropertyType
      ) {
        addChange(
          changes,
          "Gayrimenkul Tipi",
          existing.propertyType,
          newPropertyType,
        );
      }

      /*
       * ODA SAYISI
       */
      const newRooms = normalizeText(listing.Özellikler?.["Oda Sayısı"]);

      if (normalizeText(existing.rooms) !== newRooms) {
        addChange(changes, "Oda Sayısı", existing.rooms, newRooms);
      }

      /*
       * BRÜT ALAN
       */
      const newGrossArea = parseNumber(listing.Özellikler?.["m² (Brüt)"]);

      if (existing.grossArea !== newGrossArea) {
        addChange(changes, "Brüt Alan", existing.grossArea, newGrossArea);
      }

      /*
       * NET ALAN
       */
      const newNetArea = parseNumber(listing.Özellikler?.["m² (Net)"]);

      if (existing.netArea !== newNetArea) {
        addChange(changes, "Net Alan", existing.netArea, newNetArea);
      }

      /*
       * TÜM ÖZELLİKLER
       */
      const oldFeatures = normalizeFeatures(existing.features);

      const newFeatures = normalizeFeatures(listing.Özellikler);

      if (!areObjectsEqual(oldFeatures, newFeatures)) {
        addChange(
          changes,
          "Detaylı Özellikler",
          "Mevcut özellikler",
          "Güncel özellikler",
        );
      }

      /*
       * GÖRSELLER
       *
       * Mevcut property.images:
       * /sahibinden/xxx.jpg
       *
       * ZIP:
       * xxx.jpg
       *
       * Bu yüzden yalnızca dosya
       * isimlerini karşılaştırıyoruz.
       */
      /*
       * GÖRSELLER
       *
       * ZIP içerisinde fiziksel görsel dosyası varsa
       * mevcut görsellerle karşılaştırıyoruz.
       *
       * ZIP içerisinde hiç medya yoksa mevcut
       * Neon / Blob görsellerini değişiklik olarak
       * değerlendirmiyoruz.
       */
      if (imageFiles.length > 0) {
        const oldImages = normalizeImageList(existing.images);

        const zipImageNameSet = new Set(
          imageFiles.map((imagePath) => getBaseName(imagePath)).filter(Boolean),
        );

        const newImages = normalizeImageList(
          listing["Aktif Görsel Listesi"],
        ).filter((imageName) => zipImageNameSet.has(imageName));

        if (!areArraysEqual(oldImages, newImages)) {
          addChange(
            changes,
            "Görseller",
            `${oldImages.length} görsel`,
            `${newImages.length} görsel`,
          );
        }
      }

      /*
       * VİDEOLAR
       */
      const oldVideos = normalizeVideoList(existing.videos);

      const newVideos = normalizeVideoList(listing["Video Listesi"]);

      if (!areArraysEqual(oldVideos, newVideos)) {
        addChange(
          changes,
          "Videolar",
          `${oldVideos.length} video`,
          `${newVideos.length} video`,
        );
      }

      comparison.push({
        id,

        title: newTitle || oldTitle || "Başlıksız ilan",

        status: changes.length > 0 ? "updated" : "unchanged",

        changes,
      });
    }

    /*
     * Mevcut sitede bulunan fakat
     * yeni ZIP içerisinde bulunmayan
     * ilanlar.
     *
     * BUNLARI SİLMİYORUZ.
     * Sadece "missing" olarak
     * raporluyoruz.
     */
    for (const property of existingProperties) {
      const id = property.sahibindenId;

      if (id && !zipIds.has(id)) {
        comparison.push({
          id,

          title: property.title,

          status: "missing",

          changes: [],
        });
      }
    }

    /*
     * SAYILAR
     */
    const newCount = comparison.filter((item) => item.status === "new").length;

    const updatedCount = comparison.filter(
      (item) => item.status === "updated",
    ).length;

    const unchangedCount = comparison.filter(
      (item) => item.status === "unchanged",
    ).length;

    const missingCount = comparison.filter(
      (item) => item.status === "missing",
    ).length;

    /*
     * Medya yapısı
     *
     * Bu ZIP'te ayrı medya JSON'u
     * bulunmuyor.
     *
     * Görseller
     * MedyaBilgileri klasörünün
     * altında bulunduğu için,
     * gerçek görseller varsa
     * medya mevcut kabul ediyoruz.
     */
    const mediaAvailable = imageFiles.length > 0;

    return NextResponse.json({
      success: true,

      fileName: payload.fileName,

      fileSize,

      totalFiles,

      jsonFileCount,

      imageFileCount: imageFiles.length,

      listingCount: sahibindenListings.length,

      ilanBilgileriFound: true,

      medyaBilgileriFound: mediaAvailable,

      ilanBilgileriFile: payload.ilanBilgileriFile,

      /*
       * KARŞILAŞTIRMA ÖZETİ
       */
      comparisonSummary: {
        newCount,
        updatedCount,
        unchangedCount,
        missingCount,
      },

      /*
       * İLAN BAZINDA DETAY
       */
      comparison,
    });
  } catch (error) {
    console.error("Sahibinden ZIP analyze error:", error);

    return NextResponse.json(
      {
        error: "ZIP dosyası analiz edilirken bir hata oluştu.",
      },
      {
        status: 500,
      },
    );
  }
}
