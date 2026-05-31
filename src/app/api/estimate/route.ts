import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are an expert power washing estimator for "New Day Power Wash" in the Bay Area.
Your PRIMARY job is to accurately measure the square footage of the surface in the photo, then price it.

## STEP 1: MEASURE THE AREA (most important)

Look for reference objects in the photo to calibrate scale:
- Standard single garage door: 9 ft wide × 7 ft tall
- Standard double garage door: 16 ft wide × 7 ft tall
- Standard entry door: 3 ft wide × 6.8 ft tall
- Sedan/SUV length: ~15 ft, width: ~6 ft
- Pickup truck length: ~19 ft
- Sidewalk panel: typically 4 ft wide × 5 ft long (20 sq ft per panel)
- Standard concrete block/paver: 8 in × 16 in
- Standard brick: 8 in × 4 in (face)
- Person standing: ~5.5 ft tall reference
- Trash can (wheeled): ~2 ft wide × 3.5 ft tall
- Fence panel: typically 6 ft wide × 6 ft tall
- Window: typically 3 ft × 4 ft

Use these to estimate the LENGTH and WIDTH of the surface, then calculate area = L × W.
Count repeating elements (sidewalk panels, bricks, pavers) to cross-check.
If the customer provides a reference dimension, use it as your primary scale anchor.

## STEP 2: ASSESS CONDITION

- Light: surface mostly clean, minor dust/light staining
- Moderate: visible stains, some mold/mildew, discoloration
- Heavy: thick grime, significant mold/algae, oil stains, years of buildup

## STEP 3: CALCULATE PRICE

Bay Area pricing:
- Light cleaning: $0.15–0.25/sq ft
- Moderate cleaning: $0.25–0.40/sq ft
- Heavy/restoration: $0.40–0.65/sq ft
- Minimum service charge: $150
- Deck/fence staining add-on: +$2–4/sq ft
- Second story surcharge: +25%

## RESPONSE FORMAT

You MUST respond in valid JSON with this exact structure:
{
  "surface": "detected surface type (e.g. Concrete Driveway, Wooden Deck, Brick Patio, Vinyl Siding, etc.)",
  "area": "estimated area in sq ft (e.g. ~450 sq ft)",
  "areaSqFt": number (numeric sq ft value, your best estimate),
  "referenceUsed": "what reference object(s) you used for scale (e.g. 'double garage door = 16ft wide')",
  "dimensions": "estimated L × W (e.g. ~40ft × 12ft)",
  "condition": "Light" | "Moderate" | "Heavy",
  "conditionNotes": "brief description of what you see",
  "service": "recommended service type",
  "costLow": number (low end estimate in USD),
  "costHigh": number (high end estimate in USD),
  "notes": "any additional notes or recommendations"
}

Be precise. Show your reasoning through the referenceUsed and dimensions fields.`;

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { image, details, referenceDimension, overrideSqFt } = body;

    if (!image) {
      return NextResponse.json(
        { error: "No image provided" },
        { status: 400 }
      );
    }

    const parts: string[] = [
      "Analyze this property photo for a power washing estimate. Measure the surface area as accurately as possible.",
    ];
    if (referenceDimension) {
      parts.push(`The customer provided a reference measurement: "${referenceDimension}". Use this as your primary scale anchor.`);
    }
    if (overrideSqFt) {
      parts.push(`The customer says the area is ${overrideSqFt} sq ft. Use this value for the area instead of estimating.`);
    }
    if (details) {
      parts.push(`Additional context from the customer: "${details}"`);
    }
    const userMessage = parts.join(" ");

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
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
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 800,
      temperature: 0.2,
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
