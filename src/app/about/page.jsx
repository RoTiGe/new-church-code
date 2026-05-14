"use client";

import { Quote, Church, BookOpen, Users, Cross } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";
import React from "react";

const AboutUsPage = () => {
  const { lang } = useLanguage();
  const messages = getContent(lang, "about");

  return (
    <main className="bg-[#FCFAF7] text-slate-900 font-body">
      {/* Hero Section */}
      <section className="relative h-[65vh] flex items-center justify-center bg-black overflow-hidden group">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1a1a] to-black opacity-100"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,204,21,0.08),transparent_60%)]"></div>
        </div>

        <div className="relative z-20 text-center px-6 max-w-5xl">
          <div className="mb-6 flex justify-center opacity-70">
            <div className="p-3 border border-white/20 rounded-full">
              <Cross size={20} className="text-yellow-500" strokeWidth={1} />
            </div>
          </div>

          <h1 className="font-heading text-5xl md:text-6xl leading-tight text-white mb-3 drop-shadow-lg">
            <span className="font-light italic text-gray-300">
              {messages.hero.text1}
            </span>{" "}
            <br />
            {messages.hero.text2}{" "}
            <span className="font-bold text-yellow-500">
              {messages.hero.coloredText}
            </span>
          </h1>

          <div className="relative w-40 h-[2px] mx-auto bg-yellow-500/30 group-hover:bg-yellow-500/80 transition-colors">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-500 rounded-full border-4 border-black"></div>
          </div>
        </div>
      </section>

      {/* Humble beginning */}
      <section className="py-24 max-w-5xl mx-4 px-6">
        <div className="grid md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-4 h-full flex items-center justify-center">
            <h3 className="text-4xl font-heading relative z-10 whitespace-pre-line">
              {messages.humbleBeginning.title}
            </h3>
          </div>
          <div className="md:col-span-8">
            <p className="text-xl leading-relaxed text-slate-700 first-letter:text-5xl first-letter:font-heading first-letter:mr-3 first-letter:float-left">
              {messages.humbleBeginning.text}
            </p>
          </div>
        </div>
      </section>

      {/* Evolution Section*/}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white">
            <div>
              <span className="text-yellow-500 uppercase tracking-widest text-sm font-bold">
                {messages.evolution.title}
              </span>
              <h2 className="text-4xl font-heading mt-4 mb-6">
                {messages.evolution.subtitle}
              </h2>
              <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                {messages.evolution.text}
              </p>
              {/* Formal Registration Badge */}
              <div className="mt-8 p-6 border border-slate-700 rounded-2xl bg-slate-800/50">
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-2">
                  {messages.evolution.registration.title}
                </p>
                <p className="font-mono text-yellow-500">
                  {messages.evolution.registration.date}
                </p>
                <p className="text-sm italic mt-1">
                  {messages.evolution.registration.court}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perseverance Section */}
      <section className="py-24 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <Quote
            className="mx-auto mb-6 text-yellow-500 opacity-50"
            size={40}
          />
          <h2 className="text-3xl font-heading mb-6">
            {messages.perseverance.title}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed italic">
            {messages.perseverance.text}
          </p>
        </div>
      </section>

      {/* Ministries Section */}
      <section className="py-24 bg-[#f2efe9]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-heading text-center mb-4">
            {messages.ministries.title}
          </h2>
          <p className="text-slate-600 text-center max-w-2xl mx-auto mb-16 text-lg leading-relaxed">
            {messages.ministries.description}
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Worship */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:-translate-y-2 transition-transform">
              <Church className="text-yellow-600 mb-4" />
              <h4 className="text-xl font-bold mb-3">
                {messages.ministries.list.worship.title}
              </h4>
              <p className="text-slate-600 text-sm">
                {messages.ministries.list.worship.text}
              </p>
            </div>
            {/* Word */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:-translate-y-2 transition-transform border-b-4 border-yellow-500">
              <BookOpen className="text-yellow-600 mb-4" />
              <h4 className="text-xl font-bold mb-3">
                {messages.ministries.list.word.title}
              </h4>
              <p className="text-slate-600 text-sm">
                {messages.ministries.list.word.text}
              </p>
            </div>
            {/* Bible Study */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:-translate-y-2 transition-transform">
              <Users className="text-yellow-600 mb-4" />
              <h4 className="text-xl font-bold mb-3">
                {messages.ministries.list.bibleStudy.title}
              </h4>
              <p className="text-slate-600 text-sm">
                {messages.ministries.list.bibleStudy.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-32 bg-yellow-500 text-black px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-heading mb-8 leading-tight">
            <q>{messages.quote.text}</q>
          </h2>
          <p className="text-xl font-bold tracking-[0.2em] uppercase">
            — {messages.quote.source}
          </p>
        </div>
      </section>
    </main>
  );
};

export default AboutUsPage;
