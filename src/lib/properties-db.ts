import pg from "pg";
import type { Property } from "@/data/properties";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

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
