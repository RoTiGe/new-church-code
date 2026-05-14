import enContent from "@/messages/en/content.json";
import amContent from "@/messages/am/content.json";
import deContent from "@/messages/de/content.json";

export function getContent(lang, page) {
    switch (lang) {
        case "am":
            return amContent[page];
        case "de":
            return deContent[page];
        default:
            return enContent[page];
    }
}