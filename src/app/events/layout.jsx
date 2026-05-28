export const metadata = {
  title: "Events",
  description:
    "Upcoming events at the Ethiopian Evangelical Church of Cologne Mülheim — special services, conferences, fellowship gatherings, and more.",
  alternates: { canonical: "/events" },
  openGraph: {
    title: "Events",
    description: "Upcoming events at the Ethiopian Evangelical Church of Cologne Mülheim.",
    url: "/events",
    type: "website",
  },
  twitter: {
    title: "Events | Ethiopian Evangelical Church of Cologne Mülheim",
    description: "Upcoming events and gatherings.",
  },
};

export default function EventsLayout({ children }) {
  return children;
}
