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
  // use this to exclude routes from the sitemap (i.e. a user dashboard). By default, NextJS app router metadata files are excluded (https://nextjs.org/docs/app/api-reference/file-conventions/metadata)
  exclude: [
    "/twitter-image.*",
    "/opengraph-image.*",
    "/icon.*",
    "/apple-icon.*",
    "/auth/*",
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
      locationPaths.map((path) => config.transform(config, path))
    );
  },
};
