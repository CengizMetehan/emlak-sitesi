import pg from "pg";
import { properties } from "../src/data/properties.generated";

const { Client } = pg;

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL bulunamadı.");
}

const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  await client.connect();

  console.log(`${properties.length} portföy bulundu.`);
  console.log("Neon aktarımı başlıyor...\n");

  let insertedOrUpdated = 0;

  for (const property of properties) {
    await client.query(
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
          featured = EXCLUDED.featured,
          updated_at = NOW()
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
        property.image,
        JSON.stringify(property.images ?? []),
        JSON.stringify(property.videos ?? []),
        property.description ?? "",
        JSON.stringify(property.features ?? {}),
        property.latitude ?? null,
        property.longitude ?? null,
        property.featured ?? false,
      ],
    );

    insertedOrUpdated++;

    console.log(
      `[${insertedOrUpdated}/${properties.length}] ${property.title}`,
    );
  }

  const result = await client.query(`
    SELECT COUNT(*)::int AS count
    FROM properties
  `);

  console.log("\n--------------------------------");
  console.log("Neon aktarımı tamamlandı.");
  console.log(`İşlenen portföy: ${insertedOrUpdated}`);
  console.log(`Veritabanındaki toplam portföy: ${result.rows[0].count}`);
  console.log("--------------------------------");
}

main()
  .catch((error) => {
    console.error("\nNeon aktarım hatası:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
  });
