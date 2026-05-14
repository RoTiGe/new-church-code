"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";
import React from "react";

const StatementOfFaith = () => {
  const { lang } = useLanguage();
  const messages = getContent(lang, "statementOfFaith");

  return (
    <div className="bg-[#fcfaf7] min-h-screen pb-20">

      <section className="bg-black text-white pt-32 pb-20 px-6 text-center overflow-hidden relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-7xl font-heading mb-6 break-words lang-de [hyphens:auto] tracking-tight">
            {messages.hero.title1}{" "}
            <span className="italic text-yellow-500 font-serif">
              {messages.hero.title2}
            </span>
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 mt-10 relative z-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {messages.statemenList.map((belief) => (
            <div
              key={belief.id}
              className="bg-slate-900 text-white rounded-[3rem] p-8 md:p-16 mt-8 overflow-hidden"
            >
              <div className="relative z-10">
                <div>
                  <h2 className="text-4xl text-center font-heading mb-6 break-words lang-de [hyphens:auto]">
                    {belief.title}
                  </h2>
                  <p className="text-slate-400 mb-8">{belief.text}</p>

                  {belief.nested && (
                    <ul className="space-y-6">
                      {belief.list.map((b) => (
                        <li
                          key={b.label}
                          className="list-disc list-outside ml-4 marker:text-yellow-500"
                        >
                          <h4 className="font-bold uppercase tracking-wider text-xs">
                            {b.label}
                          </h4>
                          <p className="text-slate-400 text-sm">
                            {b.detail}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
export default StatementOfFaith;
