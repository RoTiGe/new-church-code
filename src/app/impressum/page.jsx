"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";

export default function ImpressumPage() {
    const { lang } = useLanguage();
    const messages = getContent(lang, "impressum");

    return (
        <main className="bg-[#f9f7f2] min-h-screen py-24">
            <div className="max-w-4xl mx-auto px-6">

                {/* Title */}
                <h1 className="text-4xl font-heading mb-10 text-black">
                    {messages.title}
                </h1>

                {/* Card */}
                <div className="bg-white rounded-xl shadow p-8 space-y-10">

                    {/* Organization */}
                    <section>
                        <h2 className="text-xl font-heading mb-3">
                            {messages.organization.title}
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            {messages.organization.name}<br />
                            Regentenstraße 78-80<br />
                            51063 Cologne
                        </p>
                    </section>

                    {/* Representative */}
                    <section>
                        <h2 className="text-xl font-heading mb-3">
                            {messages.representedBy.title}
                        </h2>
                        <p className="text-gray-700">
                            {messages.representedBy.name}
                        </p>
                    </section>

                    {/* Contact */}
                    <section>
                        <h2 className="text-xl font-heading mb-3">
                            {messages.contact.title}
                        </h2>
                        <p className="text-gray-700">
                            {messages.contact.phone}:{" "}
                            <a href="tel:+4915566758443" className="hover:underline">
                                +49 15566 758443
                            </a>
                        </p>
                        <p className="text-gray-700">
                            {messages.contact.email}:{" "}
                            <a href="mailto:info@aeg-koeln.de" className="hover:underline">
                                info@aeg-koeln.de
                            </a>
                            {" / "}
                            <a href="mailto:kontakt@aeg-koeln.de" className="hover:underline">
                                kontakt@aeg-koeln.de
                            </a>
                        </p>
                    </section>

                    {/* Register */}
                    <section>
                        <h2 className="text-xl font-heading mb-3">
                            {messages.register.title}
                        </h2>

                        <div className="text-gray-700 leading-relaxed flex flex-col gap-1">
                            {messages.register.list.map((reg, index) => (
                                <span key={index}>{reg}</span>
                            ))}
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}