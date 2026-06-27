import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { scanMenuFromImage } from "@/lib/gemini";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { imageBase64, mimeType } = await req.json();
  if (!imageBase64) return NextResponse.json({ error: "Görsel verisi zorunlu" }, { status: 400 });

  try {
    const items = await scanMenuFromImage(imageBase64, mimeType ?? "image/jpeg");
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ error: "AI tarama hatası" }, { status: 500 });
  }
}
