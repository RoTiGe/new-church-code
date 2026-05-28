"use client";

import { useEffect, useState } from "react";
import { Loader2, Save, Trash2 } from "lucide-react";

const MAX_CAPTION = 500;

export default function GalleryImageCard({ image, onSaveCaption, onDelete }) {
  const [caption, setCaption] = useState(image.caption || "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setCaption(image.caption || "");
  }, [image.caption]);

  const dirty = (caption || "") !== (image.caption || "");
  const canDelete = image.source === "uploaded";

  async function save() {
    setSaving(true);
    await onSaveCaption(image, caption);
    setSaving(false);
  }

  async function del() {
    if (!window.confirm("Delete this photo from the gallery? This cannot be undone.")) return;
    setDeleting(true);
    await onDelete(image);
    setDeleting(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-col">
      <div className="relative aspect-[4/3] bg-stone-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image.url}
          alt={image.caption || image.id}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
        <span
          className={`absolute top-2 left-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
            canDelete ? "bg-yellow-500 text-black" : "bg-stone-900/80 text-white"
          }`}
        >
          {canDelete ? "Uploaded" : "Committed"}
        </span>
        <span className="absolute top-2 right-2 inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-xs text-stone-700">
          {image.year}
        </span>
      </div>
      <div className="p-4 flex flex-col gap-3 flex-1">
        <label className="block text-xs text-stone-600">
          Comment / caption
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value.slice(0, MAX_CAPTION))}
            maxLength={MAX_CAPTION}
            rows={3}
            placeholder="Optional caption"
            className="mt-1 w-full rounded-md border border-stone-300 px-2 py-1.5 text-sm focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none"
          />
        </label>
        <p className="text-[11px] text-stone-400 break-all">{image.id}</p>
        <div className="flex items-center justify-between gap-2 mt-auto">
          <button
            onClick={save}
            disabled={!dirty || saving}
            className="inline-flex items-center gap-1.5 rounded-md bg-slate-900 text-yellow-500 hover:bg-slate-800 disabled:opacity-50 px-3 py-1.5 text-sm"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? "Saving…" : "Save caption"}
          </button>
          {canDelete ? (
            <button
              onClick={del}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 rounded-md border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50 px-3 py-1.5 text-sm"
            >
              {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              Delete
            </button>
          ) : (
            <span
              className="text-xs text-stone-500 italic"
              title="Committed images are in the source repository and must be removed by a developer."
            >
              repo-managed
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
