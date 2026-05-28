import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert power washing estimator for "New Day Power Wash" in the Bay Area. 
Analyze the uploaded photo of a property/surface and provide an accurate cost estimate.

You MUST respond in valid JSON with this exact structure:
{
  "surface": "detected surface type (e.g. Concrete Driveway, Wooden Deck, Brick Patio, Vinyl Siding, etc.)",
  "area": "estimated area in sq ft (e.g. ~450 sq ft)",
  "condition": "Light" | "Moderate" | "Heavy",
  "conditionNotes": "brief description of what you see (stains, mold, dirt level, etc.)",
  "service": "recommended service type",
  "costLow": number (low end estimate in USD),
  "costHigh": number (high end estimate in USD),
  "notes": "any additional notes or recommendations"
}

Pricing guidelines for the Bay Area:
- Light cleaning: $0.15-0.25/sq ft
- Moderate cleaning: $0.25-0.40/sq ft
- Heavy/restoration: $0.40-0.65/sq ft
- Minimum service charge: $150
- Deck/fence staining add-on: +$2-4/sq ft
- Second story surcharge: +25%
- Driveways typically 400-800 sq ft, decks 200-500 sq ft, patios 150-400 sq ft
- Whole house exterior: $300-800 depending on size

Be realistic and accurate. If you cannot determine the surface or area well, provide your best estimate with a wider cost range.`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { image, details } = body;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const userMessage = details
      ? `Analyze this property photo for a power washing estimate. Additional context from the customer: "${details}"`
      : "Analyze this property photo for a power washing estimate.";

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: userMessage },
            {
              type: "image_url",
              image_url: {
                url: image.startsWith("data:") ? image : `data:image/jpeg;base64,${image}`,
                detail: "low",
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const text = response.choices[0]?.message?.content || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);

    return NextResponse.json({ result });
  } catch (error: unknown) {
    console.error("Estimate API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
