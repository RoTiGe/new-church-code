"use client";

import { useRef, useState } from "react";
import { Loader2, X } from "lucide-react";

const LANGS = [
  { code: "en", label: "English", required: true },
  { code: "de", label: "Deutsch", required: false },
  { code: "am", label: "Amharic", required: false },
];

function isoDateInput(iso) {
  if (!iso) return "";
  try { return new Date(iso).toISOString().slice(0, 10); } catch { return ""; }
}

export default function EventForm({ event, saving, onCancel, onSubmit }) {
  const isEdit = Boolean(event);
  const fileInputRef = useRef(null);
  const [keepImages, setKeepImages] = useState(event?.images || []);
  const [newFiles, setNewFiles] = useState([]);

  function removeExisting(filename) {
    setKeepImages((prev) => prev.filter((f) => f !== filename));
  }

  function onFiles(e) {
    const files = Array.from(e.target.files || []);
    setNewFiles(files.slice(0, 5 - keepImages.length));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const fd = new FormData();
    for (const { code } of LANGS) {
      fd.append(`title_${code}`, form[`title_${code}`].value);
      fd.append(`description_${code}`, form[`description_${code}`].value);
    }
    fd.append("expiresAt", form.expiresAt.value);
    fd.append("eventDate", form.eventDate.value);
    fd.append("eventTime", form.eventTime.value);
    fd.append("location", form.location.value);
    fd.append("keepImages", JSON.stringify(keepImages));
    for (const f of newFiles) fd.append("images", f);
    onSubmit(fd);
  }

  const totalImages = keepImages.length + newFiles.length;

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 md:p-8 space-y-6">
      <h2 className="text-xl font-heading">{isEdit ? "Edit event" : "New event"}</h2>

      {LANGS.map(({ code, label, required }) => (
        <div key={code} className="space-y-2">
          <div className="flex items-baseline justify-between">
            <h3 className="font-medium text-stone-800">{label}</h3>
            {!required && <span className="text-xs text-stone-500">Optional — falls back to English</span>}
          </div>
          <input
            name={`title_${code}`}
            defaultValue={event?.translations?.[code]?.title || ""}
            required={required}
            maxLength={200}
            placeholder={`Title (${label})`}
            className="w-full rounded-md border border-stone-300 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
          />
          <textarea
            name={`description_${code}`}
            defaultValue={event?.translations?.[code]?.description || ""}
            required={required}
            maxLength={5000}
            rows={4}
            placeholder={`Description (${label})`}
            className="w-full rounded-md border border-stone-300 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
          />
        </div>
      ))}

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="block text-stone-700 mb-1">Expires on <span className="text-red-600">*</span></span>
          <input type="date" name="expiresAt" required defaultValue={isoDateInput(event?.expiresAt)} className="w-full rounded-md border border-stone-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="block text-stone-700 mb-1">Event date (optional)</span>
          <input type="date" name="eventDate" defaultValue={isoDateInput(event?.eventDate)} className="w-full rounded-md border border-stone-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="block text-stone-700 mb-1">Event time (optional)</span>
          <input type="text" name="eventTime" placeholder="e.g. 10:00 AM" defaultValue={event?.eventTime || ""} maxLength={32} className="w-full rounded-md border border-stone-300 px-3 py-2" />
        </label>
        <label className="block text-sm">
          <span className="block text-stone-700 mb-1">Location (optional)</span>
          <input type="text" name="location" placeholder="e.g. Regentenstraße 78-80" defaultValue={event?.location || ""} maxLength={300} className="w-full rounded-md border border-stone-300 px-3 py-2" />
        </label>
      </div>

      <div>
        <h3 className="font-medium text-stone-800 mb-2">Images <span className="text-xs text-stone-500 font-normal">({totalImages}/5)</span></h3>
        {keepImages.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-3">
            {keepImages.map((f) => (
              <div key={f} className="relative aspect-square rounded-md overflow-hidden border border-stone-200 bg-stone-50">
                <img src={`/event-images/${f}`} alt="" className="absolute inset-0 w-full h-full object-cover" />
                <button type="button" onClick={() => removeExisting(f)} className="absolute top-1 right-1 rounded-full bg-black/60 text-white p-1 hover:bg-black/80" aria-label="Remove image">
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={onFiles} className="block text-sm" />
        {newFiles.length > 0 && (
          <p className="mt-2 text-xs text-stone-600">{newFiles.length} new file(s) selected.</p>
        )}
        <p className="mt-1 text-xs text-stone-500">JPEG, PNG, or WEBP. Max 5 MB each, up to 5 images total. The first image is used as the cover.</p>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
        <button type="button" onClick={onCancel} className="rounded-md border border-stone-300 hover:bg-stone-50 px-4 py-2 text-stone-800">
          Cancel
        </button>
        <button type="submit" disabled={saving} className="rounded-md bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 px-4 py-2 font-heading text-black inline-flex items-center gap-2">
          {saving && <Loader2 size={14} className="animate-spin" />}
          {saving ? "Saving…" : isEdit ? "Save changes" : "Create event"}
        </button>
      </div>
    </form>
  );
}
