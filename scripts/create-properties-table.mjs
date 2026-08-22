import pg from "pg";

const { Client } = pg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  await client.connect();

  await client.query(`
    CREATE TABLE IF NOT EXISTS properties (
      id TEXT PRIMARY KEY,
      sahibinden_id TEXT UNIQUE NOT NULL,

      title TEXT NOT NULL,
      category TEXT NOT NULL,
      property_type TEXT NOT NULL,

      city TEXT NOT NULL,
      district TEXT NOT NULL,
      neighborhood TEXT NOT NULL,

      price BIGINT,
      price_text TEXT NOT NULL,

      rooms TEXT,
      gross_area INTEGER,
      net_area INTEGER,

      image TEXT NOT NULL,
      images JSONB NOT NULL DEFAULT '[]'::jsonb,
      videos JSONB NOT NULL DEFAULT '[]'::jsonb,

      description TEXT NOT NULL DEFAULT '',
      features JSONB NOT NULL DEFAULT '{}'::jsonb,

      latitude DOUBLE PRECISION,
      longitude DOUBLE PRECISION,

      featured BOOLEAN NOT NULL DEFAULT FALSE,

      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  console.log("properties tablosu hazır.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await client.end();
  });
