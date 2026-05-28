export const metadata = {
  title: "Impressum",
  description:
    "Legal notice (Impressum) for the Ethiopian Evangelical Church of Cologne Mülheim — represented by the executive board in accordance with § 5 DDG.",
  alternates: { canonical: "/impressum" },
  openGraph: {
    title: "Impressum",
    description:
      "Legal notice for the Ethiopian Evangelical Church of Cologne Mülheim.",
    url: "/impressum",
    type: "website",
  },
  twitter: {
    title: "Impressum | Ethiopian Evangelical Church of Cologne Mülheim",
    description:
      "Legal notice for the Ethiopian Evangelical Church of Cologne Mülheim.",
  },
};

export default function ImpressumLayout({ children }) {
  return children;
}
