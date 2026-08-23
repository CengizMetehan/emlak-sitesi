import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
});

export type PropertyOverride = {
  id: number;
  property_id: string;
  title: string | null;
  price: number | null;
  price_text: string | null;
  description: string | null;
  cover_image: string | null;
  image_order: string | null;
  sahibinden_no: string | null;
  created_at: string;
  updated_at: string;
};

let tableReady = false;

async function ensurePropertyOverrideTable() {
  if (tableReady) {
    return;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS property_override (
      id BIGSERIAL PRIMARY KEY,
      property_id TEXT NOT NULL UNIQUE,
      title TEXT,
      price BIGINT,
      price_text TEXT,
      description TEXT,
      cover_image TEXT,
      image_order TEXT,
      sahibinden_no TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  tableReady = true;
}

function normalizeOverride(row: Record<string, unknown>): PropertyOverride {
  return {
    id: Number(row.id),
    property_id: String(row.property_id),
    title: row.title == null ? null : String(row.title),
    price: row.price == null ? null : Number(row.price),
    price_text: row.price_text == null ? null : String(row.price_text),
    description: row.description == null ? null : String(row.description),
    cover_image: row.cover_image == null ? null : String(row.cover_image),
    image_order: row.image_order == null ? null : String(row.image_order),
    sahibinden_no: row.sahibinden_no == null ? null : String(row.sahibinden_no),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function getPropertyOverride(
  propertyId: string,
): Promise<PropertyOverride | undefined> {
  await ensurePropertyOverrideTable();

  const result = await pool.query(
    `
    SELECT *
    FROM property_override
    WHERE property_id = $1
    LIMIT 1
    `,
    [propertyId],
  );

  if (result.rows.length === 0) {
    return undefined;
  }

  return normalizeOverride(result.rows[0]);
}

export async function upsertPropertyOverride(
  propertyId: string,
  data: {
    title?: string | null;
    price?: number | null;
    priceText?: string | null;
    description?: string | null;
    coverImage?: string | null;
    imageOrder?: string | null;
    sahibindenNo?: string | null;
  },
) {
  await ensurePropertyOverrideTable();

  await pool.query(
    `
    INSERT INTO property_override (
      property_id,
      title,
      price,
      price_text,
      description,
      cover_image,
      image_order,
      sahibinden_no
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)

    ON CONFLICT (property_id)
    DO UPDATE SET
      title = COALESCE(EXCLUDED.title, property_override.title),
      price = COALESCE(EXCLUDED.price, property_override.price),
      price_text = COALESCE(
        EXCLUDED.price_text,
        property_override.price_text
      ),
      description = COALESCE(
        EXCLUDED.description,
        property_override.description
      ),
      cover_image = COALESCE(
        EXCLUDED.cover_image,
        property_override.cover_image
      ),
      image_order = COALESCE(
        EXCLUDED.image_order,
        property_override.image_order
      ),
      sahibinden_no = COALESCE(
        EXCLUDED.sahibinden_no,
        property_override.sahibinden_no
      ),
      updated_at = CURRENT_TIMESTAMP
    `,
    [
      propertyId,
      data.title ?? null,
      data.price ?? null,
      data.priceText ?? null,
      data.description ?? null,
      data.coverImage ?? null,
      data.imageOrder ?? null,
      data.sahibindenNo ?? null,
    ],
  );
}

export async function getAllPropertyOverrides(): Promise<PropertyOverride[]> {
  await ensurePropertyOverrideTable();

  const result = await pool.query(`
    SELECT *
    FROM property_override
    ORDER BY updated_at DESC
  `);

  return result.rows.map(normalizeOverride);
}

export async function clearPropertyPriceOverride(propertyId: string) {
  await ensurePropertyOverrideTable();

  await pool.query(
    `
    UPDATE property_override
    SET
      price = NULL,
      price_text = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE property_id = $1
    `,
    [propertyId],
  );
}

export async function clearPropertyTitleOverride(propertyId: string) {
  await ensurePropertyOverrideTable();

  await pool.query(
    `
    UPDATE property_override
    SET
      title = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE property_id = $1
    `,
    [propertyId],
  );
}
