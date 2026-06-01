import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  calculateEstimateCost,
  normalizeCondition,
  parseAreaSqFt,
} from "@/lib/estimatePricing";
import { normalizeEstimateImageDataUrl } from "@/lib/normalizeEstimateImage";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const ESTIMATE_MODEL = process.env.OPENAI_ESTIMATE_MODEL ?? "gpt-4o";

const SYSTEM_PROMPT = `You are a field estimator for New Day Power Wash (Bay Area, California).
Your ONLY job is to read the photo and estimate the cleanable surface — NOT final pricing.

## STEP 1: FIND SCALE REFERENCES
Use visible objects to estimate length × width:
- Single garage door: 9 ft × 7 ft
- Double garage door: 16 ft × 7 ft
- Entry door: 3 ft × 6.8 ft
- Sedan length: ~15 ft, width: ~6 ft
- SUV length: ~16–19 ft
- Sidewalk panel: ~4 ft × 5 ft (20 sq ft each)
- Standard paver: 8 in × 16 in
- Fence panel: ~6 ft × 6 ft
- Person height: ~5.5 ft
- Wheeled trash can: ~2 ft × 3.5 ft

Count repeating panels/bricks/pavers to cross-check area.
If the customer gives a reference measurement, treat it as the primary scale anchor.

## STEP 2: IDENTIFY SURFACE & CONDITION
Surface examples: Concrete Driveway, Sidewalk, Brick Patio, Wooden Deck, Vinyl Siding, Stucco Wall, Stone Walkway, Composite Deck, Paver Patio.

Condition:
- Light: mostly clean, light dust or minor staining
- Moderate: visible stains, mildew, or discoloration
- Heavy: thick grime, algae, oil, or years of buildup

## STEP 3: RECOMMEND SERVICE
- Hard flat surfaces (concrete, pavers, sidewalk): Standard Power Wash or Deep Clean Power Wash
- Wood, vinyl, stucco, painted surfaces: Soft Wash Treatment
- Very stained hard surfaces: Deep Clean Power Wash or Surface Restoration Wash

We do NOT clean roofs or gutters. If the photo is mostly roof/gutter, say so in notes and estimate only the visible non-roof surface if possible.

## OUTPUT
Return ONLY valid JSON with this exact shape:
{
  "surface": "string",
  "area": "human-readable area like ~450 sq ft",
  "areaSqFt": number,
  "referenceUsed": "what you used for scale",
  "dimensions": "estimated L × W",
  "condition": "Light" | "Moderate" | "Heavy",
  "conditionNotes": "brief visual notes",
  "service": "recommended service name",
  "confidence": "high" | "medium" | "low",
  "notes": "uncertainty, obstructions, or photo quality issues"
}

Be conservative when scale is unclear — lower areaSqFt and set confidence to low rather than guessing high.`;

interface VisionAnalysis {
  surface?: string;
  area?: string;
  areaSqFt?: number;
  referenceUsed?: string;
  dimensions?: string;
  condition?: string;
  conditionNotes?: string;
  service?: string;
  confidence?: string;
  notes?: string;
}

function buildUserMessage(
  referenceDimension?: string,
  overrideSqFt?: number,
  details?: string
): string {
  const parts = [
    "Analyze this property photo for a power washing estimate. Measure the primary cleanable surface area as accurately as possible.",
    "If the full surface is not visible, estimate only the visible portion and explain that in notes.",
    "If no reliable scale reference exists, set confidence to low.",
  ];

  if (referenceDimension) {
    parts.push(
      `Customer reference measurement (use as primary scale): "${referenceDimension}".`
    );
  }
  if (overrideSqFt) {
    parts.push(
      `Customer says the area is ${overrideSqFt} sq ft — use that exact areaSqFt value.`
    );
  }
  if (details) {
    parts.push(`Additional customer context: "${details}".`);
  }

  return parts.join("\n");
}

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
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const normalizedImage = await normalizeEstimateImageDataUrl(image);
    const userMessage = buildUserMessage(
      referenceDimension,
      overrideSqFt ? Number(overrideSqFt) : undefined,
      details
    );

    const response = await openai.chat.completions.create({
      model: ESTIMATE_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: userMessage },
            {
              type: "image_url",
              image_url: {
                url: normalizedImage,
                detail: "high",
              },
            },
          ],
        },
      ],
      max_tokens: 700,
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      return NextResponse.json(
        { error: "Empty response from vision model" },
        { status: 500 }
      );
    }

    let analysis: VisionAnalysis;
    try {
      analysis = JSON.parse(text) as VisionAnalysis;
    } catch {
      return NextResponse.json(
        { error: "Failed to parse AI response" },
        { status: 500 }
      );
    }

    const condition = normalizeCondition(analysis.condition);
    const areaSqFt =
      overrideSqFt && Number(overrideSqFt) > 0
        ? Math.round(Number(overrideSqFt))
        : parseAreaSqFt(analysis.areaSqFt, analysis.area);

    if (!areaSqFt) {
      return NextResponse.json(
        {
          error:
            "Could not estimate area from this photo. Try adding a reference measurement (e.g. driveway is 20 ft wide) or enter known sq ft.",
        },
        { status: 422 }
      );
    }

    const { costLow, costHigh } = calculateEstimateCost(areaSqFt, condition);

    const result = {
      surface: analysis.surface?.trim() || "Unknown Surface",
      area: analysis.area?.trim() || `~${areaSqFt.toLocaleString()} sq ft`,
      areaSqFt,
      referenceUsed: analysis.referenceUsed?.trim() || undefined,
      dimensions: analysis.dimensions?.trim() || undefined,
      condition,
      conditionNotes: analysis.conditionNotes?.trim() || undefined,
      service: analysis.service?.trim() || "Standard Power Wash",
      costLow,
      costHigh,
      confidence: analysis.confidence || "medium",
      notes: analysis.notes?.trim() || undefined,
    };

    return NextResponse.json({ result });
  } catch (error: unknown) {
    console.error("Estimate API error:", error);

    const openAiCode =
      error &&
      typeof error === "object" &&
      "code" in error &&
      typeof (error as { code?: string }).code === "string"
        ? (error as { code: string }).code
        : null;

    if (openAiCode === "invalid_api_key") {
      return NextResponse.json(
        {
          error:
            "Quote service is not configured yet. Please call or use the contact form and we will send a quote shortly.",
        },
        { status: 503 }
      );
    }

    const message = error instanceof Error ? error.message : "Unknown error";
    const safeMessage = message.includes("API key")
      ? "Quote service is temporarily unavailable. Please try again later or contact us for a manual quote."
      : message;

    return NextResponse.json({ error: safeMessage }, { status: 500 });
  }
}
