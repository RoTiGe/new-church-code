"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Loader2 } from "lucide-react";
import EventForm from "@/components/admin/EventForm";
import EventRow from "@/components/admin/EventRow";

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState(null);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/events", { credentials: "same-origin" });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error("Failed to load events.");
      setEvents(await res.json());
    } catch (e) {
      setError(e.message || "Failed to load events.");
      setEvents([]);
    }
  }

  useEffect(() => { load(); }, []);

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    router.push("/admin/login");
  }

  async function submitEvent(formData, eventId) {
    setSaving(true);
    setError("");
    try {
      const url = eventId ? `/api/admin/events/${eventId}` : "/api/admin/events";
      const method = eventId ? "PUT" : "POST";
      const res = await fetch(url, { method, credentials: "same-origin", body: formData });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error(data.error || "Save failed.");
      setCreating(false);
      setEditing(null);
      await load();
    } catch (e) {
      setError(e.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteEvent(id) {
    if (!window.confirm("Delete this event permanently?")) return;
    try {
      const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE", credentials: "same-origin" });
      if (res.status === 401) { router.push("/admin/login"); return; }
      if (!res.ok) throw new Error("Delete failed.");
      await load();
    } catch (e) {
      setError(e.message || "Delete failed.");
    }
  }

  const formOpen = creating || editing !== null;

  return (
    <main className="min-h-screen bg-[#FCFAF7] pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-heading">Manage Events</h1>
          <div className="flex gap-2">
            {!formOpen && (
              <button
                onClick={() => setCreating(true)}
                className="inline-flex items-center gap-2 rounded-md bg-yellow-500 hover:bg-yellow-400 px-4 py-2 font-heading text-black"
              >
                <Plus size={16} /> New event
              </button>
            )}
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-md bg-stone-200 hover:bg-stone-300 px-4 py-2 text-stone-800"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}

        {formOpen && (
          <EventForm
            event={editing}
            saving={saving}
            onCancel={() => { setCreating(false); setEditing(null); }}
            onSubmit={(fd) => submitEvent(fd, editing?.id)}
          />
        )}

        {!formOpen && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            {events === null && (
              <div className="p-8 text-center text-stone-500 inline-flex items-center justify-center gap-2 w-full">
                <Loader2 size={16} className="animate-spin" /> Loading…
              </div>
            )}
            {events?.length === 0 && (
              <div className="p-8 text-center text-stone-500">No events yet. Click “New event” to create one.</div>
            )}
            {events?.length > 0 && (
              <ul className="divide-y divide-stone-100">
                {events.map((ev) => (
                  <EventRow
                    key={ev.id}
                    event={ev}
                    onEdit={() => setEditing(ev)}
                    onDelete={() => deleteEvent(ev.id)}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
