import { NextResponse } from "next/server";
import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (typeof body.featured !== "boolean") {
      return NextResponse.json(
        {
          error: "Geçersiz featured değeri.",
        },
        {
          status: 400,
        },
      );
    }

    const result = await pool.query(
      `
        UPDATE properties
        SET
          featured = $1,
          updated_at = NOW()
        WHERE id = $2
        RETURNING id, featured
      `,
      [body.featured, id],
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        {
          error: "Portföy bulunamadı.",
        },
        {
          status: 404,
        },
      );
    }

    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
      featured: result.rows[0].featured,
    });
  } catch (error) {
    console.error("Featured update error:", error);

    return NextResponse.json(
      {
        error: "Öne çıkan durumu güncellenemedi.",
      },
      {
        status: 500,
      },
    );
  }
}
