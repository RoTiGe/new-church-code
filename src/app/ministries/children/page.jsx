"use client";

import React from 'react';
import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";
import { BookOpen, Handshake, ShieldCheck, Sun, Users, Baby, MessageCircle } from "lucide-react";

const ChildrensMinistry = () => {
    const { lang } = useLanguage();
    const messages = getContent(lang, "childrenMinistry");

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
                        {messages.vision.text1}
                    </p>
                    <p className="mt-8 text-stone-500 max-w-2xl mx-auto italic">
                        {messages.vision.text2}
                    </p>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-12 px-6 max-w-7xl mx-auto">
                <div className="max-w-xl mb-12">
                    <h2 className="text-4xl font-heading mb-4">{messages.coreValues.title}</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Biblical Foundation */}
                    <div className="bg-slate-900 p-10 rounded-[2rem] border border-stone-100">
                        <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center mb-8">
                            <BookOpen className="text-slate-900" />
                        </div>
                        <h3 className="text-2xl font-heading mb-4 text-white">{messages.coreValues.foundation.title}</h3>
                        <p className="text-stone-400 leading-relaxed text-sm">
                            {messages.coreValues.foundation.text}
                        </p>
                    </div>

                    {/* Holistic Development */}
                    <div className="bg-slate-900 p-10 rounded-[2rem] border border-stone-100">
                        <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center mb-8">
                            <Baby className="text-slate-900" />
                        </div>
                        <h3 className="text-2xl font-heading mb-4 text-white">{messages.coreValues.development.title}</h3>
                        <p className="text-stone-400 leading-relaxed text-sm">
                            {messages.coreValues.development.text}
                        </p>
                    </div>

                    {/* Language and Cultural Connection */}
                    <div className="bg-slate-900 p-10 rounded-[2rem] border border-stone-100">
                        <div className="w-14 h-14 bg-yellow-500 rounded-2xl flex items-center justify-center mb-8">
                            <Users className="text-slate-900" />
                        </div>
                        <h3 className="text-2xl font-heading mb-4 text-white">{messages.coreValues.connection.title}</h3>
                        <p className="text-stone-400 leading-relaxed text-sm">
                            {messages.coreValues.connection.text}
                        </p>
                    </div>
                </div>
            </section>

            {/* Safety Guideline*/}
            <section className="py-20 px-6 bg-stone-100">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-[3rem] p-8 md:p-16 shadow-sm border border-stone-200 flex flex-col md:flex-row gap-12">
                        <div className="md:w-1/3">
                            <div className="inline-flex p-4 bg-yellow-500/10 rounded-2xl mb-6">
                                <ShieldCheck className="text-yellow-600" size={32} />
                            </div>
                            <h2 className="text-3xl font-heading mb-4">{messages.safety.title}</h2>
                            <p className="text-stone-500 text-sm leading-relaxed">
                                {messages.safety.label}
                            </p>
                        </div>
                        <div className="md:w-2/3 grid sm:grid-cols-2 gap-x-12 gap-y-8">
                            <div>
                                <h4 className="font-bold text-slate-800 mb-2">{messages.safety.safetyStandards.teachers.title}</h4>
                                <p className="text-stone-500 text-xs leading-relaxed">{messages.safety.safetyStandards.teachers.text}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-2">{messages.safety.safetyStandards.environment.title}</h4>
                                <p className="text-stone-500 text-xs leading-relaxed">{messages.safety.safetyStandards.environment.text}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-2">{messages.safety.safetyStandards.supervision.title}</h4>
                                <p className="text-stone-500 text-xs leading-relaxed">{messages.safety.safetyStandards.supervision.text}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 mb-2">{messages.safety.safetyStandards.communication.title}</h4>
                                <p className="text-stone-500 text-xs leading-relaxed">{messages.safety.safetyStandards.communication.text}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fellowship, Continuity & question */}
            <section className="py-24 px-6 max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                <div className="bg-yellow-500 p-10 rounded-[2rem] text-slate-900">
                    <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mb-6">
                        <Handshake size={24} />
                    </div>
                    <h3 className="text-xl font-heading mb-3">{messages.fellowship.title}</h3>
                    <p className="text-sm leading-relaxed">
                        {messages.fellowship.text}
                    </p>
                </div>

                <div className="bg-slate-200 p-10 rounded-[2rem] text-slate-700">
                    <div className="w-12 h-12 bg-black/5 rounded-xl flex items-center justify-center mb-6">
                        <Sun size={24} />
                    </div>
                    <h3 className="text-xl font-heading mb-3">{messages.service.title}</h3>
                    <p className="text-sm leading-relaxed">
                        {messages.service.text}
                    </p>
                </div>

                <div className="bg-white p-10 rounded-[2rem] border border-stone-200 text-slate-700">
                    <div className="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center mb-6">
                        <MessageCircle size={24} className="text-yellow-600" />
                    </div>
                    <h3 className="text-xl font-heading mb-3">{messages.questions.title}</h3>
                    <p className="text-sm leading-relaxed">
                        {messages.questions.text}
                    </p>
                </div>
            </section>
        </main>
    );
};

export default ChildrensMinistry;