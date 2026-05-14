'use client';

import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";
import { RefreshCw, AlertTriangle } from "lucide-react";

export const ErrorBlock = ({ onRetry }) => {
    const { lang } = useLanguage();
    const messages = getContent(lang, 'error');

    return (
        <div
            className="rounded-2xl bg-[#FFFEFC] p-10
                       text-center
                       shadow-[0_10px_30px_rgba(0,0,0,0.04)]
                       ring-1 ring-red-500/10"
        >
            {/* Icon */}
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center
                            rounded-full bg-red-50 text-red-500">
                <AlertTriangle size={26} />
            </div>

            {/* Text */}
            <h3 className="font-heading text-xl text-gray-800 mb-2">
                {messages.title}
            </h3>

            <p className="font-body text-gray-600 max-w-md mx-auto mb-6">
                {messages.description}
            </p>

            {/* Retry */}
            <button
                onClick={onRetry}
                className="inline-flex items-center gap-2
                           rounded-full bg-yellow-500 px-6 py-3
                           font-body text-sm font-medium text-white
                           transition-all duration-200
                           hover:bg-yellow-600
                           active:scale-95"
            >
                <RefreshCw size={16} />
                {messages.cta}
            </button>
        </div>
    );
};