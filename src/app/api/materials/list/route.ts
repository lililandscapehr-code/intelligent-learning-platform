import { NextResponse } from "next/server";
import { getSession } from "@/app/actions";
import { listMaterialFiles } from "@/core/services/pdf-service";

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.role !== "TEACHER" && session.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const files = listMaterialFiles();
    return NextResponse.json({ files });
  } catch (error: any) {
    console.error("List materials API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
