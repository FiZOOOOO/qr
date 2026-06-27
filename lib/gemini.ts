import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const geminiPro = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
export const geminiFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateProductDescription(
  productName: string,
  categoryName?: string
): Promise<string> {
  const cat = categoryName ? ` (kategori: ${categoryName})` : "";
  const prompt = `"${productName}"${cat} adlı yemek/içecek için kısa, iştah açıcı bir menü açıklaması yaz (maksimum 2 cümle, Türkçe).`;
  const result = await geminiFlash.generateContent(prompt);
  return result.response.text().trim();
}

export async function generateCaloriesAndAllergens(
  productName: string,
  ingredients?: string
): Promise<{ calories: number; allergens: string[] }> {
  const prompt = `
For the food item "${productName}"${ingredients ? ` with ingredients: ${ingredients}` : ""}:
1. Estimate the approximate calories (single serving, integer)
2. List which of these 14 EU allergens are present: glüten, kabuklu deniz ürünleri, yumurta, balık, yer fıstığı, soya, süt, sert kabuklu meyveler, kereviz, hardal, susam, kükürt dioksit, acı bakla, yumuşakçalar

Respond ONLY with JSON: {"calories": NUMBER, "allergens": ["allergen1", "allergen2"]}`;

  const result = await geminiFlash.generateContent(prompt);
  const text = result.response.text().trim();
  const json = text.match(/\{[\s\S]*\}/)?.[0] ?? '{"calories":0,"allergens":[]}';
  return JSON.parse(json);
}

export async function scanMenuFromImage(
  imageBase64OrUrl: string,
  mimeType: string = "image/jpeg"
): Promise<Array<{ name: string; price: number; category: string; description?: string }>> {
  const imagePart = { inlineData: { data: imageBase64OrUrl, mimeType } };
  const prompt = `Analyze this menu image and extract all food/drink items.
Return ONLY a JSON array: [{"name":"item name","price":number,"category":"category name","description":"optional short description"}]
Use Turkish for categories. If price is not visible use 0.`;

  const result = await geminiPro.generateContent([prompt, imagePart]);
  const text = result.response.text().trim();
  const json = text.match(/\[[\s\S]*\]/)?.[0] ?? "[]";
  return JSON.parse(json);
}
