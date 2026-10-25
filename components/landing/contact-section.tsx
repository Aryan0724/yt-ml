"use client"

import { useState } from "react"
import { ArrowRight, CheckCircle2, AlertCircle, Mail, Loader2 } from "lucide-react"

type FormStatus = "idle" | "loading" | "success" | "error"

interface FormState {
  name: string
  email: string
  subject: string
  message: string
}

const SUBJECTS = [
  "General Inquiry",
  "Creator Support",
  "Business Inquiry",
  "Partnerships",
  "Press & Media",
]

export function ContactSection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: SUBJECTS[0],
    message: "",
  })
  const [status, setStatus] = useState<FormStatus>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (!form.name.trim()) {
      setErrorMsg("Please enter your name.")
      setStatus("error")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setErrorMsg("Please enter a valid email address.")
      setStatus("error")
      return
    }
    if (!form.message.trim() || form.message.trim().length < 10) {
      setErrorMsg("Please enter a message (at least 10 characters).")
      setStatus("error")
      return
    }

    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus("success")
        setForm({ name: "", email: "", subject: SUBJECTS[0], message: "" })
      } else {
        setErrorMsg(
          data.error ||
            "Something went wrong. Please email us at contact@integralgroups.in"
        )
        setStatus("error")
      }
    } catch {
      setErrorMsg(
        "Network error. Please try again or email contact@integralgroups.in"
      )
      setStatus("error")
    }
  }

  return (
    <section
      id="contact"
      className="py-20 md:py-24 bg-neutral-50/50 border-b border-neutral-200"
      aria-labelledby="contact-heading"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Left: Context panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-mono font-bold tracking-wider uppercase">
              <Mail className="w-3.5 h-3.5 text-[#EE1122]" />
              <span>CONTACT US</span>
            </div>

            <h2
              id="contact-heading"
              className="text-3xl sm:text-4xl font-bold tracking-tight text-[#161512] leading-[1.12]"
            >
              Questions?{" "}
              <span className="text-[#EE1122]">We're here.</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
              Whether you're a creator with a question about the platform, a
              team exploring a business integration, or a journalist covering
              creator tools — send us a message and we'll respond within one
              business day.
            </p>

            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-3 text-sm text-neutral-700">
                <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#EE1122]" />
                </div>
                <a
                  href="mailto:contact@integralgroups.in"
                  className="font-medium hover:text-[#EE1122] transition-colors"
                >
                  contact@integralgroups.in
                </a>
              </div>
              <p className="text-xs text-neutral-400 font-mono pl-11">
                Response time: within 1 business day
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 rounded-2xl border border-emerald-200 bg-emerald-50 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-[#161512]">
                    Message sent.
                  </h3>
                  <p className="text-sm text-neutral-600 max-w-xs mx-auto">
                    We'll get back to you at{" "}
                    <span className="font-semibold">{form.email || "your inbox"}</span>{" "}
                    within one business day.
                  </p>
                </div>
                <button
                  onClick={() => setStatus("idle")}
                  className="text-xs font-mono text-neutral-500 hover:text-neutral-800 underline underline-offset-2 transition-colors mt-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="bg-white rounded-2xl border border-neutral-200 p-8 shadow-sm space-y-6"
              >
                {/* Error state */}
                {status === "error" && errorMsg && (
                  <div
                    role="alert"
                    className="flex items-start gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Name + Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-bold text-neutral-700 uppercase tracking-wider font-mono"
                    >
                      Name <span className="text-[#EE1122]">*</span>
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#EE1122]/30 focus:border-[#EE1122] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-bold text-neutral-700 uppercase tracking-wider font-mono"
                    >
                      Email <span className="text-[#EE1122]">*</span>
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#EE1122]/30 focus:border-[#EE1122] transition-all"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div className="space-y-2">
                  <label
                    htmlFor="contact-subject"
                    className="block text-xs font-bold text-neutral-700 uppercase tracking-wider font-mono"
                  >
                    Subject
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#EE1122]/30 focus:border-[#EE1122] transition-all appearance-none cursor-pointer"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-bold text-neutral-700 uppercase tracking-wider font-mono"
                  >
                    Message <span className="text-[#EE1122]">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-neutral-200 bg-neutral-50/50 text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#EE1122]/30 focus:border-[#EE1122] transition-all resize-none"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full inline-flex items-center justify-center gap-2 action-button action-button--primary py-4 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-neutral-400 font-mono">
                  We respond within 1 business day · contact@integralgroups.in
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
