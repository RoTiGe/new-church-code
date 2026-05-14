"use client";

import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";
import Link from 'next/link';
import { ArrowRight, Sparkles, Baby, Users } from 'lucide-react';

const MinistriesPage = () => {
  const { lang } = useLanguage();
  const messages = getContent(lang, "ministries");

  return (
    <main className="bg-[#FAF9F6] min-h-screen">

      {/* Hero Section */}
      <section className="relative py-24 flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px]"></div>

        <div className="relative z-10 max-w-4xl mt-10 text-center px-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 mb-6">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">{messages.hero.label}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-heading text-white leading-tight mb-6">
            {messages.hero.title.text1} <span className="text-yellow-500 italic">{messages.hero.title.text2}</span>
          </h1>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto">
            {messages.hero.description}
          </p>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">

          {/* youth ministry */}
          <div className="group bg-white rounded-[3rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
            <div className="p-12">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mb-8 text-yellow-500 group-hover:scale-110 transition-transform duration-500">
                <Users size={32} />
              </div>
              <h2 className="text-3xl font-heading mb-4 text-slate-900">{messages.youthMinistry.title}</h2>
              <p className="text-stone-500 mb-8 leading-relaxed">
                {messages.youthMinistry.description}
              </p>

              <Link
                href="/ministries/youth"
                className="inline-flex items-center gap-3 text-slate-900 font-bold uppercase text-xs tracking-widest group/link"
              >
                {messages.youthMinistry.cta}
                <span className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center group-hover/link:translate-x-2 transition-transform">
                  <ArrowRight size={14} />
                </span>
              </Link>
            </div>
            {/* Visual bottom accent */}
            <div className="h-2 bg-slate-900 mt-auto"></div>
          </div>

          {/* Children'S ministry */}
          <div className="group bg-white rounded-[3rem] overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
            <div className="p-12">
              <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mb-8 text-slate-900 group-hover:scale-110 transition-transform duration-500">
                <Baby size={32} />
              </div>
              <h2 className="text-3xl font-heading mb-4 text-slate-900">{messages.childrenMinistry.title}</h2>
              <p className="text-stone-500 mb-8 leading-relaxed">
                {messages.childrenMinistry.description}
              </p>

              <Link
                href="/ministries/children"
                className="inline-flex items-center gap-3 text-slate-900 font-bold uppercase text-xs tracking-widest group/link"
              >
                {messages.childrenMinistry.cta}
                <span className="w-8 h-8 rounded-full bg-slate-900 text-yellow-500 flex items-center justify-center group-hover/link:translate-x-2 transition-transform">
                  <ArrowRight size={14} />
                </span>
              </Link>
            </div>
            {/* Visual bottom accent */}
            <div className="h-2 bg-yellow-500 mt-auto"></div>
          </div>

        </div>
      </section>

      <section className="py-20 bg-stone-100 border-y border-stone-200">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-2xl font-heading text-slate-800 italic">
            <q>{messages.transitionQuote}</q>
          </p>
        </div>
      </section>

    </main>
  );
};

export default MinistriesPage;