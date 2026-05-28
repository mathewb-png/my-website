"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
}

const INITIAL_MESSAGE: Message = {
  id: "welcome",
  type: "bot",
  content:
    "Hi there! I'm the New Day Power Wash assistant. How can I help you today?",
};

const SUGGESTIONS = [
  "Get a Quote",
  "Service Areas",
  "Pricing Info",
  "Schedule Service",
] as const;

const RESPONSES: Record<string, string> = {
  "Get a Quote":
    "I'd love to help! You can use our AI Estimator above, or tell me about your property and I'll give you a quick estimate.",
  "Service Areas":
    "We serve the greater metropolitan area including residential, commercial, and HOA properties.",
  "Pricing Info":
    "Our residential packages start at $149, commercial at $599. Visit our pricing section for full details!",
  "Schedule Service":
    "Great! You can fill out our contact form or call us at (555) 123-4567 to schedule.",
};

const FALLBACK_RESPONSE =
  "Thanks for your message! For detailed inquiries, please use our contact form or call us at (555) 123-4567. I'm here to help with general questions about our services.";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

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

  const addBotResponse = useCallback((content: string) => {
    setIsTyping(true);
    const delay = Math.random() * 800 + 700;
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), type: "bot", content },
      ]);
    }, delay);
  }, []);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), type: "user", content: text },
    ]);
    setInput("");
    setShowSuggestions(false);

    const matched = Object.keys(RESPONSES).find(
      (key) => text.toLowerCase().includes(key.toLowerCase())
    );
    addBotResponse(matched ? RESPONSES[matched] : FALLBACK_RESPONSE);
  }, [input, addBotResponse]);

  const handleChip = useCallback(
    (chip: string) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), type: "user", content: chip },
      ]);
      setShowSuggestions(false);
      addBotResponse(RESPONSES[chip] || FALLBACK_RESPONSE);
    },
    [addBotResponse]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat toggle button with 3D coin flip */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        className={`chat-toggle-btn fixed bottom-6 right-6 z-[1000] h-[60px] w-[60px] cursor-pointer rounded-full border-none outline-none [perspective:600px] ${
          !isOpen ? "animate-pulse-glow" : ""
        }`}
        style={{ background: "transparent" }}
      >
        <div
          className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] hover:[transform:rotateY(180deg)]"
          style={isOpen ? { transform: "rotateY(180deg)" } : undefined}
        >
          {/* Front face */}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow-[0_4px_20px_var(--primary-glow),0_2px_8px_var(--shadow)] [backface-visibility:hidden]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-white">
              <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
            </svg>
          </div>
          {/* Back face */}
          <div className="absolute inset-0 flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--primary)] shadow-[0_4px_20px_var(--primary-glow),0_2px_8px_var(--shadow)] [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-white">
              <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </button>

      {/* Chat panel */}
      <div
        ref={panelRef}
        className={`chat-widget-panel ${isOpen ? "open" : ""}`}
        style={{ height: "500px", width: "380px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white">
              <path d="M16.5 7.5h-9v9h9v-9z" />
              <path fillRule="evenodd" d="M8.25 2.25A.75.75 0 019 3v.75h2.25V3a.75.75 0 011.5 0v.75H15V3a.75.75 0 011.5 0v.75h.75a3 3 0 013 3v.75H21A.75.75 0 0121 9h-.75v2.25H21a.75.75 0 010 1.5h-.75V15H21a.75.75 0 010 1.5h-.75v.75a3 3 0 01-3 3h-.75V21a.75.75 0 01-1.5 0v-.75h-2.25V21a.75.75 0 01-1.5 0v-.75H9V21a.75.75 0 01-1.5 0v-.75h-.75a3 3 0 01-3-3v-.75H3A.75.75 0 013 15h.75v-2.25H3a.75.75 0 010-1.5h.75V9H3a.75.75 0 010-1.5h.75v-.75a3 3 0 013-3h.75V3a.75.75 0 01.75-.75zM6 6.75A.75.75 0 016.75 6h10.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V6.75z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-[var(--text)]">
              New Day Power Wash
            </h4>
            <span className="text-xs text-green-400">Online</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
            className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-card)] hover:text-[var(--text)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.type === "user"
                    ? "rounded-br-md bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white"
                    : "rounded-bl-md bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text)]"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

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
                <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--text-muted)]" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--text-muted)]" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-bounce rounded-full bg-[var(--text-muted)]" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="border-t border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-3">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 rounded-full bg-[var(--bg-card)] border border-[var(--border)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] outline-none transition-colors focus:border-[var(--primary)] focus:shadow-[0_0_0_3px_var(--primary-glow)]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              aria-label="Send message"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] text-white transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
