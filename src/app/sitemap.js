const SITE_URL = "https://aeg-koeln.de";

export const dynamic = "force-static";

const routes = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/statement-of-faith", priority: 0.7, changeFrequency: "yearly" },
  { path: "/ministries", priority: 0.8, changeFrequency: "monthly" },
  { path: "/ministries/youth", priority: 0.7, changeFrequency: "monthly" },
  { path: "/ministries/children", priority: 0.7, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/events", priority: 0.8, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
  { path: "/donate", priority: 0.8, changeFrequency: "yearly" },
  { path: "/impressum", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap() {
  const lastModified = new Date();
  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
