"use client";

import { useState } from "react";
import { MapPin, Phone, Send } from "lucide-react";
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

    return (
        <main className="bg-[#fcfaf7] min-h-screen pb-20">
            <section className="bg-black text-white pt-32 pb-20 px-6 text-center">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-5xl md:text-6xl font-heading mb-6 tracking-tight">
                        {messages.hero.title}
                    </h1>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        {messages.hero.subtitle}
                    </p>
                </div>
            </section>

            <section className="max-w-5xl mx-auto px-6 -mt-12 grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 bg-white rounded-xl shadow p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input
                            type="text"
                            name="website"
                            value={form.website}
                            onChange={update("website")}
                            tabIndex={-1}
                            autoComplete="off"
                            aria-hidden="true"
                            className="hidden"
                        />
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">{messages.form.name}</span>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={update("name")}
                                    required
                                    maxLength={200}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                />
                            </label>
                            <label className="block">
                                <span className="text-sm font-medium text-gray-700">{messages.form.email}</span>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={update("email")}
                                    required
                                    maxLength={200}
                                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                                />
                            </label>
                        </div>
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">{messages.form.subject}</span>
                            <input
                                type="text"
                                value={form.subject}
                                onChange={update("subject")}
                                required
                                maxLength={200}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                            />
                        </label>
                        <label className="block">
                            <span className="text-sm font-medium text-gray-700">{messages.form.message}</span>
                            <textarea
                                value={form.message}
                                onChange={update("message")}
                                required
                                maxLength={5000}
                                rows={6}
                                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 resize-y"
                            />
                        </label>

                        {status.kind === "success" && (
                            <p className="rounded-md bg-green-50 border border-green-200 text-green-800 px-4 py-3 text-sm">{status.text}</p>
                        )}
                        {status.kind === "error" && (
                            <p className="rounded-md bg-red-50 border border-red-200 text-red-800 px-4 py-3 text-sm">{status.text}</p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center gap-2 rounded-md bg-yellow-500 px-5 py-2.5 font-heading text-black hover:bg-yellow-400 transition disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            <Send size={16} />
                            {submitting ? messages.form.submitting : messages.form.submit}
                        </button>
                    </form>
                </div>

                <aside className="bg-white rounded-xl shadow p-8 space-y-6 h-fit">
                    <div className="flex items-start gap-3">
                        <MapPin size={20} className="text-yellow-500 mt-1 shrink-0" />
                        <p className="text-gray-700">{messages.info.address}</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <Phone size={20} className="text-yellow-500 mt-1 shrink-0" />
                        <a href={`tel:${messages.info.phone.replace(/\s+/g, "")}`} className="text-gray-700 hover:underline">
                            {messages.info.phone}
                        </a>
                    </div>
                </aside>
            </section>
        </main>
    );
}
