import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateProductDescription, generateCaloriesAndAllergens } from "@/lib/gemini";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });

  const { name, categoryName } = await req.json();
  if (!name) return NextResponse.json({ error: "Ürün adı zorunlu" }, { status: 400 });

  try {
    const [description, caloriesAndAllergens] = await Promise.all([
      generateProductDescription(name, categoryName),
      generateCaloriesAndAllergens(name),
    ]);
    return NextResponse.json({ description, ...caloriesAndAllergens });
  } catch (e) {
    return NextResponse.json({ error: "AI hatası" }, { status: 500 });
  }
}
