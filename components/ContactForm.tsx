"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

const fieldClass =
  "w-full border-0 border-b border-white/20 bg-transparent px-0 py-3 text-[16px] text-white placeholder:text-white/30 outline-none transition-colors focus:border-accent";
const labelClass = "block text-[11px] tracking-[0.25em] text-white/45";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="border-t border-white/10 pt-10">
        <p className="font-display text-[40px] leading-none md:text-[56px]">Received.</p>
        <p className="mt-5 max-w-[40ch] text-[15px] leading-[1.7] text-white/55">
          Your message is on its way. Someone will answer you personally.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-9">
      <div className="grid gap-9 md:grid-cols-2 md:gap-10">
        <label>
          <span className={labelClass}>YOUR NAME</span>
          <input name="name" required maxLength={100} autoComplete="name" className={fieldClass} />
        </label>
        <label>
          <span className={labelClass}>YOUR EMAIL</span>
          <input name="email" type="email" required maxLength={200} autoComplete="email" className={fieldClass} />
        </label>
      </div>
      <label>
        <span className={labelClass}>THE LIFE YOU WANT, IN A FEW SENTENCES</span>
        <textarea name="message" required minLength={10} maxLength={5000} rows={5} className={`${fieldClass} resize-none`} />
      </label>

      {/* Honeypot for bots; hidden from people and screen readers */}
      <label aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        Company
        <input name="company" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={status === "sending"}
          className="flex h-[48px] items-center rounded-[5px] bg-accent px-[32px] text-[13px] text-accent-ink transition-[filter,opacity] hover:brightness-110 disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : "Send"}
        </button>
        <p className="max-w-[44ch] text-[12px] leading-[1.6] text-white/40">
          We use your details only to reply to you.
        </p>
      </div>

      {status === "error" && (
        <p role="alert" className="text-[14px] text-[#f0a37a]">
          Something went wrong and your message was not sent. Please try again in a moment.
        </p>
      )}
    </form>
  );
}
