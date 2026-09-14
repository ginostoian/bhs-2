const londonLocations = require("./libs/london-locations.json");

const slugifyLocation = (locationName) =>
  locationName
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

module.exports = {
  // REQUIRED: add your own domain name here (e.g. https://shipfa.st),
  siteUrl: process.env.SITE_URL || "https://bhstudio.co.uk",
  generateRobotsTxt: true,
  autoLastmod: false,
  transform: async (config, path) => ({
    loc: path,
    changefreq: config.changefreq,
    priority: config.priority,
    // Known material update; do not publish build-time dates as content updates.
    ...(path === "/blog/home-renovation-cost-london-2026" ? { lastmod: "2026-09-14" } : {}),
  }),
  // use this to exclude routes from the sitemap (i.e. a user dashboard). By default, NextJS app router metadata files are excluded (https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
  exclude: [
    "/twitter-image.*",
    "/opengraph-image.*",
    "/icon.*",
    "/apple-icon.*",
    "/api/*",
    "/admin", "/admin/*", "/dashboard", "/dashboard/*", "/employee", "/employee/*", "/designer", "/designer/*", "/referrer", "/referrer/*", "/catalogue/share/*",
    "/auth/*",
    "/bathroom-renovation-form", "/bathroom-renovation-form/*",
    "/general-renovation-form", "/kitchen-renovation-form",
    "/contact-form-submitted",
    "/kitchen-form-submitted",
    "/bathroom-form-submitted",
    "/renovation-form-submitted",
    "/gantt/*",
    "/invoices/*",
    "/quotes/*",
  ],
  additionalPaths: async (config) => {
    const locationPaths = londonLocations.map(
      (location) => `/locations/${slugifyLocation(location.name)}`
    );

    return Promise.all(
      // Contact reads searchParams, so Next renders it dynamically and it must
      // be included explicitly rather than relying on the prerender manifest.
      ["/contact", ...locationPaths].map((path) => config.transform(config, path))
    );
  },
};
