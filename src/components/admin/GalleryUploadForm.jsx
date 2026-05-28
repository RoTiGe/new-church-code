"use client";

import { useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";

const MAX_FILES = 20;
const MAX_CAPTION = 500;

export default function GalleryUploadForm({ uploading, onUpload }) {
  const fileInputRef = useRef(null);
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(String(currentYear));
  const [caption, setCaption] = useState("");
  const [files, setFiles] = useState([]);

  function onFiles(e) {
    const picked = Array.from(e.target.files || []);
    setFiles(picked.slice(0, MAX_FILES));
  }

  function reset() {
    setFiles([]);
    setCaption("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (files.length === 0) return;
    const fd = new FormData();
    fd.append("year", year);
    fd.append("caption", caption);
    for (const f of files) fd.append("images", f);
    const ok = await onUpload(fd);
    if (ok) reset();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 md:p-8 space-y-5"
    >
      <div className="flex items-center gap-2">
        <Upload size={18} className="text-yellow-600" />
        <h2 className="text-xl font-heading">Upload new photos</h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block text-sm">
          <span className="block text-stone-700 mb-1">
            Year <span className="text-red-600">*</span>
          </span>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="2000"
            max="2100"
            required
            className="w-full rounded-md border border-stone-300 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
          />
          <span className="block text-xs text-stone-500 mt-1">
            Used as the year-tab on the public gallery.
          </span>
        </label>

        <label className="block text-sm">
          <span className="block text-stone-700 mb-1">Images <span className="text-red-600">*</span></span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={onFiles}
            className="block w-full text-sm"
            required
          />
          <span className="block text-xs text-stone-500 mt-1">
            JPEG / PNG / WEBP. Max 5 MB each, up to {MAX_FILES} per batch.
          </span>
        </label>
      </div>

      <label className="block text-sm">
        <span className="block text-stone-700 mb-1">
          Comment / caption <span className="text-stone-500 font-normal">(optional)</span>
        </span>
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value.slice(0, MAX_CAPTION))}
          maxLength={MAX_CAPTION}
          rows={3}
          placeholder="e.g. Easter service 2025"
          className="w-full rounded-md border border-stone-300 px-3 py-2 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
        />
        <span className="block text-xs text-stone-500 mt-1">
          Applied to every photo in this upload. You can edit captions individually below afterwards.
          {caption.length > 0 && ` ${caption.length}/${MAX_CAPTION}`}
        </span>
      </label>

      {files.length > 0 && (
        <p className="text-sm text-stone-700">
          {files.length} file{files.length === 1 ? "" : "s"} selected.
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
        <button
          type="button"
          onClick={reset}
          disabled={uploading}
          className="rounded-md border border-stone-300 hover:bg-stone-50 px-4 py-2 text-stone-800 disabled:opacity-60"
        >
          Clear
        </button>
        <button
          type="submit"
          disabled={uploading || files.length === 0}
          className="rounded-md bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 px-4 py-2 font-heading text-black inline-flex items-center gap-2"
        >
          {uploading && <Loader2 size={14} className="animate-spin" />}
          {uploading ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}
