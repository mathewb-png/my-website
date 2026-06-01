"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { prepareEstimateImage } from "@/lib/prepareEstimateImage";

interface AnalysisResult {
  surface: string;
  area: string;
  areaSqFt?: number;
  referenceUsed?: string;
  dimensions?: string;
  condition: "Light" | "Moderate" | "Heavy";
  conditionNotes?: string;
  service: string;
  costLow: number;
  costHigh: number;
  confidence?: "high" | "medium" | "low" | string;
  notes?: string;
}

interface BookingForm {
  name: string;
  email: string;
  phone: string;
  address: string;
  preferredDate: string;
  notes: string;
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
  const [isMobile, setIsMobile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [analysisError, setAnalysisError] = useState("");
  const [referenceDimension, setReferenceDimension] = useState("");
  const [overrideSqFt, setOverrideSqFt] = useState("");
  const [reanalyzing, setReanalyzing] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState<BookingForm>({
    name: "", email: "", phone: "", address: "", preferredDate: "", notes: "",
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const callEstimateAPI = useCallback(async (base64: string, detailsText: string): Promise<AnalysisResult> => {
    const res = await fetch("/api/estimate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: base64,
        details: detailsText,
        referenceDimension: referenceDimension || undefined,
        overrideSqFt: overrideSqFt ? Number(overrideSqFt) : undefined,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Analysis failed (${res.status})`);
    }
    return data.result as AnalysisResult;
  }, [referenceDimension, overrideSqFt]);

  const scrollToResults = useCallback(() => {
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }, []);

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setShowBooking(false);
    setBookingSuccess(false);
    setAnalysisError("");
    setResult(null);
    setAnalyzing(true);
    scrollToResults();

    try {
      const dataUrl = await prepareEstimateImage(file);
      setPreview(dataUrl);
      setImageDataUrl(dataUrl);
      const apiResult = await callEstimateAPI(dataUrl, details);
      setResult(apiResult);
      scrollToResults();
    } catch (error) {
      setPreview(null);
      setImageDataUrl(null);
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Could not analyze this photo. Please try again with a clearer image."
      );
    } finally {
      setAnalyzing(false);
    }
  }, [callEstimateAPI, details, scrollToResults]);

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

  const openCamera = () => cameraInputRef.current?.click();
  const openGallery = () => fileInputRef.current?.click();

  const handleReanalyze = useCallback(async () => {
    if (!imageDataUrl) return;
    setReanalyzing(true);
    setAnalysisError("");
    try {
      const apiResult = await callEstimateAPI(imageDataUrl, details);
      setResult(apiResult);
    } catch (error) {
      setAnalysisError(
        error instanceof Error
          ? error.message
          : "Re-analysis failed. Please try again."
      );
    } finally {
      setReanalyzing(false);
    }
  }, [imageDataUrl, details, callEstimateAPI]);

  const handleBookingSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!result) return;
    setBookingLoading(true);
    setBookingError("");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bookingForm,
          estimate: {
            surface: result.surface,
            area: result.area,
            areaSqFt: result.areaSqFt,
            dimensions: result.dimensions,
            condition: result.condition,
            service: result.service,
            costLow: adjustedCost(result.costLow),
            costHigh: adjustedCost(result.costHigh),
          },
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setBookingSuccess(true);
      setShowBooking(false);
    } catch {
      setBookingError("Something went wrong. Please try again or call us directly.");
    } finally {
      setBookingLoading(false);
    }
  }, [result, bookingForm, adjustedCost]);

  const bookingInputClasses = `w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[var(--text)]
    placeholder-[var(--text-muted)] outline-none transition-all duration-200
    focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20`;

  return (
    <>
    {/* Mobile floating CTA — visible before user scrolls to estimator */}
    {isMobile && !preview && (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[900] md:hidden">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          capture="environment"
          onChange={handleInputChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={openCamera}
          aria-label="Get instant quote from a property photo"
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[var(--primary-glow)] active:scale-95 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
            <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
            <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3H4.5a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z" clipRule="evenodd" />
          </svg>
          Get Instant Quote
        </button>
      </div>
    )}

    <section ref={sectionRef} id="estimator" aria-labelledby="estimator-title" className="estimator-section relative overflow-hidden">
      {/* Dark overlay so content stays readable */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[var(--bg)]/90 via-[var(--bg)]/70 to-[var(--bg)]/90" />

      <div className="section-container relative z-[2]">
        <h2 id="estimator-title" className="section-title">AI-Powered Instant Estimator</h2>
        <p className="section-subtitle">
          Upload a photo of your property and get an instant cost estimate
        </p>

        {/* How it works — horizontal scroll on mobile */}
        <div className="mx-auto mb-12 max-w-4xl">
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0 scrollbar-hide">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                ),
                step: "1",
                text: "Snap a photo or upload from gallery",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-8 w-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                  </svg>
                ),
                step: "2",
                text: "Our AI analyzes surface type, area size & condition",
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
                className="glass-card flex min-w-[75vw] flex-col items-center gap-4 text-center snap-center md:min-w-0"
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
        </div>

        {/* Upload + Results */}
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 sm:p-5">
            <p className="text-sm font-semibold text-[var(--text)]">
              For the most accurate estimate
            </p>
            <ul className="mt-2 space-y-1 text-sm text-[var(--text-secondary)]">
              <li>• Stand back so the full surface is visible</li>
              <li>• Include a scale reference (garage door, car, or known width)</li>
              <li>• Shoot in daylight, keep the camera level, avoid heavy glare</li>
            </ul>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="ref-dimension-top" className="mb-1 block text-xs font-medium text-[var(--text-muted)]">
                  Reference measurement (optional)
                </label>
                <input
                  id="ref-dimension-top"
                  type="text"
                  value={referenceDimension}
                  onChange={(e) => setReferenceDimension(e.target.value)}
                  placeholder="e.g., driveway is 20 ft wide"
                  className="form-input text-xs"
                />
              </div>
              <div>
                <label htmlFor="override-sqft-top" className="mb-1 block text-xs font-medium text-[var(--text-muted)]">
                  Known sq ft (optional)
                </label>
                <input
                  id="override-sqft-top"
                  type="number"
                  value={overrideSqFt}
                  onChange={(e) => setOverrideSqFt(e.target.value)}
                  placeholder="e.g., 400"
                  className="form-input text-xs"
                />
              </div>
            </div>
          </div>
          {/* Mobile: dual action buttons */}
          {isMobile && !preview && (
            <div className="mb-6 flex gap-3">
              <button
                onClick={openCamera}
                className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-[var(--primary)]/30 bg-[var(--primary)]/5 p-6 text-center active:scale-95 transition-transform"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--primary)]/15">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-[var(--primary)]">
                    <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                    <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 01-3 3H4.5a3 3 0 01-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 001.11-.71l.822-1.315a2.942 2.942 0 012.332-1.39zM6.75 12.75a5.25 5.25 0 1110.5 0 5.25 5.25 0 01-10.5 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-[var(--text)]">Take Photo</span>
                <span className="text-xs text-[var(--text-muted)]">Open camera</span>
              </button>
              <button
                onClick={openGallery}
                className="flex flex-1 flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-6 text-center active:scale-95 transition-transform"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-[var(--text-secondary)]">
                    <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-bold text-[var(--text)]">Upload Photo</span>
                <span className="text-xs text-[var(--text-muted)]">From gallery</span>
              </button>
            </div>
          )}

          {/* Drop zone — desktop or after upload */}
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
            } ${preview ? "p-4" : "py-16"} ${isMobile && !preview ? "hidden" : ""}`}
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
                  className="h-64 w-full object-cover rounded-xl md:h-64"
                />
                {isMobile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreview(null);
                      setImageDataUrl(null);
                      setResult(null);
                      setAnalysisError("");
                      setAnalyzing(false);
                    }}
                    className="mt-3 w-full rounded-xl border border-white/10 py-2.5 text-sm font-medium text-[var(--text-muted)] active:scale-95 transition-transform"
                  >
                    Retake Photo
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Analysis panel */}
          {(analyzing || result || analysisError) && (
            <div ref={resultRef} className="mt-6 animate-fade-in-up glass-card-elevated">
              {analysisError && !analyzing && !result && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-center">
                  <p className="text-sm font-semibold text-red-300">Could not analyze photo</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {analysisError}
                  </p>
                  <p className="mt-3 text-xs text-[var(--text-muted)]">
                    Tip: add a reference measurement below the upload area, or enter known sq ft before uploading.
                  </p>
                </div>
              )}
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
                    <div className="animate-progress-bar h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]" />
                  </div>
                </div>
              ) : result ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/15 text-green-400">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--text)]">
                        AI Analysis Results
                      </h3>
                      {result.confidence && (
                        <p className="text-xs text-[var(--text-muted)]">
                          Confidence: {result.confidence}
                        </p>
                      )}
                    </div>
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
                      {result.dimensions && (
                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                          Dimensions: {result.dimensions}
                        </p>
                      )}
                      {result.referenceUsed && (
                        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
                          Scale ref: {result.referenceUsed}
                        </p>
                      )}
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

                  {/* Condition & general notes from API */}
                  {(result.conditionNotes || result.notes) && (
                    <div className="space-y-3">
                      {result.conditionNotes && (
                        <div className="rounded-xl bg-[var(--bg-card)] p-4 border border-[var(--border)]">
                          <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                            Condition Details
                          </span>
                          <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {result.conditionNotes}
                          </p>
                        </div>
                      )}
                      {result.notes && (
                        <div className="rounded-xl bg-[var(--bg-card)] p-4 border border-[var(--border)]">
                          <span className="text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                            Additional Notes
                          </span>
                          <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                            {result.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

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

                    {/* Reference dimension & sq ft override */}
                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div>
                        <label htmlFor="ref-dimension" className="mb-1 block text-xs font-medium text-[var(--text-muted)]">
                          Reference measurement
                        </label>
                        <input
                          id="ref-dimension"
                          type="text"
                          value={referenceDimension}
                          onChange={(e) => setReferenceDimension(e.target.value)}
                          placeholder="e.g., driveway is 20ft wide"
                          className="form-input text-xs"
                        />
                      </div>
                      <div>
                        <label htmlFor="override-sqft" className="mb-1 block text-xs font-medium text-[var(--text-muted)]">
                          Known sq ft override
                        </label>
                        <input
                          id="override-sqft"
                          type="number"
                          value={overrideSqFt}
                          onChange={(e) => setOverrideSqFt(e.target.value)}
                          placeholder="e.g., 400"
                          className="form-input text-xs"
                        />
                      </div>
                    </div>
                    {imageDataUrl && (
                      <button
                        onClick={handleReanalyze}
                        disabled={reanalyzing}
                        className="mt-3 inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/5 px-5 py-2 text-sm font-semibold text-[var(--primary)] transition-all hover:bg-[var(--primary)]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {reanalyzing ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-[var(--primary)]" />
                            Re-analyzing...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                              <path fillRule="evenodd" d="M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H4.598a.75.75 0 00-.75.75v3.634a.75.75 0 001.5 0v-2.033l.312.311a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm-6.073-8.85a7 7 0 00-11.712 3.139.75.75 0 001.449.389 5.5 5.5 0 019.201-2.466l.312.311H6.056a.75.75 0 100 1.5h3.634a.75.75 0 00.75-.75V1.063a.75.75 0 00-1.5 0v2.033l-.312-.311a6.97 6.97 0 00-.389-.21z" clipRule="evenodd" />
                            </svg>
                            Re-analyze with Details
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Booking section */}
                  {bookingSuccess ? (
                    <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-6 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/15">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-green-400">
                          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-bold text-[var(--text)]">Booking Request Sent!</h4>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        We&apos;ll contact you within 24 hours to confirm your appointment.
                      </p>
                    </div>
                  ) : showBooking ? (
                    <form onSubmit={handleBookingSubmit} className="space-y-4 rounded-xl border border-[var(--primary)]/20 bg-[var(--primary)]/5 p-6">
                      <h4 className="text-lg font-bold text-[var(--text)]">Book This Service</h4>
                      <p className="text-xs text-[var(--text-muted)]">
                        {result.surface} &bull; {result.area} &bull; {result.condition} condition &bull; ${adjustedCost(result.costLow)}–${adjustedCost(result.costHigh)}
                      </p>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input
                          type="text" required placeholder="Full Name"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm(f => ({ ...f, name: e.target.value }))}
                          className={bookingInputClasses}
                        />
                        <input
                          type="email" required placeholder="Email"
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm(f => ({ ...f, email: e.target.value }))}
                          className={bookingInputClasses}
                        />
                        <input
                          type="tel" required placeholder="Phone Number"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm(f => ({ ...f, phone: e.target.value }))}
                          className={bookingInputClasses}
                        />
                        <input
                          type="text" required placeholder="Service Address"
                          value={bookingForm.address}
                          onChange={(e) => setBookingForm(f => ({ ...f, address: e.target.value }))}
                          className={bookingInputClasses}
                        />
                      </div>
                      <input
                        type="date" placeholder="Preferred Date"
                        value={bookingForm.preferredDate}
                        onChange={(e) => setBookingForm(f => ({ ...f, preferredDate: e.target.value }))}
                        className={bookingInputClasses}
                      />
                      <textarea
                        placeholder="Any additional notes..."
                        rows={2}
                        value={bookingForm.notes}
                        onChange={(e) => setBookingForm(f => ({ ...f, notes: e.target.value }))}
                        className={`${bookingInputClasses} resize-none`}
                      />

                      {bookingError && (
                        <p className="text-sm text-red-400">{bookingError}</p>
                      )}

                      <div className="flex gap-3">
                        <button
                          type="submit"
                          disabled={bookingLoading}
                          className="flex-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] py-3 text-sm font-bold text-white shadow-lg shadow-[var(--primary-glow)] transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {bookingLoading ? "Sending..." : "Confirm Booking Request"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowBooking(false)}
                          className="rounded-full border border-[var(--border)] px-5 py-3 text-sm font-medium text-[var(--text-muted)] transition-colors hover:border-[var(--primary)]"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                      <button
                        onClick={() => setShowBooking(true)}
                        className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-[var(--primary-glow)] transition-transform hover:scale-105"
                      >
                        Book This Service
                      </button>
                      <a
                        href="tel:+19255184931"
                        className="inline-flex items-center justify-center rounded-full border border-[var(--border)] px-8 py-3 text-sm font-bold uppercase tracking-wider text-[var(--text)] transition-colors hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      >
                        Call for Exact Quote
                      </a>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
    </>
  );
}
