"use client";

import { useState, useRef, useEffect, useCallback } from "react";

type MessageType = "user" | "bot" | "form" | "image" | "estimate";

interface EstimateResult {
  surface: string;
  area: string;
  condition: string;
  conditionNotes: string;
  service: string;
  costLow: number;
  costHigh: number;
  notes: string;
}

interface Message {
  id: string;
  type: MessageType;
  content: string;
  imageUrl?: string;
  estimate?: EstimateResult;
}

interface ChatFormData {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  message: string;
}

const INITIAL_FORM: ChatFormData = {
  name: "",
  email: "",
  phone: "",
  propertyType: "",
  message: "",
};

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  type: "bot",
  content:
    "Hi there! I'm the New Day Power Wash assistant. How can I help you today?",
};

const SUGGESTIONS = [
  "Get a Quote",
  "Upload Photo for Estimate",
  "Service Areas",
  "Pricing Info",
  "Schedule Service",
] as const;

const FORM_TRIGGERS = ["Get a Quote", "Schedule Service"];

const RESPONSES: Record<string, string> = {
  "Service Areas":
    "We're residential-first: home driveways, patios, and siding across the Bay Area, plus HOA and property management clients.",
  "Pricing Info":
    "Our residential packages start at $249. HOA and property management quotes are custom. Visit our pricing section for full details!",
};

const FALLBACK_RESPONSE =
  "Thanks for your message! For detailed inquiries, please use our contact form or call us at (925) 518-4931. I'm here to help with general questions about our services.";

function ChatInlineForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: ChatFormData) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<ChatFormData>(INITIAL_FORM);
  const [sending, setSending] = useState(false);

  const update = (field: keyof ChatFormData, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const canSubmit = form.name.trim() && form.email.trim() && form.message.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    onSubmit(form);
  };

  const inputClass =
    "w-full rounded-lg bg-[var(--bg)] border border-[var(--border)] px-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[var(--primary)] focus:shadow-[0_0_0_2px_var(--primary-glow)]";

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <input
        type="text"
        placeholder="Your name *"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        className={inputClass}
        required
      />
      <input
        type="email"
        placeholder="Email address *"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        className={inputClass}
        required
      />
      <input
        type="tel"
        placeholder="Phone number"
        value={form.phone}
        onChange={(e) => update("phone", e.target.value)}
        className={inputClass}
      />
      <select
        value={form.propertyType}
        onChange={(e) => update("propertyType", e.target.value)}
        className={inputClass}
      >
        <option value="">Property type</option>
        <option value="Residential">Residential</option>
        <option value="HOA/Community">HOA / Community</option>
        <option value="Leasing Office">Leasing Office</option>
        <option value="Other">Other</option>
      </select>
      <textarea
        placeholder="Tell us about your project *"
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
        rows={2}
        className={`${inputClass} resize-none`}
        required
      />
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={!canSubmit || sending}
          className="flex-1 rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-3 py-2 text-xs font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send Request"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

const COINS_COUNT = 8;
const COINS_RADIUS = 19;

