"use client";

import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import NavDropdown from "./NavDropdown";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { lang } = useLanguage();
  const messages = getContent(lang, "navbar");

  const navLinks = [
    { href: "/", label: messages.links.home },
    { href: "/about", label: messages.links.about },
    { href: "/statement-of-faith", label: messages.links.statementOfFaith },
    { href: "/impressum", label: messages.links.legalNotice },
    { href: "/gallery", label: messages.links.gallery },
  ];

  return (
    <>
      {/* Navbar */}
      <header className="w-full fixed top-0 z-50 bg-black/60 backdrop-blur-md">
        <nav className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">

          {/* Left: Desktop navigator / Mobile menu button */}
          <div className="flex items-center justify-self-start">
            <div className="hidden lg:block font-heading">
              <NavDropdown
                label={<Menu size={22} />}
                links={navLinks}
              />
            </div>

            <button
              onClick={() => setOpen(true)}
              className="lg:hidden text-white"
              aria-label="Open menu"
            >
              <Menu size={26} />
            </button>
          </div>

          {/* Center: Page title */}
          <Link
            href="/"
            className="font-heading text-center text-2xl tracking-wide text-white justify-self-center whitespace-nowrap"
          >
            <span>{messages.logo}</span>
          </Link>

          {/* Right: Donate button + Language switcher (desktop only) */}
          <div className="justify-self-end">
            <div className="hidden lg:flex items-center gap-3">
              <Link
                href="/donate"
                className="rounded-md bg-yellow-500 px-4 py-2 font-heading text-sm text-black hover:bg-yellow-400 transition"
              >
                {messages.links.donate}
              </Link>
              <LanguageSwitcher sidebar={false} />
            </div>
          </div>
        </nav>
      </header>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-1/2 max-w-xs bg-[#F1EFEC] transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          {/* Close */}
          <button
            onClick={() => setOpen(false)}
            className="self-start mb-10"
            aria-label="Close menu"
          >
            <X size={26} />
          </button>

          {/* Links */}
          <nav className="flex flex-col gap-6 font-heading text-lg mb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/donate"
            onClick={() => setOpen(false)}
            className="block text-center rounded-md bg-yellow-500 px-4 py-3 font-heading text-black hover:bg-yellow-400 transition mb-4"
          >
            {messages.links.donate}
          </Link>

          <LanguageSwitcher sidebar={true} />
        </div>
      </aside>
    </>
  );
};

export default Navbar;
