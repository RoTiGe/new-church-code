"use client";

import React, { useState, useEffect } from 'react';
import Image from "next/image";

import { useLanguage } from "@/context/LanguageContext";
import { getContent } from "@/lib/getMessages";
import { Calendar } from 'lucide-react';
import { ImageCardSkeleton } from '@/components/LoadingSkeletons';
import { ErrorBlock } from '@/components/ErrorBlock';

const GalleryPage = () => {
    const [images, setImages] = useState([]);
    const [years, setYears] = useState([]);
    const [activeImage, setActiveImage] = useState(null);
    const [activeYear, setActiveYear] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const { lang } = useLanguage();
    const messages = getContent(lang, "gallery");

    const fetchGallery = async () => {
        try {
            setError(false);
            setLoading(true);

            const res = await fetch('/api/gallery');
            if (!res.ok) {
                const errBody = await res.json().catch(() => null);
                console.error('Gallery API error:', errBody || res.statusText);
                setError(true);
                return;
            }

            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error('Gallery API returned unexpected payload:', data);
                setError(true);
                return;
            }

            setImages(data);
            const uniqueYears = [...new Set(data.map(img => img.year).filter(Boolean))].sort().reverse();
            setYears(uniqueYears);
            setActiveYear(uniqueYears[0] || "");
        } catch (error) {
            setError(true);
            console.log("Error on fetching gallery: ", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchGallery();
    }, []);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setActiveImage(null);
        };

        window.addEventListener("keydown", handleEsc);

        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);


    const filteredImages = images.filter(img => img.year === activeYear);

    return (
        <main className="bg-[#FAF9F6] min-h-screen">

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-gradient-to-b from-[#030303] via-[#0d0d0d] to-[#1a1a1a] text-white overflow-hidden">

                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[480px] h-[480px] bg-yellow-500/10 blur-3xl rounded-full" />
                </div>

                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h1 className="font-heading text-4xl md:text-5xl tracking-tight">
                        {messages.heroTitle}
                    </h1>
                    <p className="mt-6 font-body text-gray-300 text-lg">
                        {messages.heroSubtitle}
                    </p>
                </div>
            </section>

            {/* Loading State */}
            {loading &&
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 px-4 py-4">
                    <ImageCardSkeleton count={6} />
                </div>
            }

            {/* Error State */}
            {!loading && error && <ErrorBlock onRetry={fetchGallery} />}

            {/* Empty State Card */}
            {!loading && !error && images.length === 0 && (
                <section className="py-20 px-6 max-w-7xl mx-auto text-center">
                    <div className="bg-white border-2 border-dashed border-stone-200 rounded-3xl p-12 flex flex-col items-center">
                        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mb-6">
                            <Calendar size={32} className="text-stone-400" />
                        </div>
                        <h3 className="text-2xl font-heading text-slate-800 mb-2">
                            {messages.noImagesTitle}
                        </h3>
                        <p className="text-stone-500 font-body max-w-sm mx-auto">
                            {messages.noImagesSubtitle}
                        </p>
                    </div>
                </section>
            )}

            {!loading && !error && images.length > 0 &&
                (
                    <>
                        {/* Year Selection Tabs */}
                        < section className="sticky top-0 z-30 bg-[#FAF9F6]/80 backdrop-blur-md border-b border-stone-200 py-6">
                            <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-4 md:gap-8">
                                {years.map((year) => (
                                    <button
                                        key={year}
                                        onClick={() => setActiveYear(year)}
                                        className={`px-6 py-2 rounded-full text-sm font-bold tracking-widest transition-all duration-300 ${activeYear === year
                                            ? "bg-slate-900 text-yellow-500 shadow-lg"
                                            : "bg-white border border-slate-900 hover:border-yellow-500 hover:text-yellow-600"
                                            }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Image Grid */}
                        <section className="py-16 px-6 max-w-7xl mx-auto">
                            <div className="flex items-center gap-4 mb-12">
                                <div className="h-[1px] flex-grow bg-stone-200"></div>
                                <h2 className="text-2xl font-heading text-slate-800 flex items-center gap-2">
                                    <Calendar size={20} className="text-yellow-600" />
                                    Year {activeYear}
                                </h2>
                                <div className="h-[1px] flex-grow bg-stone-200"></div>
                            </div>


                            {/* <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                                {filteredImages.length > 0 ? filteredImages.map((image) => (
                                    <button
                                        key={image?.id}
                                        className="mb-6 block w-full break-inside-avoid group relative bg-white overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition"
                                        onClick={() => setActiveImage(image)}
                                    >
                                        <div className="relative aspect-[4/3] w-full">
                                            <Image
                                                src={image?.url}
                                                alt={`Gallery image ${image?.id}`}
                                                fill
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                    </button>
                                )) : (
                                    <div className="col-span-full py-20 text-center">
                                        <p className="text-stone-400 italic">{messages.noSelectedImage}</p>
                                    </div>
                                )}
                            </div> */}

                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
                                {filteredImages.length > 0 ? filteredImages.map((image) => (
                                    <button
                                        key={image?.id}
                                        className="mb-6 block w-full break-inside-avoid group relative bg-white overflow-hidden rounded-2xl shadow-sm hover:shadow-lg transition"
                                        onClick={() => setActiveImage(image)}
                                    >
                                        {/* 1. Removed aspect ratio wrapper */}
                                        <Image
                                            src={image?.url}
                                            alt={`Gallery image ${image?.id}`}
                                            // 2. Use the image's intrinsic dimensions
                                            width={image?.width || 800}
                                            height={image?.height || 600}
                                            // 3. Ensure it spans the column width
                                            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </button>
                                )) : (
                                    <div className="col-span-full py-20 text-center">
                                        <p className="text-stone-400 italic">{messages.noSelectedImage}</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )
            }

            {/* Selected Image displayer */}
            {
                activeImage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        {/* Backdrop */}
                        <div
                            onClick={() => setActiveImage(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Image */}
                        <div className="relative z-10 max-h-[85vh] max-w-[90vw] flex flex-col items-center">
                            <Image
                                src={activeImage?.url}
                                alt={activeImage?.caption || `Gallery image ${activeImage?.id}`}
                                width={activeImage?.width || 1200}
                                height={activeImage?.height || 800}
                                className="rounded-xl shadow-2xl max-h-[80vh] w-auto object-contain"
                                priority
                            />
                            {activeImage?.caption && (
                                <p className="mt-3 max-w-2xl text-center text-sm sm:text-base text-white/90 px-4">
                                    {activeImage.caption}
                                </p>
                            )}
                        </div>
                    </div>
                )
            }
        </main >
    );
};

export default GalleryPage;