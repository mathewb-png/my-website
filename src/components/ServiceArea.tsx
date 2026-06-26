import { BUSINESS, LOCAL_FAQS, SERVICE_CITIES } from "@/lib/seo";

export default function ServiceArea() {
  return (
    <section
      id="service-area"
      aria-labelledby="service-area-title"
      className="relative bg-gray-950 py-20 px-4 sm:px-6 lg:px-8"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(30,144,255,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
            Service Area
          </p>
          <h2
            id="service-area-title"
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Tri-Valley &amp; East Bay
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-400">
            Residential-first power washing for homeowners. We also serve HOA and
            leasing properties nearby.
          </p>
        </div>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {SERVICE_CITIES.map((city) => (
            <li key={city.name}>
              <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white">
                {city.name}
              </span>
            </li>
          ))}
          <li>
            <span className="inline-flex rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
              + Bay Area
            </span>
          </li>
        </ul>

        <p className="mt-8 text-center text-sm text-gray-500">
          Not sure if we cover your neighborhood?{" "}
          <a
            href={`tel:${BUSINESS.phone}`}
            className="font-medium text-blue-400 transition-colors hover:text-blue-300"
          >
            Call {BUSINESS.phoneDisplay}
          </a>
        </p>

        <div className="mt-14 border-t border-white/10 pt-10">
          <h3 className="text-center text-lg font-semibold text-white">
            Common questions
          </h3>
          <div className="mt-6 space-y-3">
            {LOCAL_FAQS.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-white/10 bg-white/[0.03] px-5 py-1 open:bg-white/[0.05]"
              >
                <summary className="cursor-pointer list-none py-3 text-sm font-medium text-white marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-4">
                    {faq.question}
                    <span className="text-blue-400 transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="pb-4 text-sm leading-relaxed text-gray-400">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
