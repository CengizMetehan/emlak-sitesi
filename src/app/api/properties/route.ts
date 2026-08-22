import { NextResponse } from "next/server";
import { getProperties } from "@/lib/properties-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const properties = await getProperties();

    return NextResponse.json(properties);
  } catch (error) {
    console.error("Properties API error:", error);

    return NextResponse.json(
      {
        error: "Portföyler alınamadı.",
      },
      {
        status: 500,
      },
    );
  }
}
