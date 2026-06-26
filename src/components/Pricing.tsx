"use client";

import { useState } from "react";
import { Building2, Home, Sparkles } from "lucide-react";

interface PricingFeature {
  text: string;
  highlight?: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  priceLabel?: string;
  priceNote?: string;
  popular?: boolean;
  category: "residential" | "commercial";
  tagline: string;
  features: PricingFeature[];
  cta: string;
  ctaHref: string;
}

const tiers: PricingTier[] = [
  {
    name: "Residential Basic",
    price: "$149",
    priceLabel: "Starting at",
    priceNote: "Driveway + walkway package",
    category: "residential",
    tagline: "Essential curb appeal for single-family homes",
    features: [
      { text: "Driveway cleaning (up to 600 sq ft)" },
      { text: "Front walkway & entry path" },
      { text: "Oil & mildew spot treatment" },
      { text: "Same-day scheduling available" },
    ],
    cta: "Get Started",
    ctaHref: "#contact",
  },
  {
    name: "Residential Premium",
    price: "$399",
    priceLabel: "Starting at",
    priceNote: "Full exterior refresh",
    popular: true,
    category: "residential",
    tagline: "Our most popular whole-home package",
    features: [
      { text: "Everything in Basic", highlight: true },
      { text: "Full house exterior wash (1–2 stories)" },
      { text: "Deck or patio cleaning" },
      { text: "Fence & siding soft wash" },
      { text: "Before & after photos included" },
    ],
    cta: "Get Started",
    ctaHref: "#contact",
  },
  {
    name: "HOA / Property Management",
    price: "$699",
    priceLabel: "Starting at",
    priceNote: "Volume & maintenance plans",
    category: "commercial",
    tagline: "Scalable packages for communities and portfolios",
    features: [
      { text: "Multi-building & community packages" },
      { text: "Sidewalks, parking & common areas" },
      { text: "Scheduled maintenance programs" },
      { text: "Priority emergency service" },
      { text: "Dedicated account manager" },
    ],
    cta: "Get Custom Quote",
    ctaHref: "#contact",
  },
];


const CALC_SURFACES = [
  { label: "Driveway / Concrete", low: 0.15, high: 0.35 },
  { label: "Patio / Pavers", low: 0.2, high: 0.35 },
  { label: "House Siding (soft wash)", low: 0.15, high: 0.4 },
  { label: "Deck / Fence", low: 0.2, high: 0.4 },
] as const;

const CALC_MIN = 149;

const tierIcons = {
  residential: Home,
  commercial: Building2,
} as const;

