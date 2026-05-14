"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";
import DonationForm from "@/components/donate/DonationForm";

export default function Donate() {
    const { lang } = useLanguage();
    const messages = getContent(lang, 'donate');

    return (
        <main>
            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-[#030303] via-[#0d0d0d] to-[#1a1a1a] text-white overflow-hidden">

                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[480px] h-[480px] bg-yellow-500/10 blur-3xl rounded-full" />
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="font-heading text-4xl md:text-5xl mb-6">
                        {messages.intro.title}
                    </h1>
                    <p className="font-body text-gray-300 text-lg max-w-2xl mx-auto">
                        {messages.intro.subtitle}
                    </p>
                </div>
            </section>

            {/* Donation Form */}
            <DonationForm content={messages.form} />

            {/* Impact Section */}
            <section className="py-24 bg-[#FFFEFC]">
                <div className="max-w-6xl mx-auto px-6">

                    <h3 className="font-heading text-3xl mb-12 text-center">
                        {messages.impact.title}
                    </h3>

                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {messages.impact.items.map(item => (
                            <div
                                key={item.title}
                                className="relative rounded-2xl border border-black/10 p-8 text-center hover:shadow-xl transition bg-gradient-to-b from-[#030303] via-[#0d0d0d] to-[#1a1a1a] text-white overflow-hidden"
                            >
                                <div className="absolute inset-0 pointer-events-none">
                                    <div className="absolute top-5 left-1/2 -translate-x-1/2 w-[480px] h-[480px] bg-yellow-500/10 blur-3xl rounded-full" />
                                </div>

                                <h4 className="font-heading text-lg mb-3">
                                    {item.title}
                                </h4>
                                <p className="font-body text-gray-300 text-sm">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 bg-[#F1EFEC]">
                <div className="max-w-3xl mx-auto px-6 text-center">
                    <p className="font-body text-gray-700">
                        {messages.trust.message}
                    </p>
                </div>
            </section>

            {/* Closing Section */}
            <section className="py-24 bg-[#030303] text-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <p className="font-body text-gray-300 mb-4">
                        {messages.closing.quote}
                    </p>
                    <span className="font-heading text-sm text-yellow-400">
                        {messages.closing.reference}
                    </span>
                </div>
            </section>

        </main>
    )
}