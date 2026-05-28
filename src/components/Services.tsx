"use client";

const services = [
  {
    title: "HOA & Community Properties",
    description:
      "Keep your community pristine. We handle sidewalks, building exteriors, parking structures, pool decks, and common areas. Regular maintenance contracts available.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2 22h20M6 22V6l6-4 6 4v16M10 22v-6h4v6M10 10h.01M14 10h.01M10 14h.01M14 14h.01"
        />
      </svg>
    ),
  },
  {
    title: "Leasing & Property Management",
    description:
      "Make a lasting first impression. We service apartment complexes, office buildings, retail spaces, and multi-unit properties. Move-in/move-out deep cleans available.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 11h.01M3 21h18M5 21V7l7-4 7 4v14M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01"
        />
      </svg>
    ),
  },
  {
    title: "Commercial & Corporate",
    description:
      "Maintain your professional image. We clean storefronts, warehouses, loading docks, drive-throughs, heavy equipment, and large sidewalk areas for businesses.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 21h18M3 21V8l9-5 9 5v13M7 21v-3a1 1 0 011-1h2a1 1 0 011 1v3M13 21v-3a1 1 0 011-1h2a1 1 0 011 1v3M7 11h.01M11 11h.01M13 11h.01M17 11h.01M7 15h.01M17 15h.01"
        />
      </svg>
    ),
  },
  {
    title: "Residential",
    description:
      "Restore your home's beauty. Driveways, patios, decks, fences, siding, roofs, and gutters. We treat every home like our own.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-8 w-8"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1h3a1 1 0 001-1V10"
        />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section
      id="services"
      className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-zinc-950"
    >
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            Our Services
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Professional power washing for every property type
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative rounded-2xl border border-gray-200 bg-white p-8
                dark:border-white/10 dark:bg-white/5 backdrop-blur-xl
                transition-all duration-300
                hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/10
                hover:border-blue-400/50 dark:hover:border-blue-500/40
                dark:hover:shadow-blue-500/20"
            >
              <div
                className="mb-5 inline-flex items-center justify-center rounded-xl
                  bg-blue-50 p-3 text-blue-600
                  dark:bg-blue-500/10 dark:text-blue-400"
              >
                {service.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {service.title}
              </h3>

              <p className="text-gray-600 dark:text-zinc-400 leading-relaxed text-sm">
                {service.description}
              </p>

              <div
                className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300
                  group-hover:opacity-100 pointer-events-none
                  bg-gradient-to-b from-blue-500/5 to-transparent
                  dark:from-blue-500/10"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
