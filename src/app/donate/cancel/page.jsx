'use client';

import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default function CancelPage() {
    const { lang } = useLanguage();
    const messages = getContent(lang, 'cancel');

    return (
        <section className="min-h-screen flex items-center justify-center bg-[#F1EFEC] px-6">
            <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-lg text-center">

                <XCircle size={56} className="mx-auto mb-6 text-gray-400" />

                <h2 className="font-heading text-2xl mb-2">
                    {messages.title}
                </h2>

                <p className="text-gray-600 font-body mb-6">
                    {messages.subtitle}
                </p>

                <div className="flex justify-center gap-4">
                    <Link
                        href="/donate"
                        className="rounded-xl bg-yellow-500 px-6 py-3 font-heading text-black hover:bg-yellow-400 transition"
                    >
                        {messages.buttons.donateAgain}
                    </Link>

                    <Link
                        href="/"
                        className="rounded-xl border border-black/10 px-6 py-3 font-heading hover:bg-black/5 transition"
                    >
                        {messages.buttons.home}
                    </Link>
                </div>

            </div>
        </section>
    );
}