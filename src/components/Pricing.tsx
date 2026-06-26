"use client";

import { Home, Sparkles } from "lucide-react";

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
  category: "residential";
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
];



const tierIcons = {
  residential: Home,
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



export default function Pricing() {
  const residentialTiers = tiers.filter((t) => t.category === "residential");

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


        </div>
      </div>
    </section>
  );
}
