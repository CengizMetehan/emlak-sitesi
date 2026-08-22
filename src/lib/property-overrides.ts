import Database from "better-sqlite3";

const db = new Database("auth.db");

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
export function getPropertyOverride(
  propertyId: string,
): PropertyOverride | undefined {
  return db
    .prepare(
      `
      SELECT *
      FROM property_override
      WHERE property_id = ?
      `,
    )
    .get(propertyId) as PropertyOverride | undefined;
}

export function upsertPropertyOverride(
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
  const existing = getPropertyOverride(propertyId);

  if (!existing) {
    db.prepare(
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
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
    ).run(
      propertyId,
      data.title ?? null,
      data.price ?? null,
      data.priceText ?? null,
      data.description ?? null,
      data.coverImage ?? null,
      data.imageOrder ?? null,
      data.sahibindenNo ?? null,
    );

    return;
  }

  db.prepare(
    `
  UPDATE property_override
  SET
    title = ?,
    price = ?,
    price_text = ?,
    description = ?,
    cover_image = ?,
    image_order = ?,
    sahibinden_no = ?,
    updated_at = CURRENT_TIMESTAMP
  WHERE property_id = ?
  `,
  ).run(
    data.title ?? existing.title,
    data.price ?? existing.price,
    data.priceText ?? existing.price_text,
    data.description ?? existing.description,
    data.coverImage ?? existing.cover_image,
    data.imageOrder ?? existing.image_order,
    data.sahibindenNo ?? existing.sahibinden_no,
    propertyId,
  );
}

export function getAllPropertyOverrides(): PropertyOverride[] {
  return db
    .prepare(
      `
      SELECT *
      FROM property_override
      ORDER BY updated_at DESC
      `,
    )
    .all() as PropertyOverride[];
}

export function clearPropertyPriceOverride(propertyId: string) {
  db.prepare(
    `
    UPDATE property_override
    SET
      price = NULL,
      price_text = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE property_id = ?
    `,
  ).run(propertyId);
}

export function clearPropertyTitleOverride(propertyId: string) {
  db.prepare(
    `
    UPDATE property_override
    SET
      title = NULL,
      updated_at = CURRENT_TIMESTAMP
    WHERE property_id = ?
    `,
  ).run(propertyId);
}
