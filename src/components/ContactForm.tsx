"use client";

import { useState, type FormEvent, type ChangeEvent } from "react";
import LiquidBackground from "./LiquidBackground";

interface FormData {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  message: string;
}

const initialFormData: FormData = {
  name: "",
  email: "",
  phone: "",
  propertyType: "",
  message: "",
};

const propertyTypes = [
  "Residential",
  "HOA/Community",
  "Leasing Office",
  "Other",
];

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "cdb4f08d-26f3-46ff-aca0-9e35349d14cd",
          subject: `New Contact — ${formData.propertyType || "General"} — ${formData.name}`,
          from_name: formData.name,
          ...formData,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setFormData(initialFormData);
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
    placeholder-gray-400 outline-none transition-all duration-200
    focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:bg-white`;

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white"
    >
      <LiquidBackground className="z-0 opacity-70" />
      {/* Blue glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] z-[1]" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-400/15 rounded-full blur-[100px] z-[1]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-300/10 rounded-full blur-[150px] z-[1]" />

      <div className="relative z-[2] mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 id="contact-title" className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Get In Touch
          </h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Ready to transform your property? Let&apos;s talk.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Form */}
          <div
            className="lg:col-span-3 rounded-2xl border border-gray-200 bg-white p-8 sm:p-10
              shadow-xl shadow-blue-500/5"
          >
            {success ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <svg
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                  Message Sent!
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm">
                  Thanks for reaching out. We&apos;ll get back to you within 24
                  hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-medium
                    text-gray-700 transition hover:bg-gray-50"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="(925) 518-4931"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="propertyType"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Property Type
                    </label>
                    <select
                      id="propertyType"
                      name="propertyType"
                      required
                      value={formData.propertyType}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      <option value="" disabled>
                        Select property type
                      </option>
                      {propertyTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-3.5 px-6
                    text-sm font-semibold text-white shadow-lg shadow-blue-500/25
                    transition-all duration-200
                    hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-500/30
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600
                    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Sending…
                    </span>
                  ) : (
                    "Send Message"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-blue-500/5">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Contact Information
              </h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <a href="tel:+19255184931" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      (925) 518-4931
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a href="mailto:info@newdaypowerwash.com" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                      info@newdaypowerwash.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Service Area</p>
                    <p className="text-sm text-gray-500">
                      Livermore, Dublin, Pleasanton, San Ramon, Danville &amp; Bay
                      Area
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-xl shadow-blue-500/5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Quick Response
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                We respond to all inquiries within 24 hours. For urgent service
                needs, call us directly for same-day scheduling availability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
