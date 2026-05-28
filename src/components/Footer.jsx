"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";

const Footer = () => {
  const { lang } = useLanguage();
  const messages = getContent(lang, "footer");

  return (
    <footer className="bg-gray-100 text-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        {/* Column 1: Contact */}
        <div>
          <h4 className="font-semibold mb-3">{messages.contact.title}</h4>
          <p>{messages.contact.address}: Regentenstraße 78-80, 51063 Köln</p>
          <p className="mt-2">{messages.contact.representative}: Haileselassie G. Gebrehiwot</p>
          <p className="mt-2">
            {messages.contact.phone}:{" "}
            <a href="tel:+4915566758443" className="hover:underline">
              +49 15566 758443
            </a>
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 className="font-semibold mb-3">{messages.quickLinks.title}</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/contact">{messages.quickLinks.contact}</Link>
            </li>
            <li>
              <Link href="/about">{messages.quickLinks.aboutUs}</Link>
            </li>
            <li>
              <Link href="/impressum">{messages.quickLinks.legalNotice}</Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div>
          <h4 className="font-semibold mb-3">{messages.legal.title}</h4>
          <p>Äthiopische Evangelische Gemeinde Köln Mülheim e.V.</p>
          <p>{messages.legal.registerNo}: VR 19124 (Amtsgericht Köln)</p>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="border-t text-center py-4 text-sm text-gray-600">
        © 2026 Ethiopian Evangelical Church of Cologne Mülheim. All Rights
        Reserved.
      </div>
    </footer>
  );
};

export default Footer;