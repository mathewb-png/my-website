"use client";

import { useState } from "react";

type WashMethod = "power" | "soft" | "hybrid";

interface SurfaceSpec {
  id: string;
  name: string;
  category: string;
  method: WashMethod;
  methodLabel: string;
  psiMin: number;
  psiMax: number;
  nozzle: string;
  chemical: string;
  technique: string;
  standoff: string;
  summary: string;
}

const surfaces: SurfaceSpec[] = [
  {
    id: "concrete",
    name: "Concrete & Driveways",
    category: "Hard Surface",
    method: "power",
    methodLabel: "Power Wash",
    psiMin: 2000,
    psiMax: 3500,
    nozzle: "15°–25° fan tip or flat surface cleaner",
    chemical: "Alkaline degreaser for oil stains; sodium hypochlorite 2–4% for organic growth",
    technique:
      "Use a surface cleaner for even coverage and to prevent zebra stripes. Spot-treat oil with degreaser before rinsing.",
    standoff: "6–12 inches on stubborn spots; surface cleaner maintains consistent height",
    summary: "Built for high mechanical force — concrete can take the pressure when technique is controlled.",
  },
  {
    id: "sidewalk",
    name: "Sidewalks & Pavers",
    category: "Hard Surface",
    method: "power",
    methodLabel: "Power Wash",
    psiMin: 2000,
    psiMax: 3000,
    nozzle: "25° fan tip or rotary nozzle for tight joints",
    chemical: "Alkaline cleaner for gum and grease; mild SH blend for algae in shaded areas",
    technique:
      "Overlap passes like mowing a lawn. Flush joints and edges last so runoff doesn't re-stain cleaned areas.",
    standoff: "8–14 inches; closer only on embedded stains with a wider tip first",
    summary: "High-traffic flatwork needs strong pressure — we balance force with even, overlapping passes.",
  },
  {
    id: "vinyl",
    name: "Vinyl Siding",
    category: "Exterior Cladding",
    method: "soft",
    methodLabel: "Soft Wash",
    psiMin: 100,
    psiMax: 500,
    nozzle: "Soft wash system or 40°+ fan tip — never 0° or 15°",
    chemical: "Eco-friendly house wash: SH 0.5–1.5% + surfactant to cling on vertical surfaces",
    technique:
      "Apply bottom-up, dwell 5–10 minutes without letting it dry, then rinse top-down. Never blast water behind panels.",
    standoff: "12–18 inches minimum; low pressure is the cleaner, not the force",
    summary: "Force behind siding causes hidden moisture damage — chemistry does the work here.",
  },
  {
    id: "wood",
    name: "Wood Decks & Fences",
    category: "Soft / Natural",
    method: "hybrid",
    methodLabel: "Low-Pressure Wash",
    psiMin: 500,
    psiMax: 1200,
    nozzle: "40°–65° fan tip only",
    chemical: "pH-neutral wood cleaner or soft wash blend; never undiluted bleach on bare wood",
    technique:
      "Always spray parallel to the grain. Pre-wet wood, apply cleaner, gentle rinse — high PSI splinters fibers instantly.",
    standoff: "18–24 inches; start wide and increase distance before increasing pressure",
    summary: "Wood bruises easily. We lift dirt with chemistry and use just enough pressure to rinse clean.",
  },
  {
    id: "brick",
    name: "Brick & Mortar",
    category: "Masonry",
    method: "hybrid",
    methodLabel: "Controlled Power Wash",
    psiMin: 1500,
    psiMax: 2000,
    nozzle: "25° fan tip; avoid pinpoint streams on older mortar",
    chemical: "Alkaline masonry cleaner or SH 2–4% for moss and mildew in joints",
    technique:
      "Test a small area first on aged mortar. Work top-down on walls; let detergent dwell in porous joints before rinsing.",
    standoff: "12–18 inches; reduce PSI on deteriorating or pre-1940 mortar",
    summary: "Brick handles more than siding, but mortar is the weak point — pressure stays moderate and targeted.",
  },
  {
    id: "stucco",
    name: "Stucco & Painted Trim",
    category: "Delicate Finish",
    method: "soft",
    methodLabel: "Soft Wash",
    psiMin: 100,
    psiMax: 800,
    nozzle: "40° fan tip or soft wash downstream injector",
    chemical: "Mild house wash with surfactant; avoid harsh acids on painted or coated surfaces",
    technique:
      "Keep the wand perpendicular and never closer than two feet on stucco. Painted trim gets soft wash only — high PSI strips paint in one pass.",
    standoff: "24+ inches on stucco; 18 inches on painted trim",
    summary: "Texture holds dirt but the finish is fragile. Low pressure + proper dwell time protects the coating.",
  },
];

const methodStyles: Record<
  WashMethod,
  { badge: string; gauge: string; label: string }
> = {
  power: {
    badge: "border-blue-500/40 bg-blue-600/20 text-blue-300",
    gauge: "from-blue-600 via-blue-500 to-blue-400",
    label: "High mechanical force",
  },
  soft: {
    badge: "border-blue-400/30 bg-blue-500/10 text-blue-400",
    gauge: "from-blue-500/70 via-blue-400/80 to-blue-300/90",
    label: "Chemistry-led cleaning",
  },
  hybrid: {
    badge: "border-blue-500/35 bg-blue-500/15 text-blue-300",
    gauge: "from-blue-500 via-blue-400 to-cyan-400",
    label: "Balanced pressure + chemistry",
  },
};

const PSI_MAX_SCALE = 3500;

