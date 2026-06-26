"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";

const OVAL_PATH =
  "M 15,15 H 85 Q 99,15 99,30 V 70 Q 100,85 85,85 H 15 Q 1,85 0,70 V 30 Q 1,15 15,15 Z";

const steps = [
  {
    title: "Pre-Inspection & Triage",
    shortLabel: "Inspect",
    description:
      "Walk the property with the client to flag pre-existing damage, then verify exterior spigots for adequate GPM flow before work begins.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          opacity="0.5"
          d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
          fill="currentColor"
        />
        <path
          d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0H9Zm2 7h4M9 13h4M9 17h2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Property Protection",
    shortLabel: "Protect",
    description:
      "Close and seal windows, doors, and outlets. Pre-soak landscaping and cover delicate beds so chemicals never burn plants.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          opacity="0.5"
          d="M3 10.4167C3 7.21907 3 5.62028 3.37752 5.08241C3.75503 4.54454 5.25832 4.02996 8.26491 3.00079L8.83772 2.80472C10.405 2.26824 11.1886 2 12 2C12.8114 2 13.595 2.26824 15.1623 2.80472L15.7351 3.00079C18.7417 4.02996 20.245 4.54454 20.6225 5.08241C21 5.62028 21 7.21907 21 10.4167V11.9914C21 17.6294 16.761 20.3655 14.1014 21.5273C13.38 21.8424 13.0193 22 12 22C10.9807 22 10.62 21.8424 9.89856 21.5273C7.23896 20.3655 3 17.6294 3 11.9914V10.4167Z"
          fill="currentColor"
        />
        <path
          d="M13.5 15C13.5 15.5523 13.0523 16 12.5 16H11.5C10.9477 16 10.5 15.5523 10.5 15V13.5987C9.6033 13.0799 9 12.1104 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.1104 14.3967 13.0799 13.5 13.5987V15Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Chemical Pre-Treatment",
    shortLabel: "Soft Wash",
    description:
      "Apply eco-friendly detergents with a soft wash system — never blast siding with direct pressure. Let chemicals dwell 5–10 minutes.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          opacity="0.5"
          d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69Z"
          fill="currentColor"
        />
        <path
          d="M12 6v8M9 11l3 3 3-3"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Surface Cleaning",
    shortLabel: "Clean",
    description:
      "Use a commercial flat surface cleaner on driveways and patios, then detail corners and vertical surfaces with the proper nozzle angle.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          opacity="0.5"
          d="M4 18h16M6 18V8l6-3 6 3v10M10 18v-4h4v4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Systematic Rinsing",
    shortLabel: "Rinse",
    description:
      "Rinse top-to-bottom so runoff flows over uncleaned areas, then flush all plants, walkways, and siding to remove residual chemicals.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          opacity="0.5"
          d="M12 3c3.5 4 6 6.5 6 9.5a6 6 0 1 1-12 0C6 9.5 8.5 7 12 3Z"
          fill="currentColor"
        />
        <path
          d="M8 19h8M10 22h4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Final Walkthrough",
    shortLabel: "Sign-Off",
    description:
      "Walk the finished property with the client, collect payment on-site, and request a Google review to build your reputation.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          opacity="0.5"
          d="M9 12l2 2 4-4M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const circlePositions = [
  { x: "30%", y: "15%" },
  { x: "70%", y: "15%" },
  { x: "99%", y: "50%" },
  { x: "70%", y: "85%" },
  { x: "30%", y: "85%" },
  { x: "1%", y: "50%" },
];

const MOBILE_STEP_MS = 8000;
const DESKTOP_STEP_MS = 8000;

function useProcessCarousel(intervalMs: number, mediaQuery: string) {
  const [activeIndex, setActiveIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const prefersReducedMotion = useRef(false);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    clearTimer();
    if (prefersReducedMotion.current) return;

    timerRef.current = setInterval(() => {
      setActiveIndex((index) => (index + 1) % steps.length);
    }, intervalMs);
  }, [clearTimer, intervalMs]);

  const goToStep = useCallback(
    (index: number) => {
      setActiveIndex(index);
      startTimer();
    },
    [startTimer]
  );

  const goNext = useCallback(() => {
    setActiveIndex((index) => (index + 1) % steps.length);
    startTimer();
  }, [startTimer]);

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const mq = window.matchMedia(mediaQuery);
    const syncTimer = () => {
      if (mq.matches) startTimer();
      else clearTimer();
    };

    syncTimer();
    mq.addEventListener("change", syncTimer);
    return () => {
      mq.removeEventListener("change", syncTimer);
      clearTimer();
    };
  }, [clearTimer, mediaQuery, startTimer]);

  return {
    activeIndex,
    activeStep: steps[activeIndex],
    goToStep,
    goNext,
  };
}