function CheckIcon({ highlight }: { highlight?: boolean }) {
  return (
    <span
      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
        highlight ? "bg-blue-500/20 text-blue-300" : "bg-blue-500/10 text-blue-400"
      }`}
    >
      <svg
        className="h-3 w-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={3}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}


function PriceBlock({ tier }: { tier: PricingTier }) {
  return (
    <div className="mt-5 rounded-xl border border-white/8 bg-black/25 px-4 py-4 text-center">
      {tier.priceLabel && (
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
          {tier.priceLabel}
        </p>
      )}
      <p
        className={`mt-1 text-4xl font-bold tracking-tight sm:text-[2.75rem] ${
          tier.popular ? "text-blue-400" : "text-white"
        }`}
      >
        {tier.price}
      </p>
      {tier.priceNote && (
        <p className="mt-1.5 text-sm text-zinc-400">{tier.priceNote}</p>
      )}
    </div>
  );
}

function FeatureList({ features }: { features: PricingFeature[] }) {
  return (
    <div className="mt-6 flex-1">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
        What&apos;s included
      </p>
      <ul className="space-y-3 rounded-xl border border-white/6 bg-black/20 p-4">
        {features.map((feature) => (
          <li key={feature.text} className="flex items-start gap-3">
            <CheckIcon highlight={feature.highlight} />
            <span
              className={`text-sm leading-relaxed ${
                feature.highlight ? "font-medium text-blue-200" : "text-zinc-300"
              }`}
            >
              {feature.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResidentialCard({ tier }: { tier: PricingTier }) {
  const Icon = tierIcons.residential;

  return (
    <article
      className={`pricing-card group relative flex h-full flex-col rounded-2xl border p-6 sm:p-7 lg:p-8 ${
        tier.popular
          ? "pricing-card--popular border-blue-500/50 bg-zinc-950/90 shadow-xl shadow-blue-500/15 lg:-mt-4 lg:mb-4"
          : "border-white/10 bg-zinc-950/80 hover:border-white/20"
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-blue-500/30">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Most Popular
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div
          className={`inline-flex rounded-xl p-3 ${
            tier.popular
              ? "bg-blue-500/15 text-blue-400"
              : "bg-white/5 text-zinc-400 group-hover:bg-blue-500/10 group-hover:text-blue-400"
          }`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-zinc-400">
          Residential
        </span>
      </div>

      <div className="mt-5">
        <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{tier.tagline}</p>
      </div>

      <PriceBlock tier={tier} />
      <FeatureList features={tier.features} />

      <a
        href={tier.ctaHref}
        className={`mt-6 block w-full rounded-xl py-3.5 px-6 text-center text-sm font-semibold transition-all duration-200 ${
          tier.popular
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/25 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
            : "border border-white/15 text-white hover:border-blue-500/40 hover:bg-blue-500/10"
        }`}
      >
        {tier.cta}
      </a>
    </article>
  );
}

function CommercialCard({ tier }: { tier: PricingTier }) {
  const Icon = tierIcons.commercial;

  return (
    <article className="pricing-card pricing-card--commercial group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/85 p-6 sm:p-8 lg:p-10">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto] lg:items-center lg:gap-10">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-xl bg-white/5 p-3 text-zinc-400 group-hover:bg-blue-500/10 group-hover:text-blue-400">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-amber-200/90">
              Commercial
            </span>
          </div>

          <h3 className="mt-5 text-2xl font-semibold text-white">{tier.name}</h3>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-400">
            {tier.tagline}
          </p>

          <div className="mt-5 inline-flex flex-col rounded-xl border border-white/8 bg-black/25 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-zinc-500">
              {tier.priceLabel}
            </p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-white">
              {tier.price}
            </p>
            {tier.priceNote && (
              <p className="mt-1 text-sm text-zinc-400">{tier.priceNote}</p>
            )}
          </div>
        </div>

        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
            What&apos;s included
          </p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {tier.features.map((feature) => (
              <li
                key={feature.text}
                className="flex items-start gap-3 rounded-lg border border-white/6 bg-black/20 px-3 py-3"
              >
                <CheckIcon />
                <span className="text-sm leading-relaxed text-zinc-300">
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col justify-center gap-3 lg:min-w-[200px]">
          <a
            href={tier.ctaHref}
            className="block rounded-xl bg-blue-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-md shadow-blue-500/25 transition-all duration-200 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30"
          >
            {tier.cta}
          </a>
          <p className="text-center text-xs leading-relaxed text-zinc-500 lg:text-left">
            Ideal for HOAs, apartment communities, and property managers
          </p>
        </div>
      </div>
    </article>
  );
}

function PricingCalculator() {
  const [surfaceIdx, setSurfaceIdx] = useState(0);
  const [sqFt, setSqFt] = useState("");
  const surface = CALC_SURFACES[surfaceIdx];
  const area = Math.max(0, Number(sqFt) || 0);
  const hasResult = area > 0;

  const low = hasResult ? Math.max(CALC_MIN, Math.round(area * surface.low)) : 0;
  const high = hasResult ? Math.max(low + 50, Math.round(area * surface.high)) : 0;
  const hitMin = hasResult && area * surface.low < CALC_MIN;

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/80 p-6 sm:p-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
          Estimate Calculator
        </p>
        <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">
          Quick Price Check
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          Enter your surface type and area to see a ballpark range.
        </p>
      </div>

      <div className="mx-auto mt-8 grid max-w-lg gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="calc-surface"
            className="mb-1.5 block text-xs font-medium text-zinc-400"
          >
            Surface type
          </label>
          <select
            id="calc-surface"
            value={surfaceIdx}
            onChange={(e) => setSurfaceIdx(Number(e.target.value))}
            className="w-full appearance-none rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 pr-10 text-sm text-white outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 0.75rem center",
              backgroundSize: "1rem",
            }}
          >
            {CALC_SURFACES.map((s, i) => (
              <option key={s.label} value={i} className="bg-zinc-900 text-white">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="calc-sqft"
            className="mb-1.5 block text-xs font-medium text-zinc-400"
          >
            Approx. square feet
          </label>
          <input
            id="calc-sqft"
            type="number"
            min={0}
            placeholder="e.g. 500"
            value={sqFt}
            onChange={(e) => setSqFt(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {hasResult && (
        <div className="mx-auto mt-6 max-w-lg animate-fade-in-up">
          <div className="rounded-xl border border-blue-500/25 bg-blue-500/5 p-5 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-zinc-400">
              Estimated range
            </p>
            <p className="mt-2 text-3xl font-bold tracking-tight text-blue-400 sm:text-4xl">
              ${low.toLocaleString()} &ndash; ${high.toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-zinc-500">
              {surface.label} &middot; {area.toLocaleString()} sq ft
              &middot; ${surface.low.toFixed(2)}–${surface.high.toFixed(2)}/ft
            </p>
            {hitMin && (
              <p className="mt-2 text-xs text-zinc-500">
                ${CALC_MIN} minimum applies for small areas (setup, travel,
                equipment).
              </p>
            )}
          </div>

          <a
            href="#contact"
            className="mt-5 block w-full animate-fade-in-up rounded-xl bg-blue-600 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 hover:bg-blue-500 hover:shadow-xl hover:shadow-blue-500/30 active:scale-[0.97]"
          >
            Get an Exact Quote
          </a>

          <p className="mt-3 text-center text-xs text-zinc-500">
            Final price depends on condition, access, and scope.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Pricing() {
  const residentialTiers = tiers.filter((t) => t.category === "residential");
  const commercialTiers = tiers.filter((t) => t.category === "commercial");

  return (
    <section
      id="pricing"
      aria-labelledby="pricing-title"
      className="relative overflow-hidden bg-zinc-950/80 py-24 px-4 sm:px-6 lg:px-8"
    >

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Transparent Pricing
          </p>
          <h2
            id="pricing-title"
            className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Pricing Packages
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-zinc-400">
            Competitive Bay Area rates below the typical $300–$500 most companies
            charge. Most residential jobs run $0.15–$0.40 per sq ft.
          </p>
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3">
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300">
              Photo quotes available
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-zinc-300">
              No hidden fees
            </span>
          </div>
        </div>

        <div className="space-y-12">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                For Homeowners
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            </div>

            <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
              {residentialTiers.map((tier) => (
                <ResidentialCard key={tier.name} tier={tier} />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                For Communities &amp; Properties
              </h3>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            </div>

            {commercialTiers.map((tier) => (
              <CommercialCard key={tier.name} tier={tier} />
            ))}
          </div>

          <PricingCalculator />
        </div>
      </div>
    </section>
  );
}
