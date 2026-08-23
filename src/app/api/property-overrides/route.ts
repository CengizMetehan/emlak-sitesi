import { NextResponse } from "next/server";
import { getAllPropertyOverrides } from "@/lib/property-overrides";

export async function GET() {
  const overrides = await getAllPropertyOverrides();

  return NextResponse.json(overrides);
}
