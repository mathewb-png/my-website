export type EstimateCondition = "Light" | "Moderate" | "Heavy";

/** Bay Area residential rates aligned with site pricing ($0.25–$0.80 / sq ft). */
const RATE_BY_CONDITION: Record<
  EstimateCondition,
  { low: number; high: number }
> = {
  Light: { low: 0.25, high: 0.4 },
  Moderate: { low: 0.4, high: 0.55 },
  Heavy: { low: 0.55, high: 0.8 },
};

export const MINIMUM_SERVICE_CHARGE = 249;

export function calculateEstimateCost(
  areaSqFt: number,
  condition: EstimateCondition
): { costLow: number; costHigh: number } {
  const safeArea = Math.max(0, Math.round(areaSqFt));
  const rates = RATE_BY_CONDITION[condition] ?? RATE_BY_CONDITION.Moderate;

  const costLow = Math.max(
    MINIMUM_SERVICE_CHARGE,
    Math.round(safeArea * rates.low)
  );
  const costHigh = Math.max(
    costLow + 50,
    Math.round(safeArea * rates.high)
  );

  return { costLow, costHigh };
}

export function parseAreaSqFt(value: unknown, areaText?: string): number | null {
  if (typeof value === "number" && Number.isFinite(value) && value > 0) {
    return Math.round(value);
  }
  if (typeof areaText === "string") {
    const match = areaText.replace(/,/g, "").match(/(\d+(?:\.\d+)?)/);
    if (match) {
      const parsed = Number(match[1]);
      if (Number.isFinite(parsed) && parsed > 0) return Math.round(parsed);
    }
  }
  return null;
}

export function normalizeCondition(value: unknown): EstimateCondition {
  if (value === "Light" || value === "Moderate" || value === "Heavy") {
    return value;
  }
  return "Moderate";
}
