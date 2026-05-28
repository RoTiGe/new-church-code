export const metadata = {
  title: "Gallery",
  description:
    "Browse photos from worship services, fellowship events, and ministries of the Ethiopian Evangelical Church of Cologne Mülheim.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Gallery",
    description:
      "Photos from worship services, fellowship events, and ministries.",
    url: "/gallery",
    type: "website",
  },
  twitter: {
    title: "Gallery | Ethiopian Evangelical Church of Cologne Mülheim",
    description:
      "Photos from worship services, fellowship events, and ministries.",
  },
};

export default function GalleryLayout({ children }) {
  return children;
}
