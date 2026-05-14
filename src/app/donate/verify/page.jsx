'use client'

import { Suspense } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { CheckCircle, Loader, RefreshCcw, XCircle } from "lucide-react";
import Link from "next/link";


export default function VerifyPageWrapper() {
    return (
        <Suspense fallback={
            <section className="min-h-screen flex items-center justify-center bg-[#F1EFEC]">
                <Loader size={48} className="animate-spin text-yellow-500" />
            </section>
        }>
            <VerifyPage />
        </Suspense>
    );
}


function VerifyPage() {
    const { lang } = useLanguage();
    const messages = getContent(lang, 'verify');
    const searchParams = useSearchParams();
    const orderID = searchParams.get("token");

    const [status, setStatus] = useState({ status: "loading", reason: "" });

    const capturePayment = async () => {
        setStatus({ status: "loading", reason: "" });
        try {
            const res = await axios.post("/api/capture-order", { orderID });

            if (res.data.status === "COMPLETED") {
                setStatus({ status: "success", reason: "" });
            } else {
                setStatus({ status: "error", reason: "notCompleted" });
            }
        } catch (err) {
            const errorDetail = err.response?.data?.details?.[0]?.issue;

            if (errorDetail === "INVALID_RESOURCE_ID") {
                setStatus({ status: "error", reason: "expired" });
            } else if (errorDetail === "MAX_NUMBER_OF_PAYMENT_ATTEMPTS_EXCEEDED" || errorDetail === "ORDER_ALREADY_CAPTURED") {
                setStatus({ status: "success", reason: "" });
            } else {
                setStatus({ status: "error", reason: "failedVerification" });
            }
        }
    };

    useEffect(() => {
        if (!orderID) {
            setStatus({ status: "error", reason: "invalidSession" });
            return;
        }

        capturePayment();
    }, [orderID]);

    return (
        <section className="min-h-screen flex items-center justify-center bg-[#F1EFEC] px-6">
            <div className="max-w-md w-full bg-white rounded-3xl p-10 shadow-lg text-center">
                {status.status === "loading" && (
                    <>
                        <Loader size={48} className="animate-spin mx-auto mb-6 text-yellow-500" />
                        <h2 className="font-heading text-2xl mb-2">{messages.loading.title}</h2>
                        <p className="text-gray-500 font-body">{messages.loading.subtitle}</p>
                    </>
                )}

                {status.status === "success" && (
                    <>
                        <CheckCircle size={56} className="mx-auto mb-6 text-green-500" />
                        <h2 className="font-heading text-2xl mb-2">{messages.success.title}</h2>
                        <p className="text-gray-600 font-body mb-6">{messages.success.subtitle}</p>
                        <Link href="/" className="inline-block rounded-xl bg-yellow-500 px-6 py-3 font-heading text-black hover:bg-yellow-400 transition">
                            {messages.success.button}
                        </Link>
                    </>
                )}

                {status.status === "error" && (
                    <>
                        <XCircle size={56} className="mx-auto mb-6 text-red-500" />
                        <h2 className="font-heading text-2xl mb-2">{messages.error.title}</h2>
                        <p className="text-gray-600 font-body mb-6">{messages.error[status.reason]}</p>
                        {status.reason === "failedVerification" ? (
                            <button
                                onClick={capturePayment}
                                className="inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3 font-heading text-white hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                {<RefreshCcw size={16} />}
                                {messages.error.buttonTryAgain}
                            </button>
                        ) :
                            <Link href={status.reason === "notCompleted" ? "/donate" : "/"} className="inline-block rounded-xl bg-black px-6 py-3 font-heading text-white hover:bg-gray-800 transition">
                                {status.reason === "notCompleted" ? messages.error.buttonGoDonate : messages.error.buttonGoHome}
                            </Link>
                        }
                    </>
                )}
            </div>
        </section>
    );
}