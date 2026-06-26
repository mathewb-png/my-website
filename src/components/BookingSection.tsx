"use client";

import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import LiquidBackground from "./LiquidBackground";

interface BookingData {
  name: string;
  email: string;
  phone: string;
  date: string;
  timeSlot: string;
  serviceType: "contactless" | "contact" | "";
}

const initialBooking: BookingData = {
  name: "",
  email: "",
  phone: "",
  date: "",
  timeSlot: "",
  serviceType: "",
};

const TIME_SLOTS = [
  { id: "morning", label: "Morning", detail: "8 AM - 11 AM" },
  { id: "midday", label: "Midday", detail: "11 AM - 2 PM" },
  { id: "afternoon", label: "Afternoon", detail: "2 PM - 5 PM" },
];

const SERVICE_TYPES = [
  {
    id: "contactless" as const,
    label: "Contactless",
    description: "We arrive, clean, and send photos when done",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: "contact" as const,
    label: "Contact",
    description: "Meet on-site for a walkthrough before we start",
    icon: (
      <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="h-6 w-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
  },
];

const VENMO_URL =
  "https://venmo.com/code?user_id=4154179996092204600&created=1782494180.491504&printed=1";

function getMinDate(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split("T")[0];
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split("-");
  return new Date(Number(year), Number(month) - 1, Number(day)).toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" }
  );
}

