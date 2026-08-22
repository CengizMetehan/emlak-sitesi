import { NextResponse } from "next/server";
import pg from "pg";
import { deleteUnusedBlobImages } from "@/lib/blob-cleanup";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

type IncomingProperty = {
  id: string;
  sahibindenId: string;
  title: string;
  category: "Satılık" | "Kiralık";
  propertyType: "Daire" | "Villa" | "Arsa" | "Ticari";
  city: string;
  district: string;
  neighborhood: string;
  price?: number;
  priceText: string;
  rooms?: string;
  grossArea?: number;
  netArea?: number;
  image?: string;
  images?: string[];
  imageSetComplete?: boolean;
  videos: string[];
  description: string;
  features: Record<string, string | null>;
  latitude?: number;
  longitude?: number;
  featured: boolean;
};

type ExistingPropertyRow = {
  sahibinden_id: string;
  image: string | null;
  images: unknown;
};

type PropertyImagesRow = {
  image: string | null;
  images: unknown;
};

function getImageArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const properties = body?.properties as IncomingProperty[] | undefined;

    if (!Array.isArray(properties) || properties.length === 0) {
      return NextResponse.json(
        {
          error: "İçe aktarılacak portföy bulunamadı.",
        },
        {
          status: 400,
        },
      );
    }

    const client = await pool.connect();

    let inserted = 0;
    let updated = 0;

    /*
     * Importtan önce kullanılan eski Blob görsellerini burada tutuyoruz.
     * Bunlar veritabanı başarıyla güncellendikten sonra kontrol edilecek.
     */
    const oldImageCandidates = new Set<string>();

    try {
      await client.query("BEGIN");

      for (const property of properties) {
        /*
         * MEVCUT İLANI BUL
         *
         * Burada eski görselleri de alıyoruz.
         */
        const existing = await client.query<ExistingPropertyRow>(
          `
            SELECT
              sahibinden_id,
              image,
              images
            FROM properties
            WHERE sahibinden_id = $1
            LIMIT 1
          `,
          [property.sahibindenId],
        );

        const alreadyExists = existing.rowCount === 1;

        const existingProperty = alreadyExists ? existing.rows[0] : undefined;

        if (existingProperty) {
          if (existingProperty.image) {
            oldImageCandidates.add(existingProperty.image);
          }

          const existingImages = getImageArray(existingProperty.images);

          for (const imageUrl of existingImages) {
            oldImageCandidates.add(imageUrl);
          }
        }

        /*
         * GÖRSEL DEĞERLERİNİ GÜVENLİ ŞEKİLDE HAZIRLA
         *
         * ZIP'te görsel varsa:
         *   yeni görseller kullanılır.
         *
         * ZIP'te görsel yoksa ve ilan zaten varsa:
         *   mevcut Neon görselleri korunur.
         *
         * ZIP'te görsel yoksa ve ilan yeniyse:
         *   görselsiz ilan oluşturulur.
         */
        const preserveExistingImages =
          alreadyExists && property.imageSetComplete === false;

        const resolvedImage = preserveExistingImages
          ? (existingProperty?.image ?? "")
          : property.image !== undefined
            ? property.image
            : (existingProperty?.image ?? "");

        const resolvedImages = preserveExistingImages
          ? getImageArray(existingProperty?.images)
          : property.images !== undefined
            ? property.images
            : existingProperty
              ? getImageArray(existingProperty.images)
              : [];

        /*
         * NEON'A EKLE / GÜNCELLE
         *
         * DİKKAT:
         * featured UPDATE bölümünde özellikle bulunmuyor.
         * Böylece mevcut featured değeri Sahibinden importuyla ezilmiyor.
         */
        const queryResult = await client.query(
          `
            INSERT INTO properties (
              id,
              sahibinden_id,
              title,
              category,
              property_type,
              city,
              district,
              neighborhood,
              price,
              price_text,
              rooms,
              gross_area,
              net_area,
              image,
              images,
              videos,
              description,
              features,
              latitude,
              longitude,
              featured,
              updated_at
            )
            VALUES (
              $1, $2, $3, $4, $5,
              $6, $7, $8, $9, $10,
              $11, $12, $13, $14, $15::jsonb,
              $16::jsonb, $17, $18::jsonb,
              $19, $20, $21, NOW()
            )
            ON CONFLICT (sahibinden_id)
            DO UPDATE SET
              id = EXCLUDED.id,
              title = EXCLUDED.title,
              category = EXCLUDED.category,
              property_type = EXCLUDED.property_type,
              city = EXCLUDED.city,
              district = EXCLUDED.district,
              neighborhood = EXCLUDED.neighborhood,
              price = EXCLUDED.price,
              price_text = EXCLUDED.price_text,
              rooms = EXCLUDED.rooms,
              gross_area = EXCLUDED.gross_area,
              net_area = EXCLUDED.net_area,
              image = EXCLUDED.image,
              images = EXCLUDED.images,
              videos = EXCLUDED.videos,
              description = EXCLUDED.description,
              features = EXCLUDED.features,
              latitude = EXCLUDED.latitude,
longitude = EXCLUDED.longitude,
updated_at = NOW()

WHERE
  properties.id IS DISTINCT FROM EXCLUDED.id
  OR properties.title IS DISTINCT FROM EXCLUDED.title
  OR properties.category IS DISTINCT FROM EXCLUDED.category
  OR properties.property_type IS DISTINCT FROM EXCLUDED.property_type
  OR properties.city IS DISTINCT FROM EXCLUDED.city
  OR properties.district IS DISTINCT FROM EXCLUDED.district
  OR properties.neighborhood IS DISTINCT FROM EXCLUDED.neighborhood
  OR properties.price IS DISTINCT FROM EXCLUDED.price
  OR properties.price_text IS DISTINCT FROM EXCLUDED.price_text
  OR properties.rooms IS DISTINCT FROM EXCLUDED.rooms
  OR properties.gross_area IS DISTINCT FROM EXCLUDED.gross_area
  OR properties.net_area IS DISTINCT FROM EXCLUDED.net_area
  OR properties.image IS DISTINCT FROM EXCLUDED.image
  OR properties.images IS DISTINCT FROM EXCLUDED.images
  OR properties.videos IS DISTINCT FROM EXCLUDED.videos
  OR properties.description IS DISTINCT FROM EXCLUDED.description
  OR properties.features IS DISTINCT FROM EXCLUDED.features
  OR properties.latitude IS DISTINCT FROM EXCLUDED.latitude
  OR properties.longitude IS DISTINCT FROM EXCLUDED.longitude
          `,
          [
            property.id,
            property.sahibindenId,
            property.title,
            property.category,
            property.propertyType,
            property.city,
            property.district,
            property.neighborhood,
            property.price ?? null,
            property.priceText,
            property.rooms ?? null,
            property.grossArea ?? null,
            property.netArea ?? null,
            resolvedImage,
            JSON.stringify(resolvedImages),
            JSON.stringify(property.videos ?? []),
            property.description ?? "",
            JSON.stringify(property.features ?? {}),
            property.latitude ?? null,
            property.longitude ?? null,
            property.featured ?? false,
          ],
        );

        if (!alreadyExists) {
          inserted++;
        } else if (queryResult.rowCount === 1) {
          updated++;
        }
      }

      /*
       * Önce veritabanı işlemini kesin olarak tamamlıyoruz.
       *
       * Bu noktadan önce hiçbir eski Blob görseli silinmez.
       */
      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    }

    /*
     * ESKİ BLOB GÖRSELLERİNİ TEMİZLE
     *
     * Import başarıyla COMMIT olduktan sonra çalışır.
     */
    let deletedImages = 0;
    let cleanupWarning: string | null = null;

    try {
      if (oldImageCandidates.size > 0) {
        /*
         * Veritabanındaki TÜM ilanların şu anda kullandığı görselleri alıyoruz.
         *
         * Böylece eski bir URL başka bir ilanda hâlâ kullanılıyorsa
         * yanlışlıkla silinmez.
         */
        const currentProperties = await client.query<PropertyImagesRow>(
          `
            SELECT
              image,
              images
            FROM properties
          `,
        );

        const currentlyUsedImages = new Set<string>();

        for (const row of currentProperties.rows) {
          if (row.image) {
            currentlyUsedImages.add(row.image);
          }

          const images = getImageArray(row.images);

          for (const imageUrl of images) {
            currentlyUsedImages.add(imageUrl);
          }
        }

        const cleanupResult = await deleteUnusedBlobImages(
          Array.from(oldImageCandidates),
          Array.from(currentlyUsedImages),
        );

        deletedImages = cleanupResult.deleted;
      }
    } catch (cleanupError) {
      /*
       * Blob temizleme hatası importu başarısız saydırmıyor.
       *
       * Çünkü bu noktada Neon güncellemesi zaten başarıyla tamamlanmış durumda.
       */
      console.error("Eski Blob görselleri temizlenemedi:", cleanupError);

      cleanupWarning =
        cleanupError instanceof Error
          ? cleanupError.message
          : "Eski Blob görselleri temizlenemedi.";
    } finally {
      client.release();
    }

    return NextResponse.json({
      success: true,
      inserted,
      updated,
      total: properties.length,
      deletedImages,
      cleanupWarning,
    });
  } catch (error) {
    console.error("Sahibinden DB import error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Portföyler veritabanına aktarılırken hata oluştu.",
      },
      {
        status: 500,
      },
    );
  }
}
