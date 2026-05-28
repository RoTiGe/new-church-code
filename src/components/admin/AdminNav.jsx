"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Calendar, Image as ImageIcon } from "lucide-react";

const TABS = [
  { href: "/admin/events", label: "Events", icon: Calendar },
  { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
];

export default function AdminNav() {
  const router = useRouter();
  const pathname = usePathname() || "";

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    router.push("/admin/login");
  }

  return (
    <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
      <nav className="inline-flex rounded-md border border-stone-200 bg-white overflow-hidden">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                active
                  ? "bg-slate-900 text-yellow-500"
                  : "text-stone-700 hover:bg-stone-50"
              }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={logout}
        className="inline-flex items-center gap-2 rounded-md bg-stone-200 hover:bg-stone-300 px-4 py-2 text-stone-800"
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}