function ProcessMobileCarousel() {
  const { activeIndex, activeStep, goToStep, goNext } = useProcessCarousel(
    MOBILE_STEP_MS,
    "(max-width: 767px)"
  );

  return (
    <div className="process-mobile md:hidden">
      <button
        type="button"
        className="process-mobile-card process-mobile-card--interactive"
        onClick={goNext}
        aria-label={`Step ${activeIndex + 1}: ${activeStep.title}. Tap for next step.`}
      >
        <div className="process-mobile-icon">{activeStep.icon}</div>
        <div className="text-left">
          <span className="process-mobile-step">
            Step {activeIndex + 1} of {steps.length}
          </span>
          <h3 className="process-mobile-title">{activeStep.title}</h3>
          <p className="process-mobile-text">{activeStep.description}</p>
          <p className="process-mobile-hint">Tap for next step</p>
        </div>
      </button>

      <div className="process-mobile-dots" role="tablist" aria-label="Process steps">
        {steps.map((step, index) => (
          <button
            key={`dot-${step.title}`}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={`Go to step ${index + 1}: ${step.title}`}
            className={`process-mobile-dot${
              index === activeIndex ? " is-active" : ""
            }`}
            onClick={() => goToStep(index)}
          />
        ))}
      </div>
    </div>
  );
}

function ProcessDesktopDiagram() {
  const { activeIndex, activeStep, goToStep } = useProcessCarousel(
    DESKTOP_STEP_MS,
    "(min-width: 768px)"
  );

  return (
    <div
      className="process-diagram process-diagram--interactive mx-auto hidden max-w-3xl md:block"
      role="tablist"
      aria-label="Process steps"
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="process-oval" d={OVAL_PATH} />
        <path className="process-path-line" d={OVAL_PATH} />
      </svg>

      {steps.map((step, index) => (
        <button
          key={step.title}
          type="button"
          role="tab"
          aria-selected={index === activeIndex}
          aria-label={`Step ${index + 1}: ${step.title}`}
          className={`process-node process-node--interactive${
            index === activeIndex ? " is-active" : ""
          }`}
          style={
            {
              "--circle-x": circlePositions[index].x,
              "--circle-y": circlePositions[index].y,
            } as CSSProperties
          }
          onClick={() => goToStep(index)}
        >
          <div className="process-node-icon">{step.icon}</div>
          <span className="process-node-label">{step.shortLabel}</span>
        </button>
      ))}

      <div
        key={activeIndex}
        className="process-detail-card process-detail-card--interactive is-active animate-fade-in-up"
        role="tabpanel"
        aria-live="polite"
      >
        <span className="process-detail-step">
          Step {activeIndex + 1} of {steps.length}
        </span>
        <h3 className="process-detail-title">{activeStep.title}</h3>
        <p className="process-detail-text">{activeStep.description}</p>
      </div>
    </div>
  );
}

export default function Process() {
  return (
    <section
      id="process"
      aria-labelledby="process-title"
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
            How We Work
          </p>
          <h2
            id="process-title"
            className="text-4xl font-bold tracking-tight text-white sm:text-5xl"
          >
            Our 6-Step Process
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-400">
            A standardized workflow that guarantees consistent quality, prevents
            property damage, and ensures every client is completely satisfied.
          </p>
        </div>

        <ProcessDesktopDiagram />

        <ProcessMobileCarousel />
      </div>
    </section>
  );
}
