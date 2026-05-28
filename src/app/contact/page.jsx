"use client";

import { useState } from "react";
import { MapPin, Phone, Bell, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";

export default function ContactPage() {
  const { lang } = useLanguage();
  const messages = getContent(lang, "contact");

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "", website: "" });
  const [status, setStatus] = useState({ kind: "idle", text: "" });
  const submitting = status.kind === "submitting";

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) {
      setStatus({ kind: "error", text: messages.status.missing });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus({ kind: "error", text: messages.status.invalidEmail });
      return;
    }
    setStatus({ kind: "submitting", text: "" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("send failed");
      setStatus({ kind: "success", text: messages.status.success });
      setForm({ name: "", email: "", subject: "", message: "", website: "" });
    } catch {
      setStatus({ kind: "error", text: messages.status.error });
    }
  };

  const inputCls =
    "mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-200";

  return (
    <main className="bg-[#fcfaf7] min-h-screen pt-28 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-heading mb-3">{messages.hero.title}</h1>
          <p className="text-stone-600 max-w-2xl mx-auto">{messages.hero.subtitle}</p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <section className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 md:p-8">
            <h2 className="text-xl font-heading mb-6">{messages.form.title}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text" name="website" value={form.website} onChange={update("website")}
                tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden"
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">{messages.form.name}</span>
                  <input type="text" value={form.name} onChange={update("name")} required maxLength={200}
                    placeholder={messages.form.namePlaceholder} className={inputCls} />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-stone-700">{messages.form.email}</span>
                  <input type="email" value={form.email} onChange={update("email")} required maxLength={200}
                    placeholder={messages.form.emailPlaceholder} className={inputCls} />
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-medium text-stone-700">{messages.form.subject}</span>
                <input type="text" value={form.subject} onChange={update("subject")} required maxLength={200}
                  placeholder={messages.form.subjectPlaceholder} className={inputCls} />
              </label>
              <label className="block">
                <span className="text-sm font-medium text-stone-700">{messages.form.message}</span>
                <textarea value={form.message} onChange={update("message")} required maxLength={5000} rows={6}
                  placeholder={messages.form.messagePlaceholder} className={`${inputCls} resize-y`} />
              </label>

              {status.kind === "success" && (
                <p className="rounded-md bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">{status.text}</p>
              )}
              {status.kind === "error" && (
                <p className="rounded-md bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">{status.text}</p>
              )}

              <button type="submit" disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-yellow-500 px-5 py-3 font-heading text-black hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed">
                <Send size={16} />
                {submitting ? messages.form.submitting : messages.form.submit}
              </button>
              <p className="text-center text-xs text-stone-500">{messages.form.secureNote}</p>
            </form>
          </section>

          <aside className="space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 md:p-8">
              <h2 className="flex items-center gap-2 text-xl font-heading mb-4">
                <MapPin size={20} className="text-yellow-500" /> {messages.findUs.title}
              </h2>
              <p className="text-stone-700 mb-4 whitespace-pre-line">{messages.info.address}</p>
              <div className="overflow-hidden rounded-xl border border-stone-100">
                <iframe
                  title={messages.findUs.title}
                  src="https://www.google.com/maps?q=Regentenstra%C3%9Fe+78-80%2C+51063+K%C3%B6ln&output=embed"
                  width="100%" height="260" style={{ border: 0 }} loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" allowFullScreen
                />
              </div>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 md:p-8">
              <h2 className="flex items-center gap-2 text-xl font-heading mb-4">
                <Phone size={20} className="text-yellow-500" /> {messages.callUs.title}
              </h2>
              <a href={`tel:${messages.info.phone.replace(/\s+/g, "")}`}
                className="text-stone-800 hover:underline">{messages.info.phone}</a>
            </section>

            <section className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 md:p-8">
              <h2 className="flex items-center gap-2 text-xl font-heading mb-4">
                <Bell size={20} className="text-yellow-500" /> {messages.serviceTimes.title}
              </h2>
              <p className="text-stone-700">{messages.serviceTimes.schedule}</p>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}