export default function BookingSection() {
  const [booking, setBooking] = useState<BookingData>(initialBooking);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.focus();
    }
  }, [error]);

  useEffect(() => {
    if (submitted && confirmRef.current) {
      confirmRef.current.focus();
    }
  }, [submitted]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    setBooking((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!booking.timeSlot || !booking.serviceType) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "cdb4f08d-26f3-46ff-aca0-9e35349d14cd",
          subject: `New Booking - ${formatDate(booking.date)} - ${booking.name}`,
          from_name: booking.name,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          date: formatDate(booking.date),
          time_slot: TIME_SLOTS.find((s) => s.id === booking.timeSlot)?.label ?? booking.timeSlot,
          service_type: booking.serviceType === "contactless" ? "Contactless" : "Contact (On-site walkthrough)",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClasses = `w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900
    placeholder-gray-500 outline-none transition-all duration-200
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white`;

  if (submitted) {
    return (
      <section id="book" aria-labelledby="book-confirm-title" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
        <LiquidBackground className="z-0 opacity-70" />
        <div aria-hidden="true" className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] z-[1]" />
        <div aria-hidden="true" className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-[100px] z-[1]" />

        <div className="relative z-[2] mx-auto max-w-2xl text-center">
          <div aria-hidden="true" className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2
            id="book-confirm-title"
            ref={confirmRef}
            tabIndex={-1}
            className="text-3xl font-bold text-gray-900 mb-2 outline-none"
          >
            Booking Confirmed!
          </h2>
          <p className="text-gray-700 mb-2">
            {formatDate(booking.date)} &middot;{" "}
            {TIME_SLOTS.find((s) => s.id === booking.timeSlot)?.label}{" "}
            ({TIME_SLOTS.find((s) => s.id === booking.timeSlot)?.detail})
          </p>
          <p className="text-gray-600 text-sm mb-10">
            We&apos;ll confirm your appointment within 24 hours.
          </p>

          {/* Venmo deposit card */}
          <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-blue-500/5">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure Your Spot</h3>
            <p className="text-gray-600 text-sm mb-6">
              A $50 deposit secures your time slot. Remaining balance is due upon completion.
            </p>
            <a
              href={VENMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl px-8 py-4 text-base font-semibold text-white
                shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              style={{ backgroundColor: "#008CFF" }}
              aria-label="Pay $50 deposit with Venmo (opens in new tab)"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 fill-current">
                <path d="M19.5 3c.9 1.5 1.3 3.1 1.3 5.1 0 5.7-4.8 13-8.7 18.2H5.8L3.2 3.6l5.8-.5 1.5 11.8c1.4-2.3 3.1-5.8 3.1-8.2 0-1.9-.3-3.2-.8-4.2L19.5 3z" />
              </svg>
              Pay $50 Deposit with Venmo
            </a>
            <p className="mt-4 text-xs text-gray-600">
              Opens Venmo app or website. You can also pay in full upfront.
            </p>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              setBooking(initialBooking);
            }}
            className="mt-8 text-sm text-gray-600 hover:text-gray-900 transition-colors underline underline-offset-4
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 rounded"
          >
            Book another appointment
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="book" aria-labelledby="book-title" className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white">
      <LiquidBackground className="z-0 opacity-70" />
      <div aria-hidden="true" className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] z-[1]" />
      <div aria-hidden="true" className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-[100px] z-[1]" />

      <div className="relative z-[2] mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 id="book-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Book Your Service
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Pick a date and time that works for you. We&apos;ll confirm within 24 hours.
          </p>
        </div>

        <form onSubmit={handleSubmit} aria-label="Book a service appointment" className="rounded-2xl border border-gray-200 bg-white p-6 sm:p-10 shadow-xl shadow-blue-500/5 space-y-8">
          {/* Date + Time */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold uppercase tracking-wider text-gray-600">
              When
            </legend>
            <div>
              <label htmlFor="book-date" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                id="book-date"
                name="date"
                required
                min={getMinDate()}
                value={booking.date}
                onChange={handleChange}
                className={inputClasses}
              />
            </div>

            <div role="group" aria-labelledby="timeslot-label">
              <p id="timeslot-label" className="text-sm font-medium text-gray-700 mb-3">
                Time Slot <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-3 gap-3">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot.id}
                    type="button"
                    aria-pressed={booking.timeSlot === slot.id}
                    onClick={() => setBooking((prev) => ({ ...prev, timeSlot: slot.id }))}
                    className={`rounded-xl border min-h-[48px] px-3 py-3 text-center transition-all duration-200
                      focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                      booking.timeSlot === slot.id
                        ? "border-blue-500 bg-blue-50 text-blue-800 ring-2 ring-blue-500/30"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-blue-300 hover:text-gray-900"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{slot.label}</span>
                    <span className="block text-xs mt-0.5 text-gray-600">{slot.detail}</span>
                  </button>
                ))}
              </div>
            </div>
          </fieldset>

          {/* Service Type */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold uppercase tracking-wider text-gray-600">
              Service Style <span className="text-red-500">*</span>
            </legend>
            <div role="group" aria-label="Choose service style" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SERVICE_TYPES.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  aria-pressed={booking.serviceType === type.id}
                  onClick={() => setBooking((prev) => ({ ...prev, serviceType: type.id }))}
                  className={`flex items-start gap-4 rounded-xl border p-5 min-h-[48px] text-left transition-all duration-200
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${
                    booking.serviceType === type.id
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/30"
                      : "border-gray-200 bg-gray-50 hover:border-blue-300"
                  }`}
                >
                  <div className={`shrink-0 ${booking.serviceType === type.id ? "text-blue-600" : "text-gray-500"}`}>
                    {type.icon}
                  </div>
                  <div>
                    <span className={`block text-sm font-semibold ${booking.serviceType === type.id ? "text-gray-900" : "text-gray-700"}`}>
                      {type.label}
                    </span>
                    <span className="block text-xs text-gray-600 mt-1">{type.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </fieldset>

          {/* Contact Info */}
          <fieldset className="space-y-4">
            <legend className="text-sm font-semibold uppercase tracking-wider text-gray-600">
              Your Info
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="book-name" className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="book-name"
                  name="name"
                  required
                  autoComplete="name"
                  value={booking.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={inputClasses}
                />
              </div>
              <div>
                <label htmlFor="book-phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  id="book-phone"
                  name="phone"
                  required
                  autoComplete="tel"
                  value={booking.phone}
                  onChange={handleChange}
                  placeholder="(925) 555-0123"
                  className={inputClasses}
                />
              </div>
            </div>
            <div>
              <label htmlFor="book-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="book-email"
                name="email"
                required
                autoComplete="email"
                value={booking.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={inputClasses}
              />
            </div>
          </fieldset>

          {/* Error */}
          {error && (
            <div
              ref={errorRef}
              role="alert"
              aria-live="assertive"
              tabIndex={-1}
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 outline-none"
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !booking.timeSlot || !booking.serviceType}
            aria-disabled={loading || !booking.timeSlot || !booking.serviceType}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-4 px-6
              text-base font-semibold text-white shadow-lg shadow-blue-500/25
              transition-all duration-200
              hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg aria-hidden="true" className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span role="status">Booking...</span>
              </span>
            ) : (
              "Confirm Booking"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}
