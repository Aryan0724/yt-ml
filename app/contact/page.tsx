"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/landing/navbar"
import { Footer } from "@/components/landing/footer"
import { BreadcrumbSchema } from "@/components/seo/json-ld"
import { Mail, MessageSquare, Twitter, ArrowRight, CheckCircle2, Building, ShieldCheck } from "lucide-react"

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    channelUrl: "",
    message: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated contact response
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 selection:bg-red-100 selection:text-red-900 flex flex-col justify-between">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Contact & Support", url: "/contact" }
        ]}
      />
      <div>
        <Navbar variant="light" />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 space-y-16">
          <div className="grid lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Direct Info & Studio Profile */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-xs font-mono font-bold tracking-wider uppercase">
                  <span>[ CONTACT // INTEGRAL GROUPS STUDIO ]</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-neutral-950 tracking-tight leading-[1.08]">
                  Contact PreYT <br />
                  <span className="text-red-600">Analytics Support.</span>
                </h1>
                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal">
                  Whether you are a creator seeking pre-upload packaging diagnostics, an enterprise channel scaling multi-format productions, or inquiring about API access, our engineering team is here to assist.
                </p>
              </div>

              {/* Direct Channels */}
              <div className="space-y-4 pt-2">
                <a
                  href="mailto:contact@integralgroups.in"
                  className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs hover:border-red-300 hover:shadow-xs transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      Email Support &amp; Inquiries
                    </div>
                    <div className="text-sm font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                      contact@integralgroups.in
                    </div>
                  </div>
                </a>

                <a
                  href="https://twitter.com/preYTAI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs hover:border-red-300 hover:shadow-xs transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:bg-neutral-950 group-hover:text-white transition-colors shrink-0">
                    <Twitter className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      Direct Message &amp; Telemetry Updates
                    </div>
                    <div className="text-sm font-bold text-neutral-900 group-hover:text-red-600 transition-colors">
                      @preYTAI
                    </div>
                  </div>
                </a>

                <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-2xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                      Entity &amp; Jurisdiction
                    </div>
                    <div className="text-xs font-semibold text-neutral-800">
                      PreYT · Integral Groups Studio, India
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Form */}
            <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-3xl p-8 sm:p-10 shadow-xs space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-neutral-950">Send an Inquiry</h2>
                <p className="text-xs text-neutral-500 font-mono">[ RESPONSE WITHIN 24 BUSINESS HOURS ]</p>
              </div>

              {submitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h3 className="text-base font-bold text-emerald-950">Message Transmitted</h3>
                  <p className="text-xs text-emerald-700 leading-relaxed max-w-sm mx-auto">
                    Thank you for reaching out. An engineer or partnership lead from the Integral Groups team will review your channel and reply within 24 hours.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({ name: "", email: "", channelUrl: "", message: "" })
                    }}
                    className="mt-4 px-4 py-2 rounded-xl bg-white border border-emerald-300 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="name-input" className="text-xs font-bold text-neutral-700 block">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="name-input"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Alex Mercer"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-2xs"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email-input" className="text-xs font-bold text-neutral-700 block">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email-input"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="alex@channel.com"
                        className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-2xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="channel-input" className="text-xs font-bold text-neutral-700 block">
                      YouTube Channel URL or Topic
                    </label>
                    <input
                      id="channel-input"
                      type="text"
                      value={formData.channelUrl}
                      onChange={(e) => setFormData({ ...formData, channelUrl: e.target.value })}
                      placeholder="https://youtube.com/@yourchannel (Optional)"
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors shadow-2xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="message-input" className="text-xs font-bold text-neutral-700 block">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message-input"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us about your channel, studio requirements, or inquiry..."
                      className="w-full px-4 py-3 rounded-xl border border-neutral-300 bg-white text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors resize-none shadow-2xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <span>Transmit Message</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="text-[11px] font-mono text-neutral-400 text-center flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Protected by Integral Groups Data Governance &amp; DPDP Act 2023.</span>
                  </div>
                </form>
              )}
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
