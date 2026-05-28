"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { ChevronDown } from "lucide-react";

const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "de", label: "Deutsch" },
    { code: "am", label: "Amharic" },
];

export default function LanguageSwitcher({ sidebar }) {
    const { lang, changeLanguage } = useLanguage();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentLang = LANGUAGES.find((l) => l.code === lang);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger button */}
            <button
                onClick={() => setOpen(!open)}
                className={`flex justify-center border border-yellow-500 ${sidebar ? "w-full" : "min-w-[7rem] px-4"} items-center gap-2 py-2 bg-black/60 text-white rounded-md font-heading text-sm hover:bg-black/80 transition`}
            >
                <span>{currentLang?.label}</span>
                <ChevronDown
                    size={16}
                    className={`transition-transform ${open ? "rotate-180" : ""}`}
                />
            </button>

            {/* Dropdown menu */}
            {open && (
                <ul
                    className={`absolute right-0 bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden z-50 ${sidebar ? "left-0 right-0 bottom-full mb-2 w-full" : "mt-2 w-36"}`}
                >
                    {LANGUAGES.map((language) => (
                        <li key={language.code}>
                            <button
                                onClick={() => {
                                    changeLanguage(language.code);
                                    setOpen(false);
                                }}
                                className={`flex items-center w-full px-3 py-2 text-sm hover:bg-yellow-100 transition ${lang === language.code ? "bg-yellow-200 font-medium" : ""
                                    }`}
                            >
                                <span>{language.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}