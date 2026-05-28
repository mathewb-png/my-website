"use client";

interface PricingFeature {
  text: string;
}

interface PricingTier {
  name: string;
  price: string;
  priceLabel?: string;
  popular?: boolean;
  features: PricingFeature[];
  cta: string;
  ctaHref: string;
}

const tiers: PricingTier[] = [
  {
    name: "Residential Basic",
    price: "$149",
    priceLabel: "Starting at",
    features: [
      { text: "Driveway cleaning (up to 600 sq ft)" },
      { text: "Front walkway" },
      { text: "Free spot treatment" },
      { text: "Same-day scheduling" },
    ],
    cta: "Get Started",
    ctaHref: "#contact",
  },
  {
    name: "Residential Premium",
    price: "$349",
    priceLabel: "Starting at",
    popular: true,
    features: [
      { text: "Everything in Basic" },
      { text: "Full house exterior wash" },
      { text: "Deck/patio cleaning" },
      { text: "Gutter brightening" },
      { text: "Before & after photos" },
    ],
    cta: "Get Started",
    ctaHref: "#contact",
  },
  {
    name: "Commercial",
    price: "$599",
    priceLabel: "Starting at",
    features: [
      { text: "Up to 5,000 sq ft" },
      { text: "Sidewalks & walkways" },
      { text: "Building exterior" },
      { text: "Parking area treatment" },
      { text: "Monthly maintenance plans available" },
    ],
    cta: "Get Started",
    ctaHref: "#contact",
  },
  {
    name: "HOA / Property Management",
    price: "Custom",
    priceLabel: "Get a",
    features: [
      { text: "Tailored to your community" },
      { text: "Multi-building packages" },
      { text: "Scheduled maintenance programs" },
      { text: "Priority emergency service" },
      { text: "Dedicated account manager" },
    ],
    cta: "Get Custom Quote",
    ctaHref: "#contact",
  },
];

function CheckIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-blue-500 dark:text-blue-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-900/50"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Pricing Packages
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Transparent pricing for every need
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300
                hover:-translate-y-1 hover:shadow-lg
                ${
                  tier.popular
                    ? "border-blue-500 dark:border-blue-400 shadow-lg shadow-blue-500/20 dark:shadow-blue-500/30 bg-white dark:bg-white/[0.07]"
                    : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20"
                }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span
                    className="inline-flex items-center rounded-full bg-blue-600 px-4 py-1 text-xs
                      font-semibold uppercase tracking-wider text-white shadow-lg shadow-blue-500/30"
                  >
                    Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {tier.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-sm text-gray-500 dark:text-zinc-400">
                    {tier.priceLabel}
                  </span>
                  <span
                    className={`text-4xl font-bold tracking-tight ${
                      tier.popular
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                  >
                    {tier.price}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-200 dark:bg-white/10 mb-6" />

              <ul className="flex-1 space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <CheckIcon />
                    <span className="text-sm text-gray-700 dark:text-zinc-300">
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={tier.ctaHref}
                className={`block w-full rounded-xl py-3 px-6 text-center text-sm font-semibold
                  transition-all duration-200
                  ${
                    tier.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5"
                      : "border border-gray-300 dark:border-white/15 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/10 hover:-translate-y-0.5"
                  }`}
              >
                {tier.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
