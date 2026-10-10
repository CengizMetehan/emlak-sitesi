import { NextResponse } from "next/server";
import { getAllPropertyOverrides } from "@/lib/property-overrides";
import { getLocalPropertyImage } from "@/lib/properties-db";

export async function GET() {
  const overrides = (await getAllPropertyOverrides()).map((override) => ({
    ...override,
    cover_image: override.cover_image
      ? getLocalPropertyImage(override.cover_image)
      : null,
  }));

  return NextResponse.json(overrides);
}
