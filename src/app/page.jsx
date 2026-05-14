"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";
import Hero from "@/components/homePage/Hero";
import DonationSection from "@/components/homePage/DonationSection";
import Link from "next/link";
import { ArrowRight, Baby, Users } from "lucide-react";

export default function HomePage() {
  const { lang } = useLanguage();
  const messages = getContent(lang, "home");
  const ministriesMessages = getContent(lang, "ministries");

  return (
    <>
      <Hero content={messages.hero} />

      <section className="bg-[#f9f7f2] py-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-heading mb-4">
              {messages.journey.title}
            </h2>

            <p className="text-gray-700 mb-6 leading-relaxed">
              {messages.journey.text}
            </p>

            <Link
              href="/about"
              className="inline-block bg-yellow-500 px-6 py-3 rounded-md font-medium hover:bg-yellow-400 transition"
            >
              {messages.journey.cta}
            </Link>
          </div>

          <div className="relative pl-8 border-l-2 border-yellow-500/30 py-4">
            <div className="mb-10 relative">
              <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"></div>
              <span className="text-sm font-bold text-yellow-600">
                {messages.journey.timeline.startYear}
              </span>
              <h4 className="font-heading text-lg">
                {messages.journey.timeline.startTitle}
              </h4>
              <p className="text-sm text-gray-600">
                {messages.journey.timeline.startDescription}
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-gray-300"></div>
              <span className="text-sm font-bold text-gray-400">
                {messages.journey.timeline.presentYear}
              </span>
              <h4 className="font-heading text-lg text-gray-400">
                {messages.journey.timeline.presentTitle}
              </h4>
              <p className="text-sm text-gray-500">
                {messages.journey.timeline.presentDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-3xl font-heading mb-6">
            {messages.foundation.title}
          </h2>

          <p className="text-gray-700 leading-relaxed mb-8">
            {messages.foundation.text}
          </p>

          <Link
            href="/statement-of-faith"
            className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition"
          >
            {messages.foundation.cta}
          </Link>
        </div>
      </section>

      <section className="bg-[#f9f7f2] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-heading text-center mb-12">
            {messages.ministries.title}
          </h2>

          <div className="grid md:grid-cols-2 gap-12">

            {/* Youth Ministry */}
            <div className="group bg-white rounded-[3rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
              <div className="p-12">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 text-yellow-500 group-hover:scale-110 transition-transform duration-500">
                  <Users size={32} />
                </div>
                <h2 className="text-3xl font-heading mb-4 text-slate-900">{ministriesMessages.youthMinistry.title}</h2>
                <p className="text-stone-500 mb-8 leading-relaxed">
                  {ministriesMessages.youthMinistry.description}
                </p>

                <Link
                  href="/ministries/youth"
                  className="inline-flex items-center gap-3 text-slate-900 font-bold uppercase text-xs tracking-widest group/link"
                >
                  {ministriesMessages.youthMinistry.cta}
                  <span className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center group-hover/link:translate-x-2 transition-transform">
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </div>
              <div className="h-2 bg-slate-900 mt-auto"></div>
            </div>

            {/* Children's Ministry */}
            <div className="group bg-white rounded-[3rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
              <div className="p-12">
                <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-8 text-slate-900 group-hover:scale-110 transition-transform duration-500">
                  <Baby size={32} />
                </div>
                <h2 className="text-3xl font-heading mb-4 text-slate-900">{ministriesMessages.childrenMinistry.title}</h2>
                <p className="text-stone-500 mb-8 leading-relaxed">
                  {ministriesMessages.childrenMinistry.description}
                </p>

                <Link
                  href="/ministries/children"
                  className="inline-flex items-center gap-3 text-slate-900 font-bold uppercase text-xs tracking-widest group/link"
                >
                  {ministriesMessages.childrenMinistry.cta}
                  <span className="w-8 h-8 rounded-full bg-slate-900 text-yellow-500 flex items-center justify-center group-hover/link:translate-x-2 transition-transform">
                    <ArrowRight size={14} />
                  </span>
                </Link>
              </div>
              <div className="h-2 bg-yellow-500 mt-auto"></div>
            </div>

          </div>
        </div>
      </section>

      <DonationSection content={messages.donationSection} />

      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-heading mb-4">
            {messages.visitUs.title}
          </h2>
          <p className="text-gray-700 mb-8">{messages.visitUs.address}</p>

          <div className="overflow-hidden rounded-2xl shadow-md border border-stone-100">
            <iframe
              title={messages.visitUs.title}
              src="https://www.google.com/maps?q=Regentenstra%C3%9Fe+78-80%2C+51063+K%C3%B6ln&output=embed"
              width="100%"
              height="420"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>

          <a
            href="https://www.google.com/maps?q=Regentenstra%C3%9Fe+78-80%2C+51063+K%C3%B6ln"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-6 text-slate-900 font-bold uppercase text-xs tracking-widest hover:underline"
          >
            {messages.visitUs.cta}
            <ArrowRight size={14} />
          </a>
        </div>
      </section>
    </>
  );
}
