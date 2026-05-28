"use client";

import { useState, useRef, useCallback } from "react";

interface AnalysisResult {
  surface: string;
  area: string;
  condition: "Light" | "Moderate" | "Heavy";
  service: string;
  costLow: number;
  costHigh: number;
}

const SURFACES = [
  "Concrete Driveway",
  "Wooden Deck",
  "Brick Patio",
  "Vinyl Siding",
  "Stone Walkway",
  "Composite Deck",
  "Stucco Wall",
];

const SERVICES = [
  "Standard Power Wash",
  "Deep Clean Power Wash",
  "Soft Wash Treatment",
  "Surface Restoration Wash",
];

const CONDITIONS: AnalysisResult["condition"][] = ["Light", "Moderate", "Heavy"];

function generateAnalysis(): AnalysisResult {
  const surface = SURFACES[Math.floor(Math.random() * SURFACES.length)];
  const area = `~${Math.floor(Math.random() * 800 + 200)} sq ft`;
  const condition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
  const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
  const base = Math.floor(Math.random() * 150 + 100);
  const costLow = base;
  const costHigh = base + Math.floor(Math.random() * 150 + 75);
  return { surface, area, condition, service, costLow, costHigh };
}

function conditionColor(condition: AnalysisResult["condition"]): string {
  switch (condition) {
    case "Light":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "Moderate":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "Heavy":
      return "bg-red-500/20 text-red-400 border-red-500/30";
  }
}

export default function AIEstimator() {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [details, setDetails] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setResult(null);
      setAnalyzing(true);
      const delay = Math.random() * 1000 + 2000;
      setTimeout(() => {
        setAnalyzing(false);
        setResult(generateAnalysis());
      }, delay);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const adjustedCost = (base: number) => {
    if (details.trim().length > 10) return base + Math.floor(base * 0.15);
    return base;
  };

  return (
    <section id="estimator" className="relative overflow-hidden">
      <div className="section-container">
        <h2 className="section-title">AI-Powered Instant Estimator</h2>
        <p className="section-subtitle">
          Upload a photo of your property and get an instant cost estimate
        </p>

        {/* How it works */}
        <div className="mx-auto mb-12 grid max-w-4xl gap-6 sm:grid-cols-3">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              ),
              step: "1",
              text: "Upload a photo of the area you need cleaned",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              ),
              step: "2",
              text: "Our AI analyzes the surface type, area size, and condition",
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                </svg>
              ),
              step: "3",
              text: "Get an instant estimate and book your service",
            },
          ].map(({ icon, step, text }) => (
            <div
              key={step}
              className="glass-card flex flex-col items-center gap-4 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
                {icon}
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--text-muted)]">
                Step {step}
              </span>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {text}
              </p>
            </div>
          ))}
        </div>

        {/* Upload + Results */}
        <div className="mx-auto max-w-3xl">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`glass-card-elevated cursor-pointer transition-all duration-300 ${
              dragOver
                ? "border-[var(--primary)] shadow-[0_0_30px_var(--primary-glow)]"
                : ""
            } ${preview ? "p-4" : "py-16"}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleInputChange}
              className="hidden"
            />

            {!preview ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--primary)]/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-10 w-10 text-[var(--primary)]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-lg font-semibold text-[var(--text)]">
                    Click to upload or drag &amp; drop
                  </p>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    JPG, PNG, or WebP — Max 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl">
                <img
                  src={preview}
                  alt="Uploaded property"
                  className="h-64 w-full object-cover rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Analysis panel */}
          {(analyzing || result) && (
            <div className="mt-6 animate-fade-in-up glass-card-elevated">
              {analyzing ? (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="relative h-16 w-16">
                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-[var(--primary)]" />
                    <div className="absolute inset-2 animate-spin rounded-full border-4 border-transparent border-b-[var(--accent)]" style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                  </div>
                  <p className="text-sm font-medium text-[var(--text-secondary)]">
                    Analyzing your property...
                  </p>
                  <div className="h-1.5 w-48 overflow-hidden rounded-full bg-[var(--bg-card)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                      style={{ animation: "progressBar 2.5s ease-in-out forwards" }}
                    />
                  </div>
                  <style>{`
                    @keyframes progressBar {
                      from { width: 0%; }
                      to { width: 100%; }
                    }
                  `}</style>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-[var(--text)]">
                      AI Analysis Results
                    </h3>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-[var(--bg-card)] p-4 border border-[var(--border)]">
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                        Detected Surface
                      </span>
                      <p className="mt-1 text-base font-semibold text-[var(--text)]">
                        {result.surface}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[var(--bg-card)] p-4 border border-[var(--border)]">
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                        Estimated Area
                      </span>
                      <p className="mt-1 text-base font-semibold text-[var(--text)]">
                        {result.area}
                      </p>
                    </div>
                    <div className="rounded-xl bg-[var(--bg-card)] p-4 border border-[var(--border)]">
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                        Condition Level
                      </span>
                      <p className="mt-1">
                        <span
                          className={`inline-block rounded-full border px-3 py-0.5 text-sm font-semibold ${conditionColor(result.condition)}`}
                        >
                          {result.condition}
                        </span>
                      </p>
                    </div>
                    <div className="rounded-xl bg-[var(--bg-card)] p-4 border border-[var(--border)]">
                      <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                        Recommended Service
                      </span>
                      <p className="mt-1 text-base font-semibold text-[var(--text)]">
                        {result.service}
                      </p>
                    </div>
                  </div>

                  {/* Cost estimate */}
                  <div className="rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-6 text-center">
                    <span className="text-sm font-medium uppercase tracking-wider text-[var(--text-muted)]">
                      Estimated Cost
                    </span>
                    <p className="mt-2 text-3xl font-extrabold text-[var(--primary)]">
                      ${adjustedCost(result.costLow)} – ${adjustedCost(result.costHigh)}
                    </p>
                    {details.trim().length > 10 && (
                      <p className="mt-1 text-xs text-[var(--text-muted)]">
                        Adjusted for additional complexity
                      </p>
                    )}
                  </div>

                  <p className="text-center text-xs text-[var(--text-muted)]">
                    This is an AI estimate. Final pricing may vary based on on-site assessment.
                  </p>

                  {/* Additional details */}
                  <div>
                    <label
                      htmlFor="extra-details"
                      className="mb-2 block text-sm font-medium text-[var(--text-secondary)]"
                    >
                      Describe any additional details or complexity
                    </label>
                    <textarea
                      id="extra-details"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      placeholder="e.g., heavy oil stains, second story, steep driveway, multiple surfaces..."
                      className="form-input form-textarea"
                      rows={3}
                    />
                  </div>

                  {/* CTAs */}
                  <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <a
                      href="#contact"
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[var(--primary-glow)] transition-transform hover:scale-105"
                    >
                      Book This Service
                    </a>
                    <a
                      href="#contact"
                      className="inline-flex items-center justify-center rounded-full border border-[var(--border)] px-8 py-3 text-sm font-bold uppercase tracking-wider text-[var(--text)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                    >
                      Get Exact Quote
                    </a>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
