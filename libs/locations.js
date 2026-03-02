import rawLocations from "@/libs/london-locations.json";

export const slugifyLocation = (locationName) =>
  locationName
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

export const LONDON_LOCATIONS = rawLocations.map((location) => ({
  ...location,
  slug: slugifyLocation(location.name),
}));

const locationMap = new Map(LONDON_LOCATIONS.map((location) => [location.slug, location]));

export const getLocationBySlug = (slug) =>
  locationMap.get(String(slug || "").toLowerCase()) || null;

export const getGroupedLocations = () =>
  LONDON_LOCATIONS.reduce((acc, location) => {
    if (!acc[location.area]) {
      acc[location.area] = [];
    }
    acc[location.area].push(location);
    return acc;
  }, {});

export const getNearbyLocations = (currentSlug, maxCount = 6) => {
  const currentLocation = getLocationBySlug(currentSlug);
  if (!currentLocation) return [];

  return LONDON_LOCATIONS.filter(
    (location) =>
      location.area === currentLocation.area && location.slug !== currentSlug
  ).slice(0, maxCount);
};

const AREA_CONTEXT = {
  "North East London":
    "North East London projects often involve family homes and period terraces where thoughtful space planning, structural clarity, and a clean site routine make the biggest difference to day-to-day life.",
  "East London":
    "East London projects frequently blend character buildings with contemporary living requirements, so we focus on practical layouts, premium finishes, and tight programme control from day one.",
  "South London":
    "South London renovations often require balancing architectural character with modern functionality, which is why our process prioritises detailed scope control before work starts.",
  "Central London":
    "Central London projects demand precise planning, strong coordination, and discreet delivery standards, particularly in high-value homes where finish quality and communication are non-negotiable.",
};

export const getAreaContext = (areaName) =>
  AREA_CONTEXT[areaName] ||
  "Every project is managed with detailed planning, disciplined execution, and transparent communication.";
