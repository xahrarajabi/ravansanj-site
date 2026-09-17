import { NextResponse } from "next/server";
import { landingContent } from "@/lib/landing";

export async function GET() {
  return NextResponse.json({
    meta: { status: "success" },
    data: landingContent,
  });
}