function CoinsIcon() {
  const groupRef = useRef<HTMLDivElement>(null);
  const discRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotations = useRef(
    Array.from({ length: COINS_COUNT }, () => ({
      x: 0,
      y: Math.PI / COINS_COUNT,
      z: Math.PI / 2,
    }))
  );
  const groupZ = useRef(0);

  useEffect(() => {
    let id: number;
    const tick = () => {
      groupZ.current -= 0.01;
      if (groupRef.current) {
        groupRef.current.style.transform = `rotate(${groupZ.current}rad)`;
      }
      rotations.current.forEach((r, i) => {
        r.x += 0.01;
        r.y += 0.01;
        r.z += 0.01;
        const el = discRefs.current[i];
        if (el) {
          el.style.transform = `rotateX(${r.x}rad) rotateY(${r.y}rad) rotateZ(${r.z}rad)`;
        }
      });
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div ref={groupRef} className="coins-orbit">
      {Array.from({ length: COINS_COUNT }).map((_, i) => {
        const angle = (i * 2 * Math.PI) / COINS_COUNT + Math.PI / 4;
        const orbZ = (i * 2 * Math.PI) / COINS_COUNT;
        return (
          <div
            key={i}
            className="coins-pos"
            style={{
              left: `calc(50% + ${Math.cos(angle) * COINS_RADIUS}px)`,
              top: `calc(50% + ${Math.sin(angle) * COINS_RADIUS}px)`,
              transform: `translate(-50%, -50%) rotateZ(${orbZ}rad)`,
            }}
          >
            <div
              ref={(el) => { discRefs.current[i] = el; }}
              className="coins-disc"
            />
          </div>
        );
      })}
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scrollChatToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, []);

  useEffect(() => {
    if (isOpen && messages.length > 1) {
      scrollChatToBottom();
    }
  }, [messages, isTyping, showForm, scrollChatToBottom, isOpen]);

  useEffect(() => {
    if (isOpen && !showForm) inputRef.current?.focus();
  }, [isOpen, showForm]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(".chat-toggle-btn")
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const addBotMessage = useCallback((content: string, delay = true) => {
    if (delay) {
      setIsTyping(true);
      const ms = Math.random() * 800 + 700;
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), type: "bot", content },
        ]);
      }, ms);
    } else {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), type: "bot", content },
      ]);
    }
  }, []);

  const triggerForm = useCallback(
    (chipLabel: string) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), type: "user", content: chipLabel },
      ]);
      setShowSuggestions(false);
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const intro =
          chipLabel === "Schedule Service"
            ? "Let's get you scheduled! Fill out the form below and we'll reach out within 24 hours."
            : "I'd love to get you a quote! Fill out the details below and we'll follow up shortly.";
        addBotMessage(intro, false);
        setShowForm(true);
      }, 800);
    },
    [addBotMessage]
  );

  const handleFormSubmit = useCallback(
    (data: ChatFormData) => {
      setShowForm(false);
      setFormSubmitted(true);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "form",
          content: `📋 ${data.name} • ${data.email}${data.phone ? ` • ${data.phone}` : ""}${data.propertyType ? ` • ${data.propertyType}` : ""}`,
        },
      ]);
      addBotMessage(
        `Thanks ${data.name.split(" ")[0]}! We've received your request and will get back to you within 24 hours. You can also reach us at (925) 518-4931.`
      );

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "cdb4f08d-26f3-46ff-aca0-9e35349d14cd",
          subject: `Chat Lead — ${data.propertyType || "General"} — ${data.name}`,
          from_name: data.name,
          email: data.email,
          phone: data.phone,
          property_type: data.propertyType,
          message: data.message,
        }),
      }).catch(() => {});
    },
    [addBotMessage]
  );

  const handleFormCancel = useCallback(() => {
    setShowForm(false);
    addBotMessage("No problem! Let me know if there's anything else I can help with.");
  }, [addBotMessage]);

  const handleImageUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            type: "image",
            content: "",
            imageUrl: dataUrl,
          },
        ]);
        setShowSuggestions(false);
        setIsTyping(true);

        try {
          const res = await fetch("/api/estimate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: dataUrl }),
          });

          if (!res.ok) throw new Error("API error");

          const data = await res.json();
          const result: EstimateResult = data.result;

          setIsTyping(false);
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: "estimate",
              content: "",
              estimate: result,
            },
          ]);
        } catch {
          setIsTyping(false);
          addBotMessage(
            "I couldn't analyze that image, but you can still get a free estimate by contacting us!",
            false
          );
        }
      };
      reader.readAsDataURL(file);

      e.target.value = "";
    },
    [addBotMessage]
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "user", content: text },
    ]);
    setInput("");
    setShowSuggestions(false);

    const isFormTrigger = FORM_TRIGGERS.some((t) =>
      text.toLowerCase().includes(t.toLowerCase())
    );
    if (isFormTrigger && !formSubmitted) {
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        addBotMessage(
          "Sure! Fill out the form below and we'll get back to you right away.",
          false
        );
        setShowForm(true);
      }, 800);
      return;
    }

    const matched = Object.keys(RESPONSES).find((key) =>
      text.toLowerCase().includes(key.toLowerCase())
    );
    addBotMessage(matched ? RESPONSES[matched] : FALLBACK_RESPONSE);
  }, [input, addBotMessage, formSubmitted]);

  const handleChip = useCallback(
    (chip: string) => {
      if (chip === "Upload Photo for Estimate") {
        fileInputRef.current?.click();
        return;
      }
      if (FORM_TRIGGERS.includes(chip)) {
        triggerForm(chip);
      } else {
        setMessages((prev) => [
          ...prev,
          { id: Date.now().toString(), type: "user", content: chip },
        ]);
        setShowSuggestions(false);
        addBotMessage(RESPONSES[chip] || FALLBACK_RESPONSE);
      }
    },
    [addBotMessage, triggerForm]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat toggle — animated sparkle icon */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className="chat-toggle-btn fixed z-[1000] h-[60px] w-[60px] cursor-pointer border-none outline-none bg-transparent bottom-4 left-4 md:bottom-6 md:left-auto md:right-6"
      >
        <div className="chat-icon-wrapper">
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="chat-icon-svg">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <CoinsIcon />
          )}
        </div>
      </button>

      {/* Chat panel */}
      <div
        ref={panelRef}
        className={`chat-widget-panel ${isOpen ? "open" : ""}`}
        style={{ height: "520px", width: "380px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5 text-white"
            >
              <path
                fillRule="evenodd"
                d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-[var(--text)]" role="heading" aria-level={2}>
              New Day Power Wash
            </p>
            <span className="text-xs text-green-400">Online</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text)]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => {
            if (msg.type === "image") {
              return (
                <div key={msg.id} className="flex justify-end">
                  <div className="max-w-[75%] rounded-2xl rounded-br-md bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] p-1">
                    <img
                      src={msg.imageUrl}
                      alt="Uploaded property"
                      className="rounded-xl max-h-48 w-auto object-cover"
                    />
                  </div>
                </div>
              );
            }

            if (msg.type === "estimate" && msg.estimate) {
              const est = msg.estimate;
              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-[var(--primary)]/30 bg-[var(--bg-card)] p-4 text-sm">
                    <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-[var(--primary)]">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                      </svg>
                      AI Estimate Ready
                    </div>
                    <div className="space-y-2 text-[var(--text)]">
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)] text-xs">Surface</span>
                        <span className="text-xs font-medium">{est.surface}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)] text-xs">Area</span>
                        <span className="text-xs font-medium">{est.area}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)] text-xs">Condition</span>
                        <span className="text-xs font-medium">{est.condition}</span>
                      </div>
                      {est.conditionNotes && (
                        <p className="text-xs text-[var(--text-muted)] italic">{est.conditionNotes}</p>
                      )}
                      <div className="my-2 border-t border-[var(--border)]" />
                      <div className="flex justify-between">
                        <span className="text-[var(--text-muted)] text-xs">Service</span>
                        <span className="text-xs font-medium text-[var(--primary)]">{est.service}</span>
                      </div>
                      <div className="flex justify-between items-baseline">
                        <span className="text-[var(--text-muted)] text-xs">Estimated Cost</span>
                        <span className="text-sm font-bold text-green-400">
                          ${est.costLow} &ndash; ${est.costHigh}
                        </span>
                      </div>
                      {est.notes && (
                        <p className="mt-1 text-xs text-[var(--text-muted)]">{est.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleChip("Get a Quote")}
                      className="mt-3 w-full rounded-lg bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] px-3 py-2 text-xs font-semibold text-white transition-all hover:scale-[1.02]"
                    >
                      Get a Detailed Quote
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.type === "user"
                      ? "rounded-br-md bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white"
                      : msg.type === "form"
                        ? "rounded-br-md bg-green-500/10 border border-green-500/30 text-green-300 text-xs"
                        : "rounded-bl-md bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text)]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}

          {/* Suggestion chips */}
          {showSuggestions && messages.length === 1 && (
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleChip(chip)}
                  className="rounded-full border border-[var(--border)] px-3.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[var(--bg-card)] border border-[var(--border)] px-4 py-3">
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-[var(--text-muted)]"
                  style={{ animationDelay: "0ms" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-[var(--text-muted)]"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="h-2 w-2 animate-bounce rounded-full bg-[var(--text-muted)]"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}

          {/* Inline form */}
          {showForm && (
            <div className="rounded-2xl rounded-bl-md border border-[var(--primary)]/30 bg-[var(--bg-card)] p-4">
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-[var(--primary)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                  <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                </svg>
                Quick Contact Form
              </div>
              <ChatInlineForm
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Hidden file input for image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          {...(isMobile ? { capture: "environment" } : {})}
          onChange={handleImageUpload}
          className="hidden"
        />

        {/* Input area */}
        <div className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={showForm || isTyping}
              aria-label="Upload photo for estimate"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[var(--text-muted)] transition-all hover:bg-[var(--bg-card)] hover:text-[var(--primary)] disabled:opacity-40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
                <path fillRule="evenodd" d="M9.344 3.071a49.52 49.52 0 015.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.055.755.127 1.106.214a2.21 2.21 0 011.675 2.142V18a2.25 2.25 0 01-2.25 2.25H4.5A2.25 2.25 0 012.25 18V8.844a2.21 2.21 0 011.675-2.142c.351-.087.72-.159 1.106-.214a1.41 1.41 0 001.11-.71l.822-1.318a2.21 2.21 0 012.332-1.39zM12 10.5a3 3 0 100 6 3 3 0 000-6z" clipRule="evenodd" />
              </svg>
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={showForm ? "Form is open above..." : "Type a message..."}
              disabled={showForm}
              className="flex-1 rounded-full bg-[var(--bg-card)] border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-glow)] disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || showForm}
              aria-label="Send message"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