function PsiGauge({
  min,
  max,
  method,
}: {
  min: number;
  max: number;
  method: WashMethod;
}) {
  const fill = ((max / PSI_MAX_SCALE) * 100).toFixed(1);
  const minMark = ((min / PSI_MAX_SCALE) * 100).toFixed(1);
  const styles = methodStyles[method];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-400">
            Pressure Range
          </p>
          <p className="mt-1 text-3xl font-bold tabular-nums text-white sm:text-4xl">
            {min.toLocaleString()}–{max.toLocaleString()}
            <span className="ml-1 text-lg font-semibold text-zinc-400">PSI</span>
          </p>
        </div>
        <p className="max-w-[8rem] text-right text-xs leading-relaxed text-zinc-500">
          {styles.label}
        </p>
      </div>
      <div
        className="relative mt-4 h-2.5 overflow-hidden rounded-full bg-white/10"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={PSI_MAX_SCALE}
        aria-valuenow={max}
        aria-label={`${min} to ${max} PSI`}
      >
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${styles.gauge} shadow-[0_0_12px_rgba(59,130,246,0.45)] transition-all duration-500`}
          style={{ width: `${fill}%` }}
        />
        <div
          className="absolute inset-y-0 w-0.5 bg-white/80"
          style={{ left: `${minMark}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] font-medium uppercase tracking-wider text-zinc-600">
        <span>Soft wash</span>
        <span>Residential</span>
        <span>Commercial</span>
      </div>
    </div>
  );
}

function MethodIcon({ type }: { type: WashMethod }) {
  if (type === "power") {
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path
          d="M13 2L4 14h7l-1 8 9-12h-7l1-8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
      <path
        d="M12 3c3.5 4 6 6.5 6 9.5a6 6 0 1 1-12 0C6 9.5 8.5 7 12 3Z"
        fill="currentColor"
        opacity="0.45"
      />
      <path
        d="M12 8v5M12 16h.01"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function SurfaceGuide() {
  const [activeId, setActiveId] = useState(surfaces[0].id);
  const active = surfaces.find((s) => s.id === activeId) ?? surfaces[0];
  const styles = methodStyles[active.method];

  return (
    <section
      id="surfaces"
      aria-labelledby="surfaces-title"
      className="relative overflow-hidden bg-gray-950 py-24 px-4 sm:px-6 lg:px-8"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(30,144,255,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Surface Playbook
          </p>
          <h2
            id="surfaces-title"
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            The Right Method for Every Surface
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            Not every stain needs maximum pressure. We match PSI, nozzle angle,
            and chemistry to the material — protecting your property while
            delivering a deep clean.
          </p>
        </div>

        <div className="mb-10 grid gap-6 sm:grid-cols-2">
          {[
            {
              title: "Power Wash",
              type: "power" as WashMethod,
              text: "Hard, non-porous surfaces — concrete, brick, pavers, and driveways — where mechanical force removes embedded grime safely.",
            },
            {
              title: "Soft Wash",
              type: "soft" as WashMethod,
              text: "Siding, wood, stucco, and painted surfaces — low pressure plus detergent breaks down mold and algae without surface damage.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/20 sm:p-8"
            >
              <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-blue-500/10 p-3 text-blue-400">
                <MethodIcon type={item.type} />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-400">{item.text}</p>
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-b from-blue-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          ))}
        </div>

        <div
          className="mb-8 flex gap-2 overflow-x-auto pb-2 scrollbar-hide"
          role="tablist"
          aria-label="Surface types"
        >
          {surfaces.map((surface) => {
            const isActive = surface.id === activeId;
            return (
              <button
                key={surface.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`surface-panel-${surface.id}`}
                id={`surface-tab-${surface.id}`}
                onClick={() => setActiveId(surface.id)}
                className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "border-blue-500/50 bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                    : "border-white/10 bg-white/5 text-zinc-400 hover:border-blue-500/30 hover:text-white"
                }`}
              >
                {surface.name}
              </button>
            );
          })}
        </div>

        <div
          id={`surface-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`surface-tab-${active.id}`}
          className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg shadow-blue-500/10 backdrop-blur-xl sm:p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {active.category}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${styles.badge}`}
                >
                  {active.methodLabel}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-white sm:text-3xl">
                {active.name}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-zinc-400">
                {active.summary}
              </p>
              <div className="mt-8">
                <PsiGauge
                  min={active.psiMin}
                  max={active.psiMax}
                  method={active.method}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                {
                  label: "Nozzle & Equipment",
                  value: active.nozzle,
                  icon: (
                    <path
                      d="M4 14h16M7 14V8l5-3 5 3v6M10 18h4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
                {
                  label: "Chemical Solution",
                  value: active.chemical,
                  icon: (
                    <path
                      d="M12 3c3.5 4 6 6.5 6 9.5a6 6 0 1 1-12 0C6 9.5 8.5 7 12 3Z"
                      fill="currentColor"
                      opacity="0.45"
                    />
                  ),
                },
                {
                  label: "Our Technique",
                  value: active.technique,
                  icon: (
                    <path
                      d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ),
                },
                {
                  label: "Safe Standoff",
                  value: active.standoff,
                  icon: (
                    <path
                      d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  ),
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-white/10 bg-gray-950/50 p-4 transition-colors duration-200 hover:border-blue-500/30 sm:p-5"
                >
                  <div className="mb-3 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center rounded-lg bg-blue-500/10 p-2 text-blue-400">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                        {item.icon}
                      </svg>
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-5 py-5 backdrop-blur-sm sm:px-6">
          <p className="text-center text-sm leading-relaxed text-zinc-500">
            <span className="font-semibold text-zinc-300">
              Every job follows the same safety rules:
            </span>{" "}
            pre-soak plants before chemicals, apply detergents bottom-up, rinse
            top-down, maintain proper wand distance, and never mix incompatible
            chemicals. We adjust on-site after a pre-inspection walkthrough.
          </p>
        </div>
      </div>
    </section>
  );
}
