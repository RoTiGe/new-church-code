"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getLanguage, setLanguage } from "@/lib/language";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState("en");

    useEffect(() => {
        setLang(getLanguage());
    }, []);

    const changeLanguage = (newLang) => {
        setLanguage(newLang);
        setLang(newLang);
    };

    return (
        <LanguageContext.Provider value={{ lang, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);