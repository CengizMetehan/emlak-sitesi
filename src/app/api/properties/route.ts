import { NextResponse } from "next/server";
import { getPropertySummaries } from "@/lib/properties-db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const properties = await getPropertySummaries();

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
