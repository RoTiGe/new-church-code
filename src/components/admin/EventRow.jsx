"use client";

import { Pencil, Trash2, Calendar } from "lucide-react";

export default function EventRow({ event, onEdit, onDelete }) {
  const expired = Date.parse(event.expiresAt) < Date.now();
  const title = event.translations?.en?.title || "(untitled)";
  const expiry = new Date(event.expiresAt).toLocaleDateString(undefined, {
    year: "numeric", month: "short", day: "numeric",
  });

  return (
    <li className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-heading text-lg truncate">{title}</h3>
          {expired && (
            <span className="inline-flex items-center rounded-full bg-stone-200 text-stone-700 px-2 py-0.5 text-xs">
              Expired
            </span>
          )}
        </div>
        <div className="text-sm text-stone-500 mt-1 inline-flex items-center gap-1.5">
          <Calendar size={14} />
          {event.eventDate ? `${event.eventDate}${event.eventTime ? " · " + event.eventTime : ""}` : `Expires ${expiry}`}
          {event.location && <span className="ml-1">· {event.location}</span>}
        </div>
      </div>
      <div className="flex gap-2 sm:flex-shrink-0">
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1.5 rounded-md border border-stone-300 hover:bg-stone-50 px-3 py-1.5 text-sm text-stone-800"
        >
          <Pencil size={14} /> Edit
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center gap-1.5 rounded-md border border-red-200 hover:bg-red-50 px-3 py-1.5 text-sm text-red-700"
        >
          <Trash2 size={14} /> Delete
        </button>
      </div>
    </li>
  );
}
