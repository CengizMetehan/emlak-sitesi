import pg from "pg";
import { properties as importedProperties } from "@/data/properties";
import type { Property, PropertySummary } from "@/data/properties";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const localImageByFilename = new Map<string, string>();

for (const property of importedProperties) {
  for (const image of property.images) {
    if (!image.startsWith("/sahibinden/")) continue;

    const filename = image.split("/").pop();
    if (filename && !localImageByFilename.has(filename)) {
      localImageByFilename.set(filename, image);
    }
  }
}

export function getLocalPropertyImage(image: string) {
  const filename = image.split("?")[0]?.split("/").pop();
  return filename ? (localImageByFilename.get(filename) ?? image) : image;
}

export async function getPropertySummaries(): Promise<PropertySummary[]> {
  const result = await pool.query(`
    SELECT
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
      image
    FROM properties
    ORDER BY created_at DESC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    sahibindenId: row.sahibinden_id,
    title: row.title,
    category: row.category,
    propertyType: row.property_type,
    city: row.city,
    district: row.district,
    neighborhood: row.neighborhood,
    price: row.price ? Number(row.price) : undefined,
    priceText: row.price_text,
    rooms: row.rooms ?? undefined,
    grossArea: row.gross_area ?? undefined,
    image: getLocalPropertyImage(row.image),
  }));
}

export async function getFeaturedPropertySummaries(
  excludedId: string,
  limit = 3,
): Promise<PropertySummary[]> {
  const result = await pool.query(
    `
      SELECT
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
        image
      FROM properties
      WHERE featured = TRUE AND id <> $1
      ORDER BY created_at DESC
      LIMIT $2
    `,
    [excludedId, limit],
  );

  return result.rows.map((row) => ({
    id: row.id,
    sahibindenId: row.sahibinden_id,
    title: row.title,
    category: row.category,
    propertyType: row.property_type,
    city: row.city,
    district: row.district,
    neighborhood: row.neighborhood,
    price: row.price ? Number(row.price) : undefined,
    priceText: row.price_text,
    rooms: row.rooms ?? undefined,
    grossArea: row.gross_area ?? undefined,
    image: getLocalPropertyImage(row.image),
  }));
}

export async function getProperties(): Promise<Property[]> {
  const result = await pool.query(`
    SELECT
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
      featured
    FROM properties
    ORDER BY created_at DESC
  `);

  return result.rows.map((row) => ({
    id: row.id,
    sahibindenId: row.sahibinden_id,
    title: row.title,
    category: row.category,
    propertyType: row.property_type,
    city: row.city,
    district: row.district,
    neighborhood: row.neighborhood,
    price: row.price ? Number(row.price) : undefined,
    priceText: row.price_text,
    rooms: row.rooms ?? undefined,
    grossArea: row.gross_area ?? undefined,
    netArea: row.net_area ?? undefined,
    image: row.image,
    images: row.images ?? [],
    videos: row.videos ?? [],
    description: row.description ?? "",
    features: row.features ?? {},
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    featured: row.featured ?? false,
  }));
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const result = await pool.query(
    `
      SELECT
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
        featured
      FROM properties
      WHERE id = $1
      LIMIT 1
    `,
    [id],
  );

  const row = result.rows[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    sahibindenId: row.sahibinden_id,
    title: row.title,
    category: row.category,
    propertyType: row.property_type,
    city: row.city,
    district: row.district,
    neighborhood: row.neighborhood,
    price: row.price ? Number(row.price) : undefined,
    priceText: row.price_text,
    rooms: row.rooms ?? undefined,
    grossArea: row.gross_area ?? undefined,
    netArea: row.net_area ?? undefined,
    image: row.image,
    images: row.images ?? [],
    videos: row.videos ?? [],
    description: row.description ?? "",
    features: row.features ?? {},
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    featured: row.featured ?? false,
  };
}
