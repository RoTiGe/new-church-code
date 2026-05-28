export const metadata = {
  title: "About Us",
  description:
    "Learn about the Ethiopian Evangelical Church of Cologne Mülheim — our story, mission, and the community we serve in Köln since 1995.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us",
    description:
      "Learn about the Ethiopian Evangelical Church of Cologne Mülheim — our story and mission in Köln.",
    url: "/about",
    type: "website",
  },
  twitter: {
    title: "About Us | Ethiopian Evangelical Church of Cologne Mülheim",
    description: "Our story and mission in Köln.",
  },
};

export default function AboutLayout({ children }) {
  return children;
}
