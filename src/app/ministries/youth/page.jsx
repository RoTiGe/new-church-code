"use client"

import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";
import { BookOpen, Heart, Share2, Sun } from 'lucide-react';

const YouthMinistry = () => {
    const { lang } = useLanguage();
    const messages = getContent(lang, "youthMinistry");

    return (
        <main className="bg-[#FAF9F6] min-h-screen">

            <section className="relative py-4 flex items-center justify-center bg-black overflow-hidden">

                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[120px]"></div>

                <div className="relative z-10 max-w-4xl mt-20 text-center px-6">
                    <h1 className="text-3xl md:text-5xl font-heading text-white leading-tight mb-8 italic">
                        <q>{messages.hero.text1} <span className="text-yellow-500">{messages.hero.text2}</span></q>
                    </h1>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                        <span className="text-xs font-bold uppercase tracking-[0.2em]">{messages.hero.source}</span>
                    </div>
                </div>
            </section>

            {/* Vision */}
            <section className="py-24 px-6 bg-white border-b border-stone-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl uppercase tracking-[0.3em] text-stone-400 font-bold mb-6">{messages.vision.title}</h2>
                    <p className="text-3xl md:text-4xl font-heading text-slate-800 leading-snug">
                        {messages.vision.text}
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="py-12 px-6 max-w-7xl mx-auto">
                <div className="max-w-xl">
                    <h2 className="text-4xl font-heading mb-4">{messages.mission.title}</h2>
                    <p className="text-stone-500 py-3">{messages.mission.text}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* Christian Identity */}
                    <div className="bg-slate-900 p-12 rounded-[2rem] shadow-sm border border-stone-100">
                        <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center mb-8">
                            <Sun className="text-slate-900" />
                        </div>
                        <h3 className="text-2xl font-heading mb-4 text-white">{messages.mission.identity.title}</h3>
                        <p className="text-stone-400 leading-relaxed">
                            {messages.mission.identity.text}
                        </p>
                    </div>

                    {/* Shaped by the Word */}
                    <div className="bg-slate-900 p-12 rounded-[2rem] shadow-sm border border-stone-100">
                        <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center mb-8">
                            <BookOpen className="text-slate-900" />
                        </div>
                        <h3 className="text-2xl font-heading mb-4 text-white">{messages.mission.shaped.title}</h3>
                        <p className="text-stone-400 leading-relaxed">
                            {messages.mission.shaped.text}
                        </p>
                    </div>

                    {/* Communion of the Saints */}
                    <div className="bg-slate-900 p-12 rounded-[2rem] shadow-sm border border-stone-100">
                        <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center mb-8">
                            <Heart className="text-slate-900" />
                        </div>
                        <h3 className="text-2xl font-heading mb-4 text-white">{messages.mission.saints.title}</h3>
                        <p className="text-stone-400 leading-relaxed">
                            {messages.mission.saints.text}
                        </p>
                    </div>

                    {/* Living Out God’s Goodness */}
                    <div className="bg-slate-900 p-12 rounded-[2rem] shadow-sm border border-stone-100">
                        <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center mb-8">
                            <Share2 className="text-slate-900" />
                        </div>
                        <h3 className="text-2xl font-heading mb-4 text-white">{messages.mission.goodness.title}</h3>
                        <p className="text-stone-400 leading-relaxed">
                            {messages.mission.goodness.text}
                        </p>
                    </div>

                </div>
            </section>

        </main>
    );
};

export default YouthMinistry;