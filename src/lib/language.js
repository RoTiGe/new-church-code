const DEFAULT_LANG = "en";
const isBrowser = typeof window !== "undefined" && typeof localStorage !== "undefined";

export function getLanguage() {
    if (!isBrowser) return DEFAULT_LANG;

    try {
        return localStorage.getItem("lang") || DEFAULT_LANG;
    } catch (error) {
        console.warn("Unable to read language from localStorage:", error);
        return DEFAULT_LANG;
    }
}

export function setLanguage(lang) {
    if (!isBrowser) return;

    try {
        localStorage.setItem("lang", lang);
    } catch (error) {
        console.warn("Unable to persist language to localStorage:", error);
    }
}