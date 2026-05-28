"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";

export default function EventsPage() {
  const { lang } = useLanguage();
  const messages = getContent(lang, "events");
  const [events, setEvents] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Failed to load events.");
        setEvents(await res.json());
      } catch (e) {
        setError(e.message || "Failed to load events.");
        setEvents([]);
      }
    })();
  }, []);

  function localized(ev) {
    const t = ev.translations?.[lang];
    if (t?.title && t?.description) return t;
    return ev.translations?.en || { title: "", description: "" };
  }

  function formatDate(d) {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString(lang === "am" ? "en-US" : lang, {
        year: "numeric", month: "long", day: "numeric",
      });
    } catch { return d; }
  }

  return (
    <main className="bg-[#fcfaf7] text-slate-900 min-h-screen pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-heading mb-3">{messages.title}</h1>
          <p className="text-stone-600 max-w-2xl mx-auto">{messages.subtitle}</p>
        </header>

        <section className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 md:p-10">
          <h2 className="text-2xl font-heading pb-3 border-b border-stone-200 mb-8">
            {messages.upcoming}
          </h2>

          {events === null && <p className="text-stone-500">{messages.loading}</p>}
          {error && events?.length === 0 && (
            <p className="text-red-600">{messages.errorLoad}</p>
          )}
          {events?.length === 0 && !error && (
            <p className="text-stone-500">{messages.empty}</p>
          )}

          {events?.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {events.map((ev) => {
                const t = localized(ev);
                return (
                  <article
                    key={ev.id}
                    className="bg-[#fdfbf6] border border-stone-100 rounded-xl overflow-hidden flex flex-col"
                  >
                    {ev.images?.[0] && (
                      <div className="relative aspect-[16/9] bg-stone-100">
                        <Image
                          src={`/event-images/${ev.images[0]}`}
                          alt={t.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 480px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5 md:p-6 flex flex-col flex-1">
                      <h3 className="text-lg font-heading mb-3">{t.title}</h3>
                      {(ev.eventDate || ev.eventTime) && (
                        <p className="text-sm text-stone-700 mb-1">
                          <span className="font-medium">{messages.timeLabel}:</span>{" "}
                          {[formatDate(ev.eventDate), ev.eventTime].filter(Boolean).join(" · ")}
                        </p>
                      )}
                      {ev.location && (
                        <p className="text-sm text-stone-700 mb-3">
                          <span className="font-medium">{messages.locationLabel}:</span> {ev.location}
                        </p>
                      )}
                      <p className="text-sm text-stone-600 whitespace-pre-line leading-relaxed">
                        {t.description}
                      </p>
                      {ev.images?.length > 1 && (
                        <div className="mt-4 grid grid-cols-4 gap-2">
                          {ev.images.slice(1, 5).map((img) => (
                            <div key={img} className="relative aspect-square overflow-hidden rounded bg-stone-100">
                              <Image src={`/event-images/${img}`} alt={t.title} fill sizes="100px" className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
