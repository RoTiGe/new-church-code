"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import AdminNav from "@/components/admin/AdminNav";
import GalleryUploadForm from "@/components/admin/GalleryUploadForm";
import GalleryImageCard from "@/components/admin/GalleryImageCard";

export default function AdminGalleryPage() {
  const router = useRouter();
  const [images, setImages] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [yearFilter, setYearFilter] = useState("all");

  async function load() {
    try {
      const res = await fetch("/api/admin/gallery", { credentials: "same-origin" });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error("Failed to load gallery.");
      const data = await res.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Failed to load gallery.");
      setImages([]);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleUpload(formData) {
    setUploading(true);
    setError(""); setMessage("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        credentials: "same-origin",
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { router.push("/admin/login"); return false; }
      if (!res.ok) throw new Error(data.error || "Upload failed.");
      setMessage(`Uploaded ${data.uploaded?.length || 0} photo(s).`);
      await load();
      return true;
    } catch (e) {
      setError(e.message || "Upload failed.");
      return false;
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveCaption(image, caption) {
    setError(""); setMessage("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: image.year, filename: image.id.split("/").slice(1).join("/"), caption }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error(data.error || "Failed to save caption.");
      setMessage("Caption saved.");
      setImages((prev) => prev?.map((img) => (img.id === image.id ? { ...img, caption } : img)) || prev);
    } catch (e) {
      setError(e.message || "Failed to save caption.");
    }
  }

  async function handleDelete(image) {
    setError(""); setMessage("");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year: image.year, filename: image.id.split("/").slice(1).join("/") }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      setMessage("Photo deleted.");
      setImages((prev) => prev?.filter((img) => img.id !== image.id) || prev);
    } catch (e) {
      setError(e.message || "Delete failed.");
    }
  }

  const years = useMemo(() => {
    if (!images) return [];
    const set = new Set(images.map((i) => i.year).filter(Boolean));
    return [...set].sort().reverse();
  }, [images]);

  const visibleImages = useMemo(() => {
    if (!images) return [];
    const filtered = yearFilter === "all" ? images : images.filter((i) => i.year === yearFilter);
    return [...filtered].sort((a, b) => {
      if (a.year !== b.year) return b.year.localeCompare(a.year);
      return (b.uploadedAt || "").localeCompare(a.uploadedAt || "");
    });
  }, [images, yearFilter]);

  return (
    <main className="min-h-screen bg-[#FCFAF7] pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <AdminNav />
        <h1 className="text-3xl font-heading mb-6">Manage Gallery</h1>

        {error && <div className="mb-4 rounded-md bg-red-50 border border-red-200 text-red-700 px-4 py-2 text-sm">{error}</div>}
        {message && <div className="mb-4 rounded-md bg-green-50 border border-green-200 text-green-700 px-4 py-2 text-sm">{message}</div>}

        <div className="mb-8">
          <GalleryUploadForm uploading={uploading} onUpload={handleUpload} />
        </div>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-xl font-heading">Existing photos {images && <span className="text-stone-500 text-sm">({images.length})</span>}</h2>
          {years.length > 0 && (
            <div className="inline-flex items-center gap-2 text-sm">
              <label htmlFor="yearFilter" className="text-stone-600">Year:</label>
              <select
                id="yearFilter"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="rounded-md border border-stone-300 px-2 py-1.5 bg-white"
              >
                <option value="all">All</option>
                {years.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          )}
        </div>

        {images === null && (
          <div className="p-8 text-center text-stone-500 inline-flex items-center justify-center gap-2 w-full">
            <Loader2 size={16} className="animate-spin" /> Loading…
          </div>
        )}
        {images?.length === 0 && (
          <div className="bg-white rounded-2xl border border-stone-100 p-8 text-center text-stone-500">
            No photos yet. Use the form above to upload some.
          </div>
        )}
        {visibleImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {visibleImages.map((img) => (
              <GalleryImageCard
                key={img.id}
                image={img}
                onSaveCaption={handleSaveCaption}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
