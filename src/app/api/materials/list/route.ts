import { NextResponse } from "next/server";
import { requireRole } from "@/core/services/auth";
import { listMaterialFiles } from "@/core/services/pdf-service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireRole(["TEACHER", "ADMIN"]);
    const files = listMaterialFiles();
    return NextResponse.json({ files });
  } catch (error: any) {
    if (error?.message === "AUTHORIZATION_REQUIRED") {
      return NextResponse.json({ error: "Teacher access required." }, { status: 403 });
    }
    console.error("List materials API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
